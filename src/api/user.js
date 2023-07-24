//引入axios（axios进行二次封装）
import request from '@/utils/request'

//对外暴露登录接口函数
export function login(data) {
  // console.log("inApiUser")
  return request({
    url: '/login',
    method: 'post',
    data
  })
}
//对外暴露获取用户信息的函数
export function getInfo(token) {
  return request({
    url: '/info',
    method: 'get',
    params: { token }
  })
}
//对外暴露退出登录函数
export function logout(data) {
  return request({
    url: '/logout',
    method: 'post',
    data
  })
}
