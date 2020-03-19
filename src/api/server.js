import axios from 'axios'
import { Toast } from 'mand-mobile'
import envconfig from '../envconfig/envconfig'
import { loadFromLocal } from '../utils/utils'

// http 请求拦截器
axios.interceptors.request.use(request => {
  return request
}, error => {
  return Promise.reject(error)
})

// http 响应拦截器
axios.interceptors.response.use(response => {
  const {code, msg} = response.data
  if (code !== '1') {
    if (code === '-1') {
      Toast.info('登录超时，请重新登录', 1500)
    }
    if (code === '-3') {
      Toast.info(msg, 1500)
    }
  }
  return Promise.resolve(response)
}, error => {
  if (error.response) {
    Toast.info(error.response, 1500)
    return Promise.reject(error.response)
  }
})

export default class Server {
  axios(method, url, params) {
    return new Promise((resolve, reject) => {
      let _option = params
      _option = {
        method,
        url,
        baseURL: envconfig.baseUrl,
        timeout: 30000,
        params: null,
        data: null,
        headers: {
          common: {
            accessToken: loadFromLocal('h5', 'accessToken')
          },
          'Content-Type':'application/json;charset=UTF-8',
        },
        // 是否携带cookies发起请求
        withCredentials: false,
        validateStatus: (status) => {
          return status >= 200 && status < 300
        },
        ...params
      }
      axios.request(_option).then(res => {
        resolve(res && (typeof res.data === 'object' ? res.data : JSON.parse(res.data)))
      }, error => {
        if (error.response) {
          reject(error.response.data)
        } else {
          reject(error)
        }
      })
    })
  }
}
