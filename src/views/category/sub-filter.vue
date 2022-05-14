<template>
  <div class="sub-filter" v-if="filterData && !filterLoading">
    <div class="item">
      <div class="head">品牌:</div>
      <div class="body">
        <a
          @click="changeBrand(brand.id)"
          :class="{ active: filterData.selectedBrand === brand.id }"
          href="javascript:;"
          v-for="brand in filterData.brands"
          :key="brand.id"
          >{{ brand.name }}</a
        >
      </div>
    </div>
    <div class="item" v-for="p in filterData.saleProperties" :key="p.name">
      <div class="head">{{ p.name }}</div>
      <div class="body">
        <a
          @click="changeAttr(p, attr.id)"
          :class="{ active: p.selectedProp === attr.id }"
          href="javascript:;"
          v-for="attr in p.properties"
          :key="attr.id"
          >{{ attr.name }}</a
        >
      </div>
    </div>
  </div>
  <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
  </div>
</template>
<script>
import { watch } from 'vue-demi'
import { useRoute } from 'vue-router'
import { findSubCategoryFilter } from '@/api/category'
import { ref } from 'vue'
export default {
  name: 'SubFilter',
  setup (props, { emit }) {
    const route = useRoute()
    const filterData = ref(null)
    const filterLoading = ref(false)
    watch(() => route.params.id, (newVal) => {
      // 变化后的id有值，并且处在二级类名路由下
      if (newVal && `/category/sub/${newVal}` === route.path) {
        filterLoading.value = true
        findSubCategoryFilter(route.params.id).then(data => {
          //  品牌添加分类
          data.result.selectedBrand = null
          data.result.brands.unshift({ id: null, name: '全部' })
          // 销售属性全部
          data.result.saleProperties.forEach(p => {
            p.selectedProp = null
            p.properties.unshift({ id: null, name: '全部' })
          })
          filterData.value = data.result
          filterLoading.value = false
          // console.log(data.result)
        })
      }
      return filterData
    }, { immediate: true })
    // 获取筛选参数
    const getFilterParams = () => {
      const filterParams = {}
      const attrs = []
      filterParams.brandId = filterData.value.selectedBrand
      filterData.value.saleProperties.forEach(p => {
        const attr = p.properties.find(attr => attr.id === p.selectedProp)
        if (attr && attr.id !== undefined) {
          attrs.push({ groupName: p.name, propertyName: attr.name })
        }
      })
      if (attrs.length) filterParams.attrs = attrs
      return filterParams
    }
    // 选中品牌
    const changeBrand = (brandId) => {
      if (filterData.value.selectedBrand === brandId) return
      filterData.value.selectedBrand = brandId
      emit('fliter-change', getFilterParams())
    }
    // 选中属性
    const changeAttr = (p, attrId) => {
      if (p.selectedProp === attrId) return
      p.selectedProp = attrId
      emit('fliter-change', getFilterParams())
    }
    return { filterData, filterLoading, changeAttr, changeBrand }
  }
}
</script>
<style lang="less" scoped>
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
}
.xtx-skeleton {
  padding: 10px 0;
}
</style>
