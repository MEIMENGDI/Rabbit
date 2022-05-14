// 分类模块
import { topCategory } from '@/api/constants'
import { findAllCategory } from '@/api/category'
export default {
  namespaced: true,
  state: () => {
    return {
      // 分类信息集合
      // 如果默认是空数组，就会看不见九个分类，等加载完数据才能看到
      // 所以：根据常量数据来生成一个默认的顶级分类数据，不会出现空白（没数据的会自动显示默认数据）
      list: topCategory.map((item) => ({ name: item }))
    }
  },
  // 架子数据成功后需要修改list所以需要mutations函数
  mutations: {
    setList (state, headCategory) {
      state.list = headCategory
    },
    hide (state, item) {
      const category = state.list.find(category => category.id === item.id)
      category.open = false
    },
    show (state, item) {
      const category = state.list.find(category => category.id === item.id)
      category.open = true
    }
  },
  // 需要向后台请求数据，所以需要actions函数获取数据
  actions: {
    async getList ({ commit }) {
      const { result } = await findAllCategory()
      // 1.vuex每个分类加上open数据
      result.forEach(item => {
        item.open = false
      })
      // 获取数据成功，提交mutations进行数据修改
      commit('setList', result)
    }
  }
}
