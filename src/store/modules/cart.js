import { isCheckAll, updateCart, deleteCart, addCart, mergeLocalCart, getNewCartGoods, findCartList } from '@/api/cart'
export default {
  namespaced: true,
  state: () => {
    return {
      list: []
    }
  },
  // 本地：id skuId name picture nowPrice price count  attrsText selected stock isEffective
  // 线上：比上面多isCollect有用 discount无用两项信息
  mutations: {
    insertCart (state, payload) {
      // 插入规则：
      // 1.先找下是否有相同商品
      // 2.如果有相同的商品，查询它的数量，累加到payload上，再保存到最新的位置
      // 3.如果没有相同的商品，直接保存在最新位置
      const sameIndex = state.list.findIndex(item => item.skuId === payload.skuId)
      if (sameIndex >= 0) {
        // 原有商品的数量
        const count = state.list[sameIndex].count
        payload.count += count
        // 删除原来商品
        state.list.splice(sameIndex, 1)
      }
      // 追加新的
      state.list.unshift(payload)
    },
    updateCart (state, goods) {
      // goods中字段可能不完整，goods有的信息才去修改 nowPrice stock isEffective
      // 1.goods中必需有skuid,才能找到对应的商品信息
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      for (const key in goods) {
        if (goods[key] !== null && goods[key] !== undefined && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },
    // 删除购物车
    deleteCart (state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    },
    // 设置购物车列表
    setCartList (state, list) {
      state.list = list
    }
  },
  getters: {
    // 有效商品列表
    validList (state) {
      return state.list.filter(item => item.stock > 0 && item.isEffective)
    },
    // 有效有效列表总件数
    validTotal (state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额
    validAmount (state, getters) {
      return getters.validList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100
    },
    // 准备失效商品列表数据。已选择商品列表数据。需要支付的金额数据
    // 无效商品列表
    invalidList (state) {
      return state.list.filter(item => !(item.stock > 0 && item.isEffective))
    },
    // 已选择商品列表数据
    selectedList (state, getters) {
      return getters.validList.filter(item => item.selected)
    },
    // 选中商品的件数
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 选中商品的总金额
    selectedAmount (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100
    },
    // 是否全选
    isCheckAll (state, getters) {
      return getters.validList.length === getters.selectedList.length && getters.selectedList.length !== 0
    }
  },
  actions: {
    // 合并本地购物车
    async mergeLocalCart (ctx) {
      // 存储token后调用合并API接口函数进行购物合并
      const cartList = ctx.state.list.map(goods => {
        return {
          skuId: goods.skuId,
          selected: goods.selected,
          count: goods.count
        }
      })
      await mergeLocalCart(cartList)
      // 合并成功将本地购物车删除
      ctx.commit('setCartList', [])
    },
    // 加入购物车
    insertCart (ctx, goods) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录 TODO
          // 登录 TODO
          addCart({ skuId: goods.skuId, count: goods.count }).then(() => {
            return findCartList()
          }).then((data) => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 未登录
          ctx.commit('insertCart', goods)
          resolve()
        }
      })
    },
    // 定义获取购物车列表信息的actions
    findCartList (ctx) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录
          return new Promise((resolve, reject) => {
            findCartList().then(data => {
              ctx.commit('setCartList', data.result)
              resolve()
            })
          })
        } else {
          // 未登录
          // 本地
          // Promise.all() 可以并列发送多个请求，等所有请求成功，调用then
          // Promise.race() 可以并列发送多个请求，等最快的请求成功，调用then
          // 传参事promise数组
          const promiseArr = ctx.state.list.map(item => {
            return getNewCartGoods(item.skuId)
          })
          Promise.all(promiseArr).then(results => {
            // console.log(results)
            results.forEach((data, i) => {
              ctx.commit('updateCart', { skuId: ctx.state.list[i].skuId, ...results })
            })
            resolve()
          })
        }
      })
    },
    // 删除购物车
    deleteCart (ctx, skuId) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录
          return new Promise((resolve, reject) => {
            deleteCart([skuId]).then(() => {
              return findCartList()
            }).then(data => {
              ctx.commit('setCartList', data.result)
              resolve()
            })
          })
        } else {
          // 未登录
          // 本地
          ctx.commit('deleteCart', skuId)
          resolve()
        }
      })
    },
    // 修改购物车商品的actions
    // 修改sku规格函数
    updateCartSku (ctx, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录 TODO
          // 1.获取旧的商品信息
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          // 2.删除旧的商品
          deleteCart([oldGoods]).then(() => {
            // 3.获取修改的skuid和原先商品数量 做一个加入购物车操作
            return addCart({ skuId: newSku.skuId, count: oldGoods.count })
          }).then(() => {
            return findCartList()
          }).then((data) => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
          // 4.插入即可
        } else {
          // 本地
          // 但你修改了sku的时候其实skuId需要更改，相当于把原来的信息移出，创建一条新的商品信息。
          // 1. 获取旧的商品信息
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          // 2. 删除旧的商品
          ctx.commit('deleteCart', oldSkuId)
          // 3. 合并一条新的商品信息
          const { skuId, price: nowPrice, inventory: stock, specsText: attrsText } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, stock, attrsText }
          // 4. 去插入即可
          ctx.commit('insertCart', newGoods)
        }
      })
    },
    // 是否全部选中
    checkAll (ctx, selected) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.token) {
          // 已登录
          return new Promise((resolve, reject) => {
            const ids = ctx.getters.validList.map(item => item.skuId)
            isCheckAll({ selected, ids }).then(() => {
              return findCartList()
            }).then(data => {
              ctx.commit('setCartList', data.result)
              resolve()
            })
          })
        } else {
          // 未登录
          ctx.getters.validList.forEach(item => {
            ctx.commit('updateCart', { skuId: item.skuId, selected })
          })
          resolve()
        }
      })
    },
    // 批量删除选中的商品
    batchDelteCart (ctx, isClear) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.token) {
          // 已登录
          // 得到需要删除的商品列表（失效，选中）的skuid集合
          const skuIdS = ctx.getters[isClear ? 'invalidList' : 'selectedList'].map(item => item.skuId)
          deleteCart(skuIdS).then(() => {
            return findCartList()
          }).then(data => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 未登录进行本地操作
          ctx.getters[isClear ? 'invalidList' : 'selectedList'].forEach(item => {
            ctx.commit('deleteCart', item.skuId)
          })
          resolve()
        }
      })
    },
    // 修改购物车商品
    updateCart (ctx, goods) {
      // goods 中：必须有skuId，其他想修改的属性 selected  count
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录 TODO
          return new Promise((resolve, reject) => {
            updateCart(goods).then(() => {
              return findCartList()
            }).then(data => {
              ctx.commit('setCartList', data.result)
              resolve()
            })
          })
        } else {
          // 本地
          ctx.commit('updateCart', goods)
          resolve()
        }
      })
    }
  }
}
