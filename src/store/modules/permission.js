import { constantRoutes, asyncRoutes } from '@/router'

const state = {
  routes: constantRoutes //! 所有人都拥有静态路由
}

const mutations = {
  //! newRoutes 可以认为是用户通过权限获得的动态路由
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}

const actions = {
  //! 筛选权限路由
  filterRoutes({ commit }, menus) { //! 第二个参数为当前用户的所拥有的菜单权限
    //! 筛选出动态路由中和menus中能够对上的路由
    const routes = []
    menus.forEach(item => {
      //! asyncRoutes 找 有没有对象中的name属性等于 key的 如果找不到就没权限 如果找到了 要筛选出来
      routes.push(...asyncRoutes.filter(key => key.name === item)) //! push数组 , 也可能是一个空数组
    })
    // 得到的routes是所有模块中满足权限要求的路由数组
    // routes就是当前用户所拥有的 动态路由的权限
    commit('setRoutes', routes) // 将动态路由提交给mutations
    return routes // 这里为什么还要return  state数据 是用来 显示左侧菜单用的  return  是给路由addRoutes用的
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
