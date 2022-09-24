/** @type {import('@types/babel__preset-env').Options} */
const presetEnvOptions = {
    // 必要なpolyfillのみ入れる
    useBuiltIns: 'usage',
    // polyfillを利用するcore-jsのバージョンを指定
    corejs: '3.25',
};

/** @type {import('@types/babel__core').TransformOptions} */
const babelOptions = {
    presets: [
        [
            // プリセットを指定し、最新仕様(ES2020)をES5に変換
            '@babel/preset-env',
            { ...presetEnvOptions },
        ],
        ['@babel/preset-typescript'],
    ],
    sourceType: 'unambiguous',
};

const config = (api) => {
    console.log(typeof api);
    // 計算された設定をパーマキャッシュし、この関数を二度と呼び出さないようにする
    api.cache(true);

    // Babelのオプションを指定
    babelOptions;
};

module.exports = config;
