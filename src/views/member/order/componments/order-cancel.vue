<template>
  <XtxDialog title="取消订单" v-model:visible="visibleDialog">
    <!-- 组件内容 -->
    <div class="cancel-info">
      <p>取消订单后，本单享有的优惠可能会一并取消，是否需继续？</p>
      <p class="tip">请选择取消订单的原因（必选）</p>
      <div class="btn">
        <a
          @click="curText = item"
          v-for="item in cancelReason"
          :key="item"
          :class="{ active: curText === item }"
          href="javascript:;"
        >
          {{ item }}
        </a>
      </div>
    </div>
    <!-- 按钮操作 -->
    <template #footer>
      <XtxButton @click="visibleDialog = false" type="gray">再想想</XtxButton>
      <XtxButton @click="submit" type="primary" style="margin-left: 15px"
        >提交</XtxButton
      >
    </template>
  </XtxDialog>
</template>
<script>
import { cancelReason } from '@/api/constants'
import { cancelOrder } from '@/api/order'
import { ref } from 'vue'
import XtxDialog from '../../pay/components/xtx-dialog.vue'
import Message from '@/components/library/message'
export default {
  name: 'OrderCancel',
  components: { XtxDialog },
  setup () {
    const visibleDialog = ref(false)
    // 获取订单
    const order = ref(null)
    // 打开对话框
    const open = (item) => {
      // 打开对话框
      visibleDialog.value = true
      order.value = item
      // 清除之前选中原因
      curText.value = ''
    }
    // 选择取消原因
    const curText = ref('')
    // 确认取消订单
    const submit = () => {
      // 1. 根据订单ID和取消原因发请求
      if (!curText.value) Message({ text: '选择原因', type: 'success' })
      cancelOrder(order.value.id, curText.value).then(() => {
        // 取消订单成功
        Message({ text: '取消订单成功', type: 'success' })
        // 更新订单状态
        order.value.orderState = 6
        // 关闭对话框
        visibleDialog.value = false
      })
    }
    return { cancelReason, curText, visibleDialog, open, submit }
  }
}
</script>
<style lang="less" scoped>
.xtx-dialog :deep(.wrapper) {
  width: 620px;
}
.cancel-info {
  p {
    font-size: 16px;
    line-height: 35px;
    &.tip {
      color: #999;
    }
  }
  .btn {
    padding-top: 21px;
    display: flex;
    flex-wrap: wrap;
    a {
      width: 256px;
      height: 45px;
      line-height: 45px;
      text-align: center;
      background-color: #ffffff;
      border: 1px solid #e4e4e4;
      margin-right: 20px;
      margin-bottom: 20px;
      color: #666;
      &:nth-child(2n) {
        margin-right: 0;
      }
      &:hover,
      &.active {
        background-color: #e3f9f4;
        border-color: @xtxColor;
      }
    }
  }
}
</style>
