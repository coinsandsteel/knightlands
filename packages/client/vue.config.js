let optimization;

if (process.env.NODE_ENV !== "dev") {
  const TerserPlugin = require("terser-webpack-plugin");

  // optimization = {
  //   minimize: true,
  //   splitChunks: {
  //     cacheGroups: {
  //       vendors: {
  //         name: 'chunk-vendors',
  //         test: /[\\/]node_modules[\\/]/,
  //         priority: -10,
  //         chunks: 'initial'
  //       },
  //       common: {
  //         name: 'chunk-common',
  //         minChunks: 2,
  //         priority: -20,
  //         chunks: 'initial',
  //         reuseExistingChunk: true
  //       }
  //     }
  //   },
  //   minimizer: [
  //     /* config.optimization.minimizer('terser') */
  //     new TerserPlugin(
  //       {
  //         terserOptions: {
  //           compress: {
  //             arrows: false,
  //             collapse_vars: true,
  //             comparisons: false,
  //             computed_props: false,
  //             hoist_funs: false,
  //             hoist_props: false,
  //             hoist_vars: false,
  //             inline: false,
  //             loops: false,
  //             negate_iife: false,
  //             properties: false,
  //             reduce_funcs: false,
  //             reduce_vars: false,
  //             switches: false,
  //             toplevel: false,
  //             typeofs: false,
  //             booleans: true,
  //             if_return: true,
  //             sequences: true,
  //             unused: true,
  //             conditionals: true,
  //             dead_code: true,
  //             evaluate: true,
  //             drop_console: true
  //           },
  //           mangle: {
  //             safari10: true
  //           }
  //         },
  //         sourceMap: true,
  //         cache: true,
  //         parallel: true,
  //         extractComments: false
  //       }
  //     )
  //   ]
  // }
}

module.exports = {
  devServer: {
    hot: true,
    liveReload: true
  },
  configureWebpack: {
    devtool: "source-map",
    optimization: optimization
  },
  chainWebpack: config => { 
    config.output 
      .filename(`js/[name].[hash:8].js`)
      .chunkFilename(`js/[name].[hash:8].js`) 
  }, 
  // css: {
  //     loaderOptions: {
  //         postcss: {
  //             plugins: [],
  //         }
  //     }
  // },
  lintOnSave: false,
  productionSourceMap: false
};