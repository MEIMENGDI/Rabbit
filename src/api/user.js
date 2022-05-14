import request from '@/utils/request';
/**
 * @param {String} account -用户名
 *@param {String} password - 密码
 */
export const userAccountLogin = ({ account, password }) => {
  return request('/login', 'post', { account, password })
}
/**
 * @param {String} mobile -手机号
 */
export const userMobileLoginMsg = (mobile) => {
  return request('/login/code', 'get', mobile)
}
export const userQQLogin = (unionId, source = 6) => {
  return request('/login/social', 'post', { unionId, source })
}
/**
 * 获取QQ绑定的时候短信验证码
 * @param {String} mobile - 手机号
 * @returns promise
 */
export const userQQBindCode = (mobile) => {
  return request('/login/social/code', 'get', { mobile })
}
/***
 * @param {String} unionId--qq登录标识
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @returns
 */
export const userQQBindLogin = ({ unionId, mobile, code }) => {
  return request('/login/social/bind', 'post', ({ unionId, mobile, code }))
}
/**
 * 校验帐号是否存在
 * @param {String} account - 帐号
 * @returns Promise
 */
export const userCheckAccount = (account) => {
  return request('/register/check', 'get', { account })
}
export const userQQPatchCode = (mobile) => {
  return request('/register/code', 'get', { mobile })
}
export const userQQPatchLogin = ({ unionId, mobile, code, account, password }) => {
  return request(`/login/social/${unionId}/complement`, 'post', { unionId, mobile, code, account, password })
}
/**
 * 解除绑定
 */
export const unbind = (mobile) => {
  return request('/login/social/unbind', 'get', mobile)
}
