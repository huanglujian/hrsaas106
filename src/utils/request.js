import store from '@/store'
import axios from 'axios'

import { Message } from 'element-ui'

import { getTimeStamp } from '@/utils/auth'

import router from '@/router'

const Timeout = 3600 //! 定义超时时间

//! 创建判断是否超时的函数
function IsCheckTimeout() {
  const currentTime = Date.now() //! 当前时间戳
  const timeStamp = getTimeStamp() //! 缓存的时间戳
  return (currentTime - timeStamp) / 1000 > Timeout
}

//! 创建一个axios的示例
const service = axios.create({
  //! 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理
  baseURL: process.env.VUE_APP_BASE_API, //! 设置axios请求的基础地址
  timeout: 5000 //! 定义请求超过5秒超时
})

//! 请求拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) { //! 如果token存在，注入token
    if (IsCheckTimeout()) { //! 为true就表示超时了
      store.dispatch('user/logout') //! 删除token和个人信息
      router.push('/login') //! 跳转到 login
      return Promise.reject(new Error('token超时了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config //! 必须返回配置
}, error => {
  return Promise.reject(error)
})

//! 响应拦截器
service.interceptors.response.use(
  response => {
    const { data: { success, message, data }} = response
    // console.log(success, message, data)
    if (success) { //! 根据success的成功与否决定下面的操作
      return data
    } else { //! 业务已经错误，不能进入then，进入catch
      Message.error(message)
      return Promise.reject(new Error(message))
    }
  },
  error => {
    //! error信息里面 response 对象
    if (error.response && error.response.data && error.response.data.code === 10002) { //! 当等于10002时，后端就会告诉我token超时了
      store.dispatch('user/logout')
      router.push('/login')
    } else {
      Message.error(error.message) //! 提示错误信息
    }
    return Promise.reject(error) //! 返回执行错误，让当前的执行链跳出成功，直接进入catch
  }
)
export default service
