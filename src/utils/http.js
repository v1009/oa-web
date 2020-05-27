import axios from 'axios'

window.baseUrl = 'http://localhost:9141/'

axios.defaults.timeout = 8000
axios.defaults.baseURL = window.baseUrl
axios.defaults.withCredentials = true
// http request 拦截器
axios.interceptors.request.use(
  config => {
    config.data = JSON.stringify(config.data)
    // 这里的config包含每次请求的内容
    const token = window.sessionStorage.getItem('token')
    if (token) {
      config.headers['Token'] = token
    }
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    // if(token){
    //   config.params = {'token':token}
    // }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  res => {
    const data = res.data
    if (data.code === 101) {
      router.push({
        path: '/login',
        querry: {redirect: router.currentRoute.fullPath}// 从哪个页面跳转
      })
    }
    return res
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * 封装get方法
 * @param url
 * @param params
 * @returns {Promise}
 */

export function get (url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装post请求
 * @param url
 * @param params
 * @returns {Promise}
 */

export function post (url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param params
 * @returns {Promise}
 */

export function patch (url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, params)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装put请求
 * @param url
 * @param params
 * @returns {Promise}
 */

export function put (url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, params)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}
