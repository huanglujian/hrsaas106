import request from '@/utils/request'

//! 获取员工的简单列表
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}

//! 获取员工的详细信息
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params
  })
}

//! 删除员工
export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}
