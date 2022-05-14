<template>
  <div class="detail-logistics" v-if="logistics">
    <p>
      <span>{{ logistics.list[0].time }}</span>
      <span>{{ logistics.list[0].text }}</span>
    </p>
    <a href="javascript:;" @click="onLogistics(order)">查看物流</a>
    <Teleport to="#dailog">
      <OrderLogistics ref="onLogisticsCom" />
    </Teleport>
  </div>
</template>
<script>
import { logisticsOrder } from '@/api/order'
import OrderLogistics from '../componments/order-logistics.vue'
import { useLogisticsOrder } from '../index.vue'
import { ref } from 'vue'
export default {
  name: 'DetailLogistics',
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    OrderLogistics
  },
  async setup (props) {
    const logistics = ref(null)
    const data = await logisticsOrder(props.order.id)
    logistics.value = data.result
    return { logistics, ...useLogisticsOrder() }
  }
}
</script>
<style scoped lang="less">
.detail-logistics {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
  > p {
    flex: 1;
    span {
      color: #999;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  > a {
    color: @xtxColor;
    text-align: center;
  }
}
</style>
