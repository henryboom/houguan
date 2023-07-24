import request from '@/utils/request'
// const api_name = '/src/api/acl/getusers'
export function fetchList(query) {
    return request({
        url: '/users',
        method: 'get',
        params: query
    })
}

export function userStateChange(id, data) {
    return request({
        url: `users/${id}/state/${data}`,
        method: 'put'
    })
}

export function addUser(data) {
    return request({
        url: '/users',
        method: 'post',
        data
    })
}

export function showEditDialog(id) {
    return request({
        url: `/users/${id}`,
        method: 'get'
    })
}
export function editUserinfo(id, data) {
    return request({
        url: `/users/${id}`,
        method: 'put',
        data

    })
}
removeuserbyid
export function removeuserbyid(id) {
    return request({
        url: `/users/${id}`,
        method: 'delete'
    })
}