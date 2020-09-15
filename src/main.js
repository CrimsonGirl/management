import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'lib-flexible/flexible';

import 'vant/lib/index.css';
// 全局引入按需引入UI库 vant
import '@/plugins/vant'
// 按需引入Element UI
// import '@/plugins/elementui'
// 全局引入Element UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import axios from 'axios';
// 配置请求的根路径
axios.defaults.baseURL ='http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$axios = axios

// 引入全局样式
import '@/assets/css/index.scss'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
