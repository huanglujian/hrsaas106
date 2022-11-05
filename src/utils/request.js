import axios from 'axios'

import { Message } from 'element-ui'

//! 创建一个axios的示例
const service = axios.create({
  //! 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理
  baseURL: process.env.VUE_APP_BASE_API, //! 设置axios请求的基础地址
  timeout: 5000 //! 定义请求超过5秒超时
})
service.interceptors.request.use() //! 请求拦截器
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
    Message.error(error.message) //! 提示错误信息
    return Promise.reject(error) //! 返回执行错误，让当前的执行链跳出成功，直接进入catch
  }
) //! 响应拦截器
export default service
