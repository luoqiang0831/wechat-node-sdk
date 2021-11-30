import axios from 'axios'
import qs from 'qs'
const instance = axios.create({
  baseURL: '',
  timeout: 60 * 1000
})

// POST传参序列化
instance.interceptors.request.use(
  (config) => {
    const { headers } = config
    const contentType = [
      'application/x-www-form-urlencoded',
      'application/x-www-form-urlencoded; charset=UTF-8'
    ]
    if (
      config.method === 'post' &&
      contentType.includes(headers['Content-Type'])
    ) {
      config.data = qs.stringify(config.data)
    }
    return config
  },
  (error) => {
    window.alert('错误的传参')
    return Promise.reject(error)
  }
)

function get(url, params) {
  return new Promise((resolve, reject) => {
    instance
      .get(url, params)
      .then(
        (response) => {
          resolve(response.data)
        },
        (err) => {
          reject(err)
        }
      )
      .catch((error) => {
        reject(error)
      })
  })
}

function post(url, params, config = {}) {
  return new Promise((resolve, reject) => {
    instance
      .post(url, params, config)
      .then(
        (response) => {
          resolve(response.data)
        },
        (err) => {
          reject(err)
        }
      )
      .catch((error) => {
        reject(error)
      })
  })
}

export { get, post }
