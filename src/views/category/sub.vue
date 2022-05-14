<template>
  <div class="container">
    <!-- 面包屑 -->
    <SubBread />
    <!-- 筛选器 -->
    <SubFilter @fliter-change="changeFilter" />
    <!-- 所筛选得出物品 -->
    <!-- <XtxCheck v-model:moudelValue="isAllchecked">全选</XtxCheck
    >{{ isAllchecked }} -->
    <div class="goods-list">
      <SubSort @sort-change="changeSort" />
      <ul>
        <li v-for="item in goodsList" :key="item.id">
          <GoodsItem :goods="item" />
        </li>
      </ul>
      <XtxInfiniteLoading
        :loading="loading"
        :finished="finished"
        @infinite="getData"
      />
    </div>
  </div>
</template>
<script>
import SubBread from './commponents/sub-bread.vue'
import SubFilter from './sub-filter.vue'
import SubSort from './commponents/sub-sort.vue'
import GoodsItem from './commponents/goods-item.vue'
import XtxInfiniteLoading from '@/components/xtx-infinite-loading.vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findSubCategoryGoods } from '@/api/category'
export default {
  name: 'SubCategory',
  components: {
    SubBread, SubFilter, SubSort, GoodsItem, XtxInfiniteLoading
  },
  setup () {
    const route = useRoute()
    const loading = ref(false)
    const finished = ref(false)
    const goodsList = ref([])
    // 查询参数
    let reqParams = {
      page: 1,
      pageSize: 20
    }
    // 获取数据函数
    const getData = () => {
      loading.value = true
      reqParams.categoryId = route.params.categoryId
      findSubCategoryGoods(reqParams).then(({ result }) => {
        if (result.items.length) {
          goodsList.value.push(...result.items)
          reqParams.page++
        } else {
          // 加载完毕
          loading.value = true
        }
        // 请求结束
        loading.value = false
      })
    }
    watch(() => route.params.id, (newVal) => {
      if (newVal && route.path === ('/category/sub/' + newVal)) {
        goodsList.value = []
        reqParams = {
          page: 1,
          pageSize: 20
        }
        finished.value = false
      }
    })
    // 监听排序改变
    const changeSort = (sortParams) => {
      reqParams = { ...reqParams, ...sortParams }
      reqParams.page = 1
      goodsList.value = []
      finished.value = false
    }
    // 监听筛选顺序改变
    const changeFilter = (filterParams) => {
      reqParams = { ...reqParams, ...filterParams }
      reqParams.page = 1
      goodsList.value = []
      finished.value = false
    }
    return { loading, finished, goodsList, getData, changeSort, changeFilter }
  }
}
</script>
<style lang="less" scoped>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
