const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  name: (state) => state.user.userInfo.username //! 建立用户名称的映射  这边就体现了将 userInfo设为空对象的好处，设为null, 这样写就会报错
}
export default getters
