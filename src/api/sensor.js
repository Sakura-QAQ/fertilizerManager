// 配置axios
import axios from 'axios'
import JSONBig from 'json-bigint'
import Message from 'element-ui'
const instance = axios.create({
  // 配置对象 基准路径 外部信息
  baseURL: 'http://47.104.128.108:10040',
  // 设置超时的连接时间
  // timeout: 1000,
  transformResponse: [(data) => {
    // 对data进行任意格式的转换
    if (data) {
      return JSONBig.parse(data)
    }
    return data
  }]
})

instance.interceptors.request.use(config => {
  // 给头部加上认证信息
  const user = window.sessionStorage.getItem('token')
  // console.log(JSON.parse(user).token)
  if (user) {
    config.headers = {
      // Authorization: 'Bearer ' + JSON.parse(user).token
      token: JSON.parse(user).token
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截
instance.interceptors.response.use(response => {
  // Loading.service().close()
  if (response.data.code === 200 || response.data.code === 100) {
    // 为200则返回响应结果
    return response
    // 自定义100+代码做的事情
  } else if (response.data.code === 101) {
    location.hash = '#/login'
    Message.error('请重新登陆！')
  }
}, error => {
  // 回调之前做一些事
  if (error.response && error.response.status === 401) {
    // hash 是url后#开始的字符串
    location.hash = '#/login'
  }
  return Promise.reject(error)
})

export default instance
