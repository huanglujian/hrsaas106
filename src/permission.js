import router from '@/router' //! 引入路由实例
import store from '@/store' //! 引入vuex store实例
import NProgress from 'nprogress' //! 引入一份进度条插件
import 'nprogress/nprogress.css' //! 引入进度条样式

const whiteList = ['/login', '/404'] //! 定义白名单（不受token权限控制的页面）

//! 路由的前置守卫
router.beforeEach(async(to, from, next) => {
  NProgress.start() //! 开启进度条
  //! 判断有无token
  if (store.getters.token) {
    //! 有token，再判断是否去的是login页面
    if (to.path === '/login') {
      next('/') //! 是login就跳转到首页
    } else {
      if (!store.getters.userId) { //! 如果没有id这个值，才会调用vuex的获取资料的action
        const { roles } = await store.dispatch('user/getUserInfo') //! 为什么要写await？ 因为向获取完资料再去放行
        const routes = await store.dispatch('permission/filterRoutes', roles.menus) //! routes 就是筛选出来的动态路由
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) //! 添加动态路由到路由表
        next(to.path) //! addRoutes 添加路由后应该使用，否则刷新页面之后权限会消失，这是属于vue-router的已知缺陷
      }
      next() //! 不是就跳转到想去的路由
    }
  } else {
    //! 没有token，判断是不是白名单中的
    if (whiteList.indexOf(to.path) > -1) {
      next() //! 是就直接跳转
    } else {
      next('/login') //! 不是就让它跳回login页登录信息
    }
  }
  NProgress.done() //! 手动强制关闭，解决手动切换地址时，不经过后置守卫，进度条不关闭
})

//! 后置守卫
router.afterEach(() => {
  NProgress.done() //! 关闭进度条
})
