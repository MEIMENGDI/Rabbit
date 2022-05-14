<template>
  <div class="detail-action">
    <div class="state">
      <!-- {{ order }} -->
      <span
        class="iconfont"
        :class="[`icon-order-${orderStatus[order.orderState].name}`]"
      ></span>
      <p>{{ orderStatus[order.orderState].label }}</p>
    </div>
    <div class="info">
      <p>订单编号：{{ order.id }}</p>
      <p>下单时间：{{ order.createTime }}</p>
    </div>
    <div class="btn">
      <!-- 代付款 -->
      <template v-if="order.orderState === 1">
        <XtxButton
          @click="$route.push('/member/pay?id=' + order.id)"
          type="primary"
          size="small"
          >立即付款</XtxButton
        >
        <XtxButton @click="handlerCancel(order)" type="primary" size="small"
          >取消订单</XtxButton
        >
      </template>
      <!-- 待发货 -->
      <template v-if="order.orderState === 2">
        <XtxButton
          @click="$router.push(`/member/checkout?orderId=${order.id}`)"
          type="primary"
          size="small"
          >再次购买</XtxButton
        >
      </template>
      <!-- 待收货 -->
      <template v-if="order.orderState === 3">
        <XtxButton @click="onConfirmOrder(order)" type="primary" size="small"
          >确认收货</XtxButton
        >
        <XtxButton
          @click="$router.push(`/member/checkout?orderId=${order.id}`)"
          type="plain"
          size="small"
          >再次购买</XtxButton
        >
      </template>
      <!-- 待评价 -->
      <template v-if="order.orderState === 4">
        <XtxButton
          @click="$router.push(`/member/checkout?orderId=${order.id}`)"
          type="primary"
          size="small"
          >再次购买</XtxButton
        >
        <XtxButton type="plain" size="small">评价商品</XtxButton>
        <XtxButton type="gray" size="small">申请售后</XtxButton>
      </template>
      <!-- 已完成 -->
      <template v-if="order.orderState === 5">
        <XtxButton
          @click="$router.push(`/member/checkout?orderId=${order.id}`)"
          type="primary"
          size="small"
          >再次购买</XtxButton
        >
        <XtxButton type="plain" size="small">查看评价</XtxButton>
        <XtxButton type="gray" size="small">申请售后</XtxButton>
      </template>
      <!-- 取消订单组件 -->
      <Teleport to="#dailog">
        <OrderCancel ref="orderCancelCom" />
      </Teleport>
    </div>
  </div>
</template>
<script>
import { orderStatus } from '@/api/constants'
import { userCancel, useConfirmOrder } from '../index.vue'
import OrderCancel from './order-cancel.vue'
export default {
  name: 'DetailAction',
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    OrderCancel
  },
  setup (props) {
    console.log('传递的order' + props.order)
    return { orderStatus, ...userCancel(), ...useConfirmOrder() }
  }
}
</script>
<style lang="less" scoped>
.detail-action {
  height: 180px;
  width: 100%;
  display: flex;
  align-items: center;
  .state {
    width: 220px;
    text-align: center;
    .iconfont {
      font-size: 40px;
      color: @xtxColor;
    }
    p {
      font-size: 16px;
      color: #666;
      margin-bottom: 10px;
    }
  }
  .info {
    width: 240px;
    line-height: 30px;
    p {
      color: #999;
    }
  }
  .btn {
    flex: 1;
    text-align: right;
    margin-right: 100px;
    .xtx-button {
      margin-left: 20px;
    }
  }
}
</style>
