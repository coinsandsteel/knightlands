let optimization;
let plugins = [];

if (process.env.NODE_ENV === "production") {
  const WebpackShellPlugin = require('webpack-shell-plugin');
  plugins.push(
    new WebpackShellPlugin({
      onBuildEnd: ['node -r esm -r ts-node/register src/commands/sync_version.js']
    })
  );
}

module.exports = {
  devServer: {
    hot: true,
    liveReload: true
  },
  configureWebpack: {
    devtool: "source-map",
    optimization: optimization,
    plugins: plugins
  },
  chainWebpack: config => {
    config.output
      .filename(`js/[name].[hash:8].js`)
      .chunkFilename(`js/[name].[hash:8].js`)
  },
  lintOnSave: false,
  productionSourceMap: false
};