const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  name: (state) => state.user.userInfo.username, //! 建立用户名称的映射  这边就体现了将 userInfo设为空对象的好处，设为null, 这样写就会报错
  userId: (state) => state.user.userInfo.userId,
  staffPhoto: (state) => state.user.userInfo.staffPhoto,
  companyId: state => state.user.userInfo.companyId,
  routes: state => state.permission.routes //! 导出当前用户能访问到的路由
}
export default getters
