import request from '@/utils/request'
import {withLoading} from "@/utils/withLoading";

// 发送邮件
export const doEmailSend = (data = {}) => {
    return request({
        url: '/api/v1/common/email/send',
        method: 'POST',
        data,
    })
}

// 注册
export const doRegister = (data = {}) => {
    return request({
        url: '/api/v1/auth/signup',
        method: 'POST',
        data,
    })
}

// 登录
export const doLogin = (data = {}) => {
    return request({
        url: '/api/v1/auth/signin',
        method: 'POST',
        data,
    })
}

//文件上传
export const doFile = (data) => {
    return request({
        url: '/api/v1/common/upload/image',
        method: 'POST',
        data,
    })
}

// 创建图片
export const doGain = (data) => {
    return request({
        url: '/api/v1/picture',
        method: 'POST',
        data,
    })
}

//获取图片列表
export const doTabulation = (data) => {
    return request({
        url: `/api/v1/picture`,
        method: 'GET',
        params: data
    })
}

//更新
export const doUpdata = (data = {}, id) => {
    return request({
        url: `/api/v1/picture/${id}`,
        method: 'PATCH',
        data,
    })
}

//删除
export const doDelete = withLoading((id) => {
    return request({
        url: `/api/v1/picture/${id}`,
        method: 'DELETE',
    })
})

//详情
export const doDetail = (data) => {
    return request({
        url: `/api/v1/picture/${data}`,
        method: 'GET',
        data,
    })
}

// 我的收藏
export const doCollectList = () => {
    return request({
        url: `/api/v1/collect?current=2&length=10`,
        method: 'GET',
    })
}

//更新用户信息
export const doUpdateUserInformation = (data) => {
    return request({
        url: `/api/v1/user/profile`,
        method: 'PATCH',
        data,
    })
}

//用户列表
export const doUserList = () => {
    return request({
        url: `/api/v1/user?current=10&length=10`,
        method: 'GET',
    })
}

//用户详情
export const doUserDetails = (id) => {
    return request({
        url: `/api/v1/user/${id}`,
        method: 'GET',
    })
}

//修改密码
export const doUpdatePassword = (data) => {
    return request({
        url: `/api/v1/user/update-password`,
        method: 'PATCH',
        data,
    })
}

//重置密码
export const doResetPassword = (data) => {
    return request({
        url: `/api/v1/user/reset-password`,
        method: 'PATCH',
        data,
    })
}

// 点赞
export const doLike = (pictureId) => {
    return request({
        url: `/api/v1/like`,
        method: 'POST',
        data: pictureId,
    })
}

// 取消点赞
export const doCancellike = (pictureId) => {
    return request({
        url: `/api/v1/like`,
        method: 'DELETE',
        data: pictureId,
    })
}

// 收藏
export const doCollect = (pictureId) => {
    return request({
        url: `/api/v1/collect`,
        method: 'POST',
        data: pictureId,
    })
}

// 取消收藏
export const doCancelCollect = (pictureId) => {
    return request({
        url: `/api/v1/collect`,
        method: 'DELETE',
        data: pictureId,
    })
}