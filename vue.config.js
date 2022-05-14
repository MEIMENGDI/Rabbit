const path = require('path')
module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.join(__dirname, './src/assets/styles/variables.less'),
        path.join(__dirname, './src/assets/styles/mixins.less')
      ]
    }
  },
  devServer: {
    host: '0.0.0.0',
    public: '192.168.124.10',

    hot: true,

    disableHostCheck: true

  },
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 10000 }))
  },
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://pcapi-xiaotuxian-front-devtest.itheima.net/',//接口的前缀
        ws: true,//代理websocked
        changeOrigin: true,//虚拟的站点需要更管origin
        pathRewrite: {
          '^/api': ''//重写路径
        }
      }
    }
  },
  // 这个是给webpack-dev-server开启可IP和域名访问权限。
  chainWebpack: config => {
    config.devServer.disableHostCheck(true)
  },
  // # 这个是设置外部扩展，模块为qc变量名为QC，导入qc将不做打包。
  configureWebpack: {
    externals: {
      qc: 'QC'
    }
  }
}
