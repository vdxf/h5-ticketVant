import axios from 'axios'
import {Toast} from "vant";

const ajax = axios.create({
    baseURL: '',
    timeout: 10000,
})


// 请求拦截处理
ajax.interceptors.request.use(config => {
    let { url, baseURL, data, params } = config;
    console.log(`${ url.startsWith('http') ? url : baseURL + url } 请求参数 =>`, data || params);
    return config
}, err => {
    return Promise.reject(err)
})


//响应拦截处理
ajax.interceptors.response.use(response => {
    let { data: respData, config } = response;
    let { url, baseURL } = config;
    console.log(`${ url.startsWith('http') ? url : baseURL + url } 请求结果 =>`, respData);
    const { msg, code, data } = respData;
    return data;
}, error => {
    console.log('请求响应错误 => ', error.response, error);
    return Promise.reject(error)
})

function requestToken(options) {
    const token = window.localStorage.getItem('token')
    const Authorization = 'Bearer ' + token

    return ajax({
        ...options,
        headers: {'Authorization': Authorization},
    })
}

export default requestToken;