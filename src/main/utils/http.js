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
    if (true) {
      config.headers['Authorization'] =
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJjNDI1ODNhLTI5NGQtNDI1Ny04ZGZmLTMzMDc0MDljNjc5ZCIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJyb2xlIjoidXNlciIsInByZW1pdW0iOmZhbHNlLCJpc3MiOiJpd2FyYSIsImlhdCI6MTY4MDI1NjgwMiwiZXhwIjoxNjgwMjYwNDAyfQ.DPEahoBBLDjEQCdLH0TwSR_5SBjSHOSpnbez5TscZbg'
      // config.headers['X-Token'] = ''
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
    // console.log(headers['content-type'])
    // if (headers['content-type'] === 'application/octet-stream;charset=utf-8') {
    //   return Promise.resolve(response) //这里只返回 response,便于用户根据headers去设置文件名称
    // }
    // return Promise.resolve(response.data)

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
