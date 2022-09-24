/** @type {import('stylelint').Config} */
const config = {
    extends: [
        'stylelint-config-standard',
        'stylelint-config-standard-scss',
        // stylelintのPrettierと重複するルールをオフする
        'stylelint-config-prettier',
    ],
    rules: {
        'at-rule-no-unknown': null, //scssで使える @includeなどにエラーがでないようにする
        'scss/at-rule-no-unknown': true, //scssでもサポートしていない @ルール にはエラーを出す
        'no-invalid-position-at-import-rule': null,
        'rule-empty-line-before': null,
        'property-no-vendor-prefix': null,
        'value-keyword-case': null,
        'declaration-empty-line-before': null,
        'length-zero-no-unit': null,
        'function-url-quotes': 'never',
        'scss/no-global-function-names': null,
        'scss/operator-no-newline-after': null,
        'color-hex-length': 'long',
        'scss/dollar-variable-empty-line-before': null,
    },
    ignoreFiles: ['**/node_modules/**'],
};
module.exports = config;
