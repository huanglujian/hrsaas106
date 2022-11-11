//!  该文件用于负责所有的公共组件的全局注册
import PageTools from './PageTools'

//! VUE.use()   这个方法执行的就是 install(Vue) 里面的代码
export default {
  install(Vue) {
    //! 注册全局通用栏组件对象
    Vue.component('PageTools', PageTools)
  }
}
