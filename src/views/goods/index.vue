<template>
  <div class="xtx-goods-page" v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread v-if="goods.categories">
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`">
          {{ goods.categories[1].name }}
        </XtxBreadItem>
        <XtxBreadItem :to="`/category/sub/${goods.categories[0].id}`">
          {{ goods.categories[0].name }}
        </XtxBreadItem>
        <XtxBreadItem>{{ goods.name }}</XtxBreadItem>
      </XtxBread>

      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImage :images="goods.mainPictures" />
          <GoodsSales />
        </div>
        <div class="spec">
          <!-- 名字组件 -->
          <GoodsName :goods="goods" />
          <!-- 规格组件 -->
          <GoodsSku :goods="goods" @change="changeSku" />
          <!-- 数量选择组件 -->
          <XtxNumbox label="数量" v-model="num" :max="12" />
          <!-- 按钮组件 -->
          <XtxButton
            @click="inserCart()"
            type="primary"
            style="margin-top: 20px"
            >加入购物车</XtxButton
          >
        </div>
      </div>
      <!-- 同类型推荐 -->
      <GoodsRelevant :goodsId="goods.id" />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品详情+评价 -->
          <div class="goods-tabs">
            <GoodsTab :goods="goods" />
          </div>

          <div class="goods-warn">
            <!-- 注意事项 -->
          </div>
        </div>
        <!-- 热销榜 -->
        <div class="goods-aside">
          <GoodsHot :goodsId="goods.id" :type="1" />
          <GoodsHot :goodsId="goods.id" :type="2" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import GoodsRelevant from './components/goods-relevant.vue'
import { findGoods } from '@/api/goods.js'
import { useRoute } from 'vue-router'
import { ref, watch, provide, nextTick } from 'vue'
import GoodsImage from './components/goods-image.vue'
import GoodsSales from './components/goods-sales.vue'
import GoodsName from './components/goods-name.vue'
import GoodsSku from './components/goods-sku.vue'
import XtxNumbox from '@/components/library/xtx-numbox.vue'
import XtxButton from '@/components/library/xtx-button.vue'
import GoodsTab from './components/goods-tabs.vue'
import GoodsHot from './components/goods-hot'
import { useStore } from 'vuex'
import Message from '@/components/library/message'
export default {
  name: 'XtxGoodsPage',
  components: { GoodsHot, GoodsTab, XtxButton, XtxNumbox, GoodsSku, GoodsRelevant, GoodsImage, GoodsSales, GoodsName },
  setup () {
    const goods = useGoods()
    const changeSku = (sku) => {
      // 修改商品商品的现价原价库存信息
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.olfPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
        currSku.value = sku
      }
      // 记录选择后的sku,可能有数据，可能没有数据
      currSku.value = sku
    }
    provide('goods', goods)
    const num = ref(1)

    // 加入购物车
    const store = useStore()
    const currSku = ref(null)
    const inserCart = () => {
      // 约定加入购物车字段必须和后端保持一致
      if (currSku.value && currSku.value.skuId) {
        console.log('有')
        // id skuId name picture nowPrice price count  attrsText selected stock isEffective
        store.dispatch('cart/insertCart', {
          id: goods.value.id,
          skuId: currSku.value.skuId,
          name: goods.value.name,
          picture: goods.value.mainPictures[0],
          price: currSku.value.price,
          nowPrice: currSku.value.price,
          count: num.value,
          attrsText: currSku.value.specsText,
          selected: true,
          isEffective: true,
          stock: currSku.value.inventory
        }).then(() => {
          Message({ type: 'success', text: '添加成功' })
        })
      } else {
        Message({ text: '请选择完整规格' })
      }
    }
    return { goods, changeSku, num, inserCart }
  }
}
// 获取商品详情
const useGoods = () => {
  // 出现路由地址商品ID发生变化，但是不会重新初始化组件
  const goods = ref(null)
  const route = useRoute()
  watch(() => route.params.id, (newVal) => {
    if (newVal && `/product/${newVal}` === route.path) {
      findGoods(route.params.id).then(data => {
        // 让商品数据为null让后使用v-if的组件可以重新销毁和创建
        console.log(data.result)
        goods.value = null
        nextTick(() => {
          goods.value = data.result
        })
      })
    }
  }, { immediate: true })

  return goods
}

</script>
<style lang="less" scoped>
.goods-info {
  min-height: 600px;
  background: #fff;
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 980px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
</style>
