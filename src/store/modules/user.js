import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'

const state = {
  token: getToken() //! 设置token初始状态   token持久化 => 放到缓存
}
const mutations = {
  setToken(state, token) {
    state.token = token //! 设置token  只是修改state的数据
    setToken(token) //! vuex和缓存数据的同步
  },
  removeToken(state) {
    state.token = null //! 删除vuex的token
    removeToken() //! 先清除vuex  再清除缓存 vuex和缓存
  }
}

const actions = {
  async login(context, data) {
    const result = await login(data)
    //! axios默认给数据加了一层data
    /* if (result.data.success) { //! 表示登录接口调用成功， 也就意味着你的用户名和密码是正确的
      context.commit('setToken', result.data.data) //! actions修改state 必须通过mutations
    } */
    context.commit('setToken', result)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
