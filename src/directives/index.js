export const imagerror = {
  inserted(el, options) {
    el.src = el.src || options.value //! 看看 src接收的是不是null，是就还是按默认给的来
    //! 当图片有地址，但是地址没有加载成功的时候，会报错，会触发图片的一个事件 => onerror
    el.onerror = function() {
      el.src = options.value //! 这里不能写死
    }
  },
  //! inserted 只执行一次
  componentUpdated(el, options) {
    el.src = el.src || options.value
  }
}
