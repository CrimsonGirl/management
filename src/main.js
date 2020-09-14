import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'lib-flexible/flexible';

import 'vant/lib/index.css';
// 全局引入按需引入UI库 vant
import '@/plugins/vant'

// 引入全局样式
import '@/assets/css/index.scss'
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
