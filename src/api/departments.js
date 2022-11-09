import request from '@/utils/request'

//! 获取组织架构结构
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

//! 接口满足restful接口的规范 ， 同样的地址，不同的方法，执行不同的业务
//! 删除部门接口
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'DELETE'
  })
}

//! 添加部门接口
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data
  })
}

//! 根据id查询部门详情接口
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

//! 根据id修改部门详情接口
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'PUT',
    data
  })
}
