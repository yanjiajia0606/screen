/*
 * @Author: 闫佳佳 18332162809@163.com
 * @Date: 2022-06-08 15:15:30
 * @LastEditors: 闫佳佳 18332162809@163.com
 * @LastEditTime: 2022-12-16 17:32:09
 * @FilePath: /avue-data/vue.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports = {
  publicPath: process.env.VUE_APP_PATH,
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        implementation: require("sass"), // This line must in sass option
      },
    },
  },
  transpileDependencies: ["monaco-editor", "@jiaminghi/data-view"],
  chainWebpack: (config) => {
    //忽略的打包文件
    config.externals({
      vue: "Vue",
      "vue-router": "VueRouter",
      vuex: "Vuex",
      axios: "axios",
      "element-ui": "ELEMENT",
    });
  },
  devServer: {
    proxy: {
      "^/api": {
        target: "https://192.168.183.104/",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api",
        },
      },
      "^/sr": {
        target: "http://172.27.13.26:8088/",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/sr": "",
        },
      },
    },
  },
};
