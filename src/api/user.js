import request from '@/utils/request'

export function login(data) {
  // 返回 一个 promise对象
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}

//! 获取用户的基本信息
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

//! 获取用户的详细信息
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
