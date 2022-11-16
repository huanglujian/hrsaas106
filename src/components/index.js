//!  该文件用于负责所有的公共组件的全局注册
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'

import Print from 'vue-print-nb'

//! VUE.use()   这个方法执行的就是 install(Vue) 里面的代码
export default {
  install(Vue) {
    Vue.component('PageTools', PageTools) //! 注册全局通用栏组件对象
    Vue.component('UploadExcel', UploadExcel) //! 注册导入excel组件
    Vue.component('ImageUpload', ImageUpload) //! 注册导入上传图片组件

    Vue.use(Print) //! 注册打印的插件
  }
}

