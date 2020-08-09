import axios from 'axios'
import Taro  from '@tarojs/taro'
import { AtMessage } from 'taro-ui'
import {encrypt} from './keys'//加密函数
if (process.env.NODE_ENV !== 'production') {
  // axios.defaults.baseURL = 'https://gateway1.dakale.net'
  axios.defaults.baseURL='https://devgateway.dakale.net'
}else{
  axios.defaults.baseURL = 'https://gateway.dakale.net'

}
const handleError =  (type,string) => {
  Taro.atMessage({
    'message': string,
    'type': type,
  })
}
axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.interceptors.request.use(config => {
  config.headers['appType'] = 'user'
  config.url=config.baseURL+config.url
  return config
}, error => {
  return Promise.reject(error)
})
// 添加响应拦截器
axios.interceptors.response.use(response => {
  if(response.status == 200){
    const {data:{success,resultDesc,resultCode}} = response
    return response
  }

}, error => {
  if (error.message.includes('timeout')) { // 判断请求异常信息中是否含有超时timeout字符串
    handleError(error,'請求超時');
  } else {
    handleError(error,`${error.message}`)
  }
  return Promise.reject(error)
})

export const HTTP_POST = (url, data) => {
  if (data) {
    let params = encrypt('post',data)
    return axios.post(url,params)
  }
  return axios.post(url)
}

export const HTTP_GET = (url, data) => {
  if (data) {
    let params = encrypt('get',data)
    return axios.get(url, {
      params: params,
    })
  }
  return axios.get(url)
}
export const HTTP_ALL = (arr) => {
  return axios.all(arr).then(axios.spread((...res) => {
    return Promise.resolve(res)
  }))
}
