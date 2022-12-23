/*
 * @Author: 闫佳佳 18332162809@163.com
 * @Date: 2022-11-13 00:39:57
 * @LastEditors: 闫佳佳 18332162809@163.com
 * @LastEditTime: 2022-12-23 18:12:13
 * @FilePath: /screen/src/main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from 'vue'
import ElementUI from 'element-ui';
import axios from './axios'
import 'element-ui/lib/theme-chalk/index.css';
import dataV from '@jiaminghi/data-view'
import router from './router.js';
import { website } from '@/config.js'
import { loadScript } from '@/utils/utils'
import App from './App.vue'
import './styles/common.scss'
import '@/utils/es6'
import '@/mock/'
//导入主题文件
import '@/theme/index.js'
Vue.config.productionTip = false
window.axios = axios;
window.$loadScript = loadScript;
document.title = website.title
Vue.use(ElementUI);
Vue.use(window.AVUE);
Vue.prototype.$website = website;
Vue.use(dataV)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
