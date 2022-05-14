<template>
  <div class="member-order">
    <!-- tabs组件 -->
    <XtxTabs v-model="activeName" @click-tab="clickTab">
      <XtxTabsPanel
        v-for="item in orderStatus"
        :key="item.name"
        :name="item.name"
        :label="item.label"
      ></XtxTabsPanel>
    </XtxTabs>
    <!-- 订单列表 -->
    <div class="order-list">
      <div v-if="loading" class="loading"></div>
      <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
      <OrderItem
        @on-logistics="onLogistics(item)"
        @on-confirm="onConfirmOrder(item)"
        @on-delete="handlerDelete(item)"
        @on-cancel="handlerCancel(item)"
        v-for="item in orderList"
        :key="item.id"
        :order="item"
      />
    </div>
    <!-- <div v-else class="loading"></div> -->
    <!-- 分页组件 -->
    <!-- 取消组件 -->
    <OrderCancel ref="orderCancelCom" />
    <!-- 查看物流信息 -->
    <OrderLogistics ref="onLogisticsCom" />
  </div>
</template>
<script>
import { reactive, ref, watch } from 'vue'
import { orderStatus } from '@/api/constants'
import { findOrderList, deleteOrder, confirmOrder } from '@/api/order'
import OrderItem from '../order/componments/order-item.vue'
import OrderCancel from '../order/componments/order-cancel.vue'
import OrderLogistics from '../order/componments/order-logistics.vue'
import Confirm from '@/components/library/confirm'
import Message from '@/components/library/message'
export default {
  name: 'MemberOrder',
  components: {
    OrderItem, OrderCancel, OrderLogistics
  },
  setup () {
    // 选项卡的展示
    const activeName = ref('all')
    const clickTab = (tab) => {
      requestParams.orderState = tab.index
      requestParams.page = 1
    }
    // 获取查询订单列表渲染
    // 定义查询参数
    const requestParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0
    })
    // 订单列表
    const orderList = ref([])
    // 加载状态
    const loading = ref(true)
    // 分页实现
    // const total = ref(0)
    const findOrderListFn = () => {
      loading.value = true
      findOrderList(requestParams).then(data => {
        console.log(data)
        orderList.value = data.result.items
        // total.value = data.result.counts
        loading.value = false
      })
    }
    // 使用watch监听查询条件，变更后查询
    watch(requestParams, () => {
      findOrderListFn()
    }, { immediate: true })
    // 删除订单
    const handlerDelete = (item) => {
      // console.log(item.id)
      Confirm({ title: '温馨提示', text: '亲，您确认删除订单吗' }).then(() => {
        deleteOrder(item.id).then(() => {
          Message({ text: '删除订单成功', type: 'success' })
          findOrderListFn()
        })
      }).catch(e => { })
    }
    return { activeName, clickTab, orderStatus, orderList, loading, handlerDelete, ...userCancel(), ...useConfirmOrder(), ...useLogisticsOrder() }
  }
}
// 取消订单逻辑
export const userCancel = () => {
  const orderCancelCom = ref(null)
  const handlerCancel = (item) => {
    orderCancelCom.value.open(item)
  }
  return { handlerCancel, orderCancelCom }
}
// 确认收货逻辑
export const useConfirmOrder = () => {
  const onConfirmOrder = (item) => {
    Confirm({ text: '您确认收到货吗？确认后货款将会打给卖家。' }).then(() => {
      confirmOrder(item.id).then(() => {
        Message({ text: '确认收货成功', type: 'success' })
        item.orderState = 4
      })
    })
  }
  return { onConfirmOrder }
}
// 查看物流逻辑
export const useLogisticsOrder = () => {
  const onLogisticsCom = ref(null)
  const onLogistics = (item) => {
    onLogisticsCom.value.open(item)
  }
  return { onLogistics, onLogisticsCom }
}
</script>
<style scoped lang="less">
.order-list {
  padding: 20px;
  position: relative;
  min-height: 400px;
  background: #fff;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9) url(../../../assets/images/loading1.gif)
    no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>
