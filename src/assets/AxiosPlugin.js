import axios from 'axios'
import {
    Message
} from 'element-ui';
import router from '../router'
const Axios = axios.create({
    // baseURL: process.env.BASE_API,
    timeout: 30000,
})
// 添加请求拦截器
Axios.interceptors.request.use(config => {
    // 在发送请求之前做某件事
    return config
}, error => {
    
    return Promise.reject(error)
})
//返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(res => {
    //对响应数据做些事
    let code = res.data.retCode;
    let msg = res.data.retMsg;
    if (code == "110500") {
        localStorage.setItem('username', '')
        router.replace({
            path: '/login'
        })
    } else if (code == "001020") {
        Message({
            message: msg,
            type: 'error',
            duration: 5 * 1000
        });
        localStorage.setItem('username', '')
        router.replace({
            path: '/login'
        })
        return false;
    }
    return res
}, error => {
    // 返回 response 里的错误信息
    return Promise.reject(error)
})



export default {
    install(Vue) {
        Object.defineProperty(Vue.prototype, '$http', {
            value: Axios
        })
    }
}