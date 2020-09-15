import axios from 'axios'
import store from '@/store'
import { Toast } from 'vant'
// 根据环境不同引入不同api地址
const {baseUrl} = require('../config/env.'+process.env.NODE_ENV+".js")
console.log(baseUrl)
// create an axios instance
const service = axios.create({
    baseURL: baseUrl, // url = base api url + request url
    // timeout: 5000 // request timeout
  })

  // request拦截器 request interceptor
service.interceptors.request.use(
    config => {
      // 不传递默认开启loading
      if (!config.hideloading) {
        // loading
        Toast.loading({
          forbidClick: true
        })
      }
      // console.log(store.state.app.token,"111")
      if (store.state.app.token) {
        config.headers.token = store.state.app.token
      }
      return config
    },
    error => {
      console.log(error) // for debug
      return Promise.reject(error)
    }
  )

  // respone拦截器
service.interceptors.response.use(
    response => {
      Toast.clear()
      const res = response.data
      if (res.status && res.status !== 200) {
        // 登录超时,重新登录
        if (res.status === 401) {
          store.dispatch('FedLogOut').then(() => {
            location.reload()
          })
        }
        return Promise.reject(res || 'error')
      } else {
        return Promise.resolve(res)
      }
    },
    error => {
      console.log('err' + error) // for debug
      return Promise.reject(error)
    }
  )
  
  export default service