/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const path = require('path');
const Sass = require('sass');
const glob = require('glob');

// html
const HtmlWebpackPlugin = require('html-webpack-plugin'); // webpackで生成したJSやCSSを埋め込んだHTMLを生成する
// css
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // cssファイルを個別のファイルに抽出、cssを含むjsファイルごとにcssファイルを生成
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // buildフォルダをクリーンアップさせる
const StylelintPlugin = require('stylelint-webpack-plugin'); // stylelintをwebpackで使う際に必要
// js
const TerserPlugin = require('terser-webpack-plugin'); // terserを使用してJSを縮小
// eslint
const ESLintPlugin = require('eslint-webpack-plugin'); // ESLintをwebpackで使う際に必要
// その他
const CopyWebpackPlugin = require('copy-webpack-plugin'); // ファイルをコピーする
/* eslint-disable @typescript-eslint/no-var-requires */

// 付与するキャッシュパラメータ
const cacheParam = new Date().getTime().toString(16) + Math.floor(1000 * Math.random()).toString(16);

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

const src = path.resolve(__dirname, 'src'); // source files
const build = path.resolve(__dirname, 'dist'); // production build files

const pathList = glob
    .sync('**/*.ts', {
        ignore: '**/_*.ts',
        cwd: path.resolve(__dirname, './src/assets/scripts/pages/'),
    })
    .map((jsPath) => {
        return [
            path.basename(jsPath, path.extname(jsPath)),
            path.resolve(__dirname, 'src/assets/scripts/pages/' + jsPath + ''),
        ];
    });
const entries = Object.fromEntries(pathList);

const htmlList = glob
    .sync('**/*.html', {
        cwd: path.resolve(__dirname, './src/pages/'),
    })
    .map((htmlPath) => {
        return [path.basename(htmlPath, '.html'), htmlPath];
    });

const generateHtml = () =>
    htmlList
        .filter((item) => item.length > 1)
        .map(
            (item) =>
                new HtmlWebpackPlugin({
                    inject: 'head', // アセットをhtmlのどこに設置するか
                    scriptLoading: 'defer', // defer：JSの読み込みをブロックしない
                    cacheParam: '?ver=' + cacheParam,
                    template: path.resolve(__dirname, `./src/pages/${item[1]}`),
                    filename: item[1],
                    chunks: [item[0], 'common'],
                    minify: false,
                })
        );

/**
 * @type import('webpack-dev-server').ClientConfiguration
 */
const clientConfig = {
    overlay: true, // コンパイラーエラーや警告があるときに、ブラウザ全体に表示
    progress: true, // コンパイルの進捗をブラウザにパーセント表示
};

/**
 * @type import('webpack-dev-server').Configuration
 */
const devServerConfig = {
    // 再ロードなしに、変更したファイルに関連するモジュールのみをブラウザが動的に読み込みこませる
    hot: 'only',
    port: 8000,
    // 存在しないパスをリクエストされた場合、404を返さずindexファイルを戻すようにする
    historyApiFallback: true,
    // ファイルの変更を監視する
    watchFiles: ['src/**/*'],
    // ディレクトリから静的ファイルを提供するためのオプションを設定
    static: {
        // サーバーにコンテンツを提供する場所を指定
        directory: build,
    },
    // ブラウザのログレベルを設定
    client: clientConfig,
    // webpack-dev-serverがあるポートで接続を待ち始めたときに、カスタム関数を実行する機能を提供
    onListening: (devServer) => {
        if (!devServer) {
            throw new Error('webpack-dev-server is not defined');
        }
        const port = devServer.server.address().port;
        console.log('Listening on port:', port);
    },
};

/**
 * @type import('webpack').WebpackOptionsNormalized
 */
