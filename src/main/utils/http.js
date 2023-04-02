import axios from 'axios'
import globalConfig from './config'
// import useAuthStore from '@renderer/store/useAuthStore'
// import { getToken } from '../../renderer/src/utils/auth'

// const authStore = useAuthStore()

// console.log(authStore)

const options = {
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: globalConfig?.timeout ?? 5000 // request timeout
}

if (globalConfig.config.proxy) {
  let proxy = globalConfig.config.proxy
  options.proxy = {
    protocol: proxy.protocol,
    host: proxy.host,
    port: proxy.port
  }
}

const service = axios.create(options)

service.interceptors.request.use(
  (config) => {
    if (globalConfig.config.authorization) {
      config.headers['Authorization'] = 'Bearer ' + globalConfig.config.authorization
    }
    return config
  },
  (error) => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    const headers = response.headers
    const res = response.data
    if (response.status !== 200) {
      console.log('接口信息报错1', res.message)
      return Promise.reject(new Error(res.message || 'Error'))
    } else if (headers['content-type'] === 'application/json; charset=utf-8') {
      // 返回值为json则直接吧data返回
      return res
    } else {
      // 其他情况下返回返回response
      return Promise.resolve(response)
    }
  },
  (error) => {
    console.log('接口信息报错2' + error)
    return Promise.reject(error)
  }
)

export default service
