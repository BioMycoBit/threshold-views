const { override, addWebpackModuleRule } = require('customize-cra');

module.exports = override(
  addWebpackModuleRule({
    test: /\.ya?ml$/,
    use: 'yaml-loader',
  })
); 