const webpackConfig = {
    context: path.resolve(__dirname, 'src/assets'),
    // バンドルのエントリーポイントとなるJavaScriptファイルを指定
    entry: entries,
    // バンドルの出力先のファイル名とディレクトリを指定
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'assets/scripts/[name].bundle.js?[chunkhash]',
        assetModuleFilename: '../[path][name][ext]',
        publicPath: '',
        environment: {
            arrowFunction: false,
        },
    },
    // development / production
    mode: process.env.NODE_ENV || 'development',
    // ローカルサーバー
    devServer: { ...devServerConfig },
    // ローダーの設定
    module: {
        rules: [
            {
                test: /\.(js|ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        // Babelを利用
                        loader: 'babel-loader',
                    },
                ],
            },
            {
                test: /\.(js|ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            // コンパイルのみで型検査を行わない
                            transpileOnly: true,
                        },
                    },
                ],
            },
            {
                test: /(\.s[ac]ss)$/,
                use: [
                    // 4. cssをjsファイルと別々に生成
                    MiniCssExtractPlugin.loader,
                    {
                        // 3. Cssの依存関係を解決
                        loader: 'css-loader',
                        options: {
                            sourceMap: isDev,
                        },
                    },
                    {
                        // 2. PostCSS（autoprefixer）の設定
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: isDev,
                        },
                    },
                    {
                        // 1. sassをcssにコンパイル
                        loader: 'sass-loader',
                        options: {
                            // dart-sass を優先
                            implementation: Sass,
                            sourceMap: isDev,
                        },
                    },
                ],
            },
            // stylesheetで読み込んでいる画像を出力フォルダにコピー
            {
                test: /\.(gif|png|jpe?g|svg|eot|wof|woff|woff2|ttf)$/i,
                // loader: 'file-loader', webpack5以降は以下
                // asset -> asset/resourceとasset/inlineを自動選択する(閾値: 8kb)
                type: 'asset/inline',

                // ファイルの大きさにより、自動的にasset/resourceかasset/inlineの実行を決定する
                // 8kb以下の場合は、inlineとなりそれ以上はresourceとなる
                parser: {
                    dataUrlCondition: {
                        maxSize: 4 * 1024, // 4kb
                    },
                },
            },
        ],
    },
    target: isDev ? 'web' : 'browserslist',
    plugins: [
        // 画面の再描画すること無しにJSの変更をブラウザに適用
        new webpack.HotModuleReplacementPlugin(),

        // cssファイルを外だしにする
        new MiniCssExtractPlugin({
            filename: 'assets/styles/[name].css?[chunkhash]',
        }),

        // buildフォルダをクリーンアップ
        new CleanWebpackPlugin({
            // コンソールへのログの書き込み
            verbose: true,
            // 再構築時に未使用のwebpackアセットを自動で削除
            cleanStaleWebpackAssets: false,
        }),

        // 環境変数をモジュールに渡す
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        }),

        new ESLintPlugin({
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            exclude: 'node_modules',
        }),

        // 指定するファイルやディレクトリをビルドディレクトリへコピー
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(src, 'assets', 'images'),
                    to: path.resolve(build, 'assets', 'images'),
                    toType: 'dir',
                    globOptions: {
                        ignore: ['*.DS_Store', '**/.keep'],
                    },
                },
            ],
        }),

        // スタイルのエラー回避と規約の徹底を支援
        new StylelintPlugin(),

        ...generateHtml(),
    ],
    // デフォルトの最適化を上書き（変更）
    optimization: {
        // production modeで最適化を実行
        minimize: isProd,
        // デフォルトの圧縮方法を変更
        minimizer: [
            // JS用のminifyプラグイン
            new TerserPlugin({
                // 並列処理の実行を有効化（複数スレッドでビルドすることで高速化）
                parallel: true,
                // コメントを除くかどうか
                extractComments: false,
            }),
        ],
        // 複数のエントリーポイント間で利用している共通モジュールをバンドルしたファイルを出力するための設定
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    // ファイル名
                    name: 'vendor',
                    chunks: 'all', // initial、async、all
                    // ファイルサイズの制限を無視してchunkをまとめる
                    enforce: true,
                },
            },
        },
        // ランタイムコードを別々のチャンクに分割するための最適化機能
        runtimeChunk: {
            // ランタイムを1個にする
            // ➜'vendor' というチャンクにランタイムが生成され、常にそのランタイムが使われる
            name: 'vendor',
        },
    },
    stats: {
        children: true,
    },
    // モジュール解決の設定を変更
    // モジュール解決：importが何を参照するのかを把握するために、コンパイラを利用するプロセス
    resolve: {
        // importの際に拡張子を省略することができる
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
};

module.exports = webpackConfig;
