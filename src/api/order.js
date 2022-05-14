// 订单相关的api函数
import request from '@/utils/request'
/**
 * 获取结算信息
 */
export const findCheckoutInfo = () => {
  return request('/member/order/pre', 'get')
}
/**
 * 添加收货地址信息
 * @param {Object} address - 地址对象
 */
export const addAddress = (form) => {
  return request('/member/address', 'post', form)
}
/**
 * @param {Object} address - 地址对象
 */
export const editAddress = (address) => {
  return request(`/member/address/${address.id}`, 'put', address)
}
/**
 * @param {Object} order - 订单信息
 */
export const createOrder = (order) => {
  return request('/member/order', 'post', order)
}
/**
 * 获取订单详情
 * @param {String} id - 订单ID
 */
export const findOrder = (id) => {
  return request(`/member/order/${id}`, 'get', id)
}
// 获取订单列表api接口
/**
 * @param {Number} orderState - 订单状态，1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消，未传该参数或0为全部
 * @param {Number} page - 页码
 * @param {Number} pageSize - 每页条数
 * @returns
 */
export const findOrderList = ({ orderState, page, pageSize }) => {
  return request('/member/order', 'get', { orderState, page, pageSize })
}
// 取消订单
/**
 * 取消订单
 * @param {String} orderId - 订单ID
 * @param {String} cancelReason - 取消原因
 * @returns Promise
 */
export const cancelOrder = (orderId, cancelReason) => {
  return request(`/member/order/${orderId}/cancel`, 'put', { cancelReason })
}
/**
 * 删除订单
 * @param {String} id - 订单id
 */
export const deleteOrder = (orderId) => {
  return request('/member/order', 'delete', { ids: [orderId] })
}
/**
 * 确认收货
 * @param {String} id - 订单id
 */
export const confirmOrder = (id) => {
  return request(`/member/order/${id}/receipt`, 'put', id)
}
/**
 * 查看物流
 * @param {String} id - 订单id
 */
export const logisticsOrder = (id) => {
  return request(`/member/order/${id}/logistics`, 'get', id)
}
/**
 * 再次购买
 * @param {String} id - 订单id
 */
export const findOrderRepurchase = (id) => {
  return request(`/member/order/repurchase/${id}`, 'get', id)
}
