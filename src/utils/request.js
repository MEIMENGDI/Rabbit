import axios from 'axios'
import store from '@/store'
import router from '@/router'

// 基准地址
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
const instance = axios.create({
  baseURL,
  timeout: '50000'
})
// 添加请求拦截器
instance.interceptors.request.use(config => {
  // 进行成功的配置
  // 1.引入用户信息
  // 获取用户信息对象

  const { profile } = store.state.user
  // console.log(profile.token)
  // 2.判断token的存在并且设置请求头
  if (profile.token) {
    config.headers.Authorization = `Bearer ${profile.token}`
  }
  return config
}, err => {
  // 失败就返回一个err
  return Promise.reject(err)
})
// 添加响应拦截器
instance.interceptors.response.use(res => res.data, err => {
  // 401状态码
  if (err.response.status && err.response.status === 401) {
    // 1.清空无效用户信息
    // 2.跳转到登录页
    store.commit('user/setUser', {})
    // 当前路由地址
    // 如果是组件里边：`user?a=10` $router.path===/user  $router.fullPath === /user?a=10
    // 如果在js模块中：router.currentRoute.value.fullPath就是当前路由地址，router.currentRoute是ref响应式数据
    const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
    // encodeURIComponent转换url编码，防止解析地址出现问题
    router.push('/login?redirectUrl=' + fullPath)
  }
  return Promise.reject(err)
})
// 请求工具函数的封装
export default (url, method, submitData) => {
  // 负责发请求：请求地址，请求方式，提交的数据
  return instance({
    url,
    method,
    //  1.如果是get请求，需要用params来传递submitData ?a=10&c=10
    //  2.如果不是get请求，需要使用data来传递
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
