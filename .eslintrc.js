/** @type {import('@typescript-eslint/utils').TSESLint.Linter.Config} */
const config = {
    root: true, //.eslintrc.jsがプロジェクトのルートに配置させているか
    env: {
        browser: true, // ブラウザで実行されるコードを検証
        node: true,
        es2021: true,
    },
    parser: '@typescript-eslint/parser', // ESLintにTypeScriptを理解させる
    parserOptions: {
        project: ['./tsconfig.json'],
        sourceType: 'module', // ES Modules機能を有効
        ecmaVersion: 'latest', // ECMAScript 最新
        warnOnUnsupportedTypeScriptVersion: false, // 明示的にサポートされていないバージョンのtsを使用した場合、parserが表示する警告を切り替える
    },
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended', // eslint:recommendedに含まれるルールを型チェックでカバーできるものは無効化
        'plugin:@typescript-eslint/recommended', // 型チェックが不要なルールを適用
        'plugin:@typescript-eslint/recommended-requiring-type-checking', // 型チェックが必要なルールを適用
        'prettier',
    ],
    rules: {
        '@typescript-eslint/explicit-module-boundary-types': ['off'],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-var-requires': 'warn',
    },
};
module.exports = config;
