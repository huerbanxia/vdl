import axios from 'axios'
// import useAuthStore from '@renderer/store/useAuthStore'
// import { getToken } from '../../renderer/src/utils/auth'

// const authStore = useAuthStore()

// console.log(authStore)

const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000, // request timeout
  proxy: {
    protocol: 'http',
    host: '127.0.0.1',
    port: 1081
    //   changeOrigin: true
    //   // auth: {
    //   //   username: 'mikeymike',
    //   //   password: 'rapunz3l'
    //   // }
  }
  // headers: {
  //   accept:
  //     'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  //   acceptEncoding: 'gzip, deflate, br'
  // }
})

service.interceptors.request.use(
  (config) => {
    if (false) {
      // config.headers['X-Token'] = getToken()
      config.headers['X-Token'] = ''
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
    const res = response.data
    if (response.status !== 200) {
      console.log('接口信息报错1', res.message)
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  (error) => {
    console.log('接口信息报错2' + error)
    return Promise.reject(error)
  }
)

export default service
