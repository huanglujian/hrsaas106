import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

//! 所有自定义命令
import * as directives from '@/directives'
// console.log(directives) //! 打印的是以 自定义命令为key，的对象
Object.keys(directives).forEach(key => { //! 遍历所有的导出的指令对象，完成自定义全局注册
  Vue.directive(key, directives[key])
})

//! 所有过滤器
import * as filters from '@/filters'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

//! 所有的公用组件
import Component from '@/components'
Vue.use(Component) //! 注册所有的全局组件

//! 定义公共的 mixin
import CheckPermission from '@/mixin/checkPermission.js'
Vue.mixin(CheckPermission)

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
