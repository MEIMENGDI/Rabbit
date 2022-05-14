<template>
  <div class="order-detail-page" v-if="order">
    <!-- 操作栏 -->
    <DetailAction :order="order" />
    <!-- 步骤条 -->
    <DetailStep :order="order" />
    <!-- 物流栏 -->
    <Suspense v-if="[3, 4, 5].includes(order.orderState)">
      <!-- 组件加载完毕 -->
      <template #default>
        <DetailLogistics :order="order" />
      </template>
      <template #fallback>
        <div class="loading">loading</div>
      </template>
    </Suspense>
    <!-- 订单商品信息 -->
    <OrderInfo :order="order" />
  </div>
</template>
<script>
import { findOrder } from '@/api/order'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import DetailAction from '../order/componments/detail-action.vue'
import DetailStep from './componments/detail-step.vue'
import DetailLogistics from './componments/detail-logistics.vue'
import OrderInfo from './componments/order-info.vue'
export default {
  name: 'OrderDetailPage',
  components: { OrderInfo, DetailAction, DetailStep, DetailLogistics },
  setup () {
    const order = ref(null)
    const route = useRoute()
    findOrder(route.params.id).then(data => {
      console.log(data.result)
      order.value = data.result
    })
    return { order }
  }
}
</script>
<style lang="less" scoped>
.order-detail-page {
  background: #fff;
  height: 100%;
}
</style>
