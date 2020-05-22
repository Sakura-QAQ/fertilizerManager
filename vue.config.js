module.exports = {
  lintOnSave: false,
  publicPath: ''
  // publicPath: '/console/'
}
// publicPath: process.env.NODE_ENV === 'production' ?
//   '/production-sub-path/' :
//   '/'
/* 根据后端服务器需求使用 (vuecli3有默认配置)
const path = require('path')

module.exports = {
  publicPath: '/', // 公共路径
  outputDir: process.env.NODE_ENV === 'development' ? 'devdist' : 'dist', // 不同的环境打不同包名
  // css: { // 一次配置，全局使用，这个scss 因为每个文件都要引入
  //   loaderOptions: {
  //     sass: {
  //       data: `@import "./src/assets/hotcss/px2rem.scss";`
  //     }
  //   }
  // },
  lintOnSave: false, // 关闭eslint
  productionSourceMap: true, // 生产环境下css 分离文件
  devServer: { // 配置服务器
    port: 8081,
    open: true,
    https: false,
    overlay: {
      warnings: true,
      errors: true
    }
  },
  configureWebpack: { // 覆盖webpack默认配置的都在这里
    resolve: { // 配置解析别名
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@h': path.resolve(__dirname, './src/assets/icon'),
        '@i': path.resolve(__dirname, './src/assets/images'),
        '@s': path.resolve(__dirname, './src/styles')
      }
    }
  }
}
*/
