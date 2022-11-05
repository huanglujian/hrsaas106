import { getToken, setToken, removeToken } from '@/utils/auth'
import { login,getUserInfo } from '@/api/user'

const state = {
  token: getToken(), //! 设置token初始状态   token持久化 => 放到缓存
  userInfo: {}  //! 定义一个空的对象，不是null，是因为后面要用到这个对象后面属性， null.属性 这种写法会报错
}
const mutations = {
  setToken(state, token) {
    state.token = token //! 设置token  只是修改state的数据
    setToken(token) //! vuex和缓存数据的同步
  },
  removeToken(state) {
    state.token = null //! 删除vuex的token
    removeToken() //! 先清除vuex  再清除缓存 vuex和缓存
  },
  setUserInfo(state,userInfo) {
    // state.userInfo = userInfo
    state.userInfo = {...userInfo}  //! 用浅拷贝的方式去赋值对象，因为这样数据更新之后，才能触发组件的更新
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
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    context.commit('setUserInfo',result) //! 将整个的个人信息设置到用户的vuex数据中
    return result  //! 这里为什么要返回值，为后面埋下伏笔
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
