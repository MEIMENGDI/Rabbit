import request from '@/utils/request';
/**
 * @param {String} skuid - 商品SKUID
 * @returns Promise
 */
// 定义获取最新信息的API
export const getNewCartGoods = (skuid) => {
  return request(`/goods/stock/${skuid}`, 'get')
}
/**
 * 合并本地购物车
 * @param {Array<object>} cartList - 本地购物车数组
 * @param {String} item.skuId - 商品SKUID
 * @param {Boolean} item.selected - 是否选中
 * @param {Integer} item.count - 数量
 */
export const mergeLocalCart = (lists) => {
  return request('/member/cart/merge', 'post', lists)
}
/**
 * 获取登录后购物车商品列表
 * @returns Promise
 */
export const findCartList = () => {
  return request('/member/cart', 'get')
}
/**
 * 登录后加入购物车
 * @param {String} skuId - 商品数据id
 * @param {Integer} count - 商品数量
 */
export const addCart = ({ skuId, count }) => {
  return request('/member/cart', 'post', { skuId, count })
}
/**
 * 删除购物车
 * @param {Array<string>} ids - skuId集合
 * @returns Promise
 */
export const deleteCart = (ids) => {
  return request('/member/cart', 'delete', { ids })
}
/**
 * 修改购物车商品
 * @param {String} goods.skuId - 商品sku
 * @param {Boolean} goods.selected - 选中状态
 * @param {Integer} goods.count - 商品数量
 * @returns Promise
 */
export const updateCart = ({ skuId, selected, count }) => {
  return request(`/member/cart/${skuId}`, 'put', { selected, count })
}
/**
 * 是否全部选中
 * @param {Boolean} selected - 是否选中
 * @param {String} ids - skuid的集合
 */
export const isCheckAll = ({ selected, ids }) => {
  return request('/member/cart/selected', 'put', { selected, ids })
}
