
//! 每个子模块其实都是外层时layout，组件位于layout的二级路由里面
import Layout from '@/layout'

export default {
  path: '/employees',
  name: 'employees',
  component: Layout,
  children: [{
    path: '', //! 这里当二级路由的path什么都不写的时候，表示该路由为当前二级路由的默认路由
    component: () => import('@/views/employees'),
    meta: { //! 路由元信息，其实就是存储数据的对象，我们可以在这里放置一些信息
      title: '员工', //!  meta里面的属性名可以随意的定义，这里使用 title 是因为左侧菜单行把title属性作为菜单栏名称
      icon: 'people'
    }
  }]
}

//!  当你访问的地址是 /salarys 的时候，layout组件会显示，此时，你的二级路由的默认组件也会显示
