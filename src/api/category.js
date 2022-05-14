// 定义首页需要的接口函数
import request from '@/utils/request';
/**
 * 获取首页的数据
 * @returns Promise
 */
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}
/**
 * 获取二级菜单
 * @returns Promise
 */
export const findTopCategory = (id) => {
  return request('/category', 'get', { id })
}
/**
 * 获取二级分类筛选条件数据
 * @param {String} id - 二级分类Id
 */
export const findSubCategoryFilter = (id) => {
  return request('/category/sub/filter', 'get', { id })
}
export const findSubCategoryGoods = (params) => {
  return request('/category/goods/temporary', 'post', params)
}
