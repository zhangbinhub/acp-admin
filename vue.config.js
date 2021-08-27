// 解决WebStorm无法识别vue-cli3+中的别名“@”
// 将"node_modules/@vue/cli-service/webpack.config.js"配置到IDE设置中"File | Settings | Languages & Frameworks | JavaScript | Webpack"
//
// vue.config.js 配置说明
// 官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/#css-loaderoptions
// 这里只列一部分，具体配置参考文档
const path = require('path');
const resolve = (dir) => path.join(__dirname, dir);
module.exports = {
  publicPath: '/admin', // 部署应用时的根路径(默认'/'),也可用相对路径(当使用相对路径时，router中也需要配置base为对应的路径)
  outputDir: 'dist', // 运行时生成的生产环境构建文件的目录(默认''dist''，构建之前会被清除)
  assetsDir: 'public', // 放置生成的静态资源(s、css、img、fonts)的(相对于 outputDir 的)目录(默认'')
  indexPath: 'index.html', // 指定生成的 index.html 的输出路径(相对于 outputDir)也可以是一个绝对路径。
  pages: {
    // pages 里配置的路径和文件名在你的文档目录必须存在 否则启动服务会报错
    index: {
      // 除了 entry 之外都是可选的
      entry: 'src/main.js', // page 的入口,每个“page”应该有一个对应的 JavaScript 入口文件
      template: 'public/index.html', // 模板来源
      filename: 'index.html', // 在 dist/index.html 的输出
      title: 'Index Page', // 当使用 title 选项时,在 template 中使用：<title><%= htmlWebpackPlugin.options.title %></title>
      chunks: ['chunk-vendors', 'chunk-common', 'index'] // 在这个页面中包含的块，默认情况下会包含,提取出来的通用 chunk 和 vendor chunk
    }
  },
  lintOnSave: false, // 是否在保存的时候检查
  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
  // 本地开发环境代理设置，它支持webPack-dev-server的所有选项
  devServer: {
    // 环境配置
    // host: '192.168.1.53',
    // port: 8080,
    // https: false,
    // hotOnly: false,
    // open: true, //配置自动启动浏览器
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      // 配置多个代理(配置一个 proxy: 'http://localhost:4000' )
      '/v1/api': {
        target: 'http://127.0.0.1:8771/api',
        pathRewrite: {
          '^/v1/api': '/'
        }
      }
    }
  },
  css: {
    extract: true
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('vue-i18n', 'vue-i18n/dist/vue-i18n.cjs.js')
      .set('@', resolve('src'))
  },
  pluginOptions: {
    // 第三方插件配置
    // ...
  }
}
