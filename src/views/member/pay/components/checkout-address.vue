<template>
  <div class="checkout-address">
    <div class="text">
      <div v-if="!showAddress" class="none">
        您需要先添加收获地址才可提交订单
      </div>
      <div v-if="showAddress" class="text">
        <ul>
          <li>
            <span>收<i />货<i />人:</span>{{ showAddress.receiver }}
          </li>
          <li>
            <span>联系方式</span
            >{{
              showAddress.contact.replace(/^(\d{3})d{4}(\d{4})/, "$1****$2")
            }}
          </li>
          <li>
            <span>收货地址</span>{{ showAddress.fullLocation
            }}{{ showAddress.address }}
          </li>
        </ul>
        <a
          v-if="showAddress"
          @click="openAddressEdit(showAddress)"
          href="javascript:;"
          >修改地址</a
        >
      </div>
      <div class="action">
        <xtx-button @click="openDialog()" class="btn">切换地址</xtx-button>
        <xtx-button
          @on-success="successHandler"
          @click="openAddressEdit({})"
          class="btn"
          >添加地址</xtx-button
        >
      </div>
    </div>
    <XtxDialog v-model:visible="dialogVisible" title="切换收获地址">
      <div
        :class="{ active: selectedAddress && item.id === selectedAddress.id }"
        class="text item"
        @click="selectedAddress = item"
        v-for="item in list"
        :key="item.id"
      >
        <ul>
          <li>
            <span>收<i />货<i />人:</span>{{ item.receiver }}
          </li>
          <li><span>联系方式：</span>{{ item.contact }}</li>
          <li>
            <span>收货地址：</span
            >{{ item.fullLocation.replace(/ /g, "") + item.address }}
          </li>
        </ul>
      </div>
      <template v-slot:footer>
        <XtxButton
          @click="dialogVisible = false"
          type="gray"
          style="margin-right: 20px"
          >取消</XtxButton
        >
        <XtxButton @click="confirmAddress()" type="primary">确认</XtxButton>
      </template>
    </XtxDialog>
    <!-- 收货地址添加编辑组件 -->
    <AddressEdit ref="addressEditCom" @on-success="successHandler" />
  </div>
</template>
<script>
import { ref } from 'vue'
import AddressEdit from './address-edit.vue'
import XtxDialog from './xtx-dialog.vue'
export default {
  name: 'CheckoutAddress',
  components: {
    AddressEdit, XtxDialog
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  emits: ['change'],
  // 1.组件初始化的时候需要得到一个默认的地址ID通知给结算组件
  // 2.对话框中渲染一个地址列表
  // 3.实现可以选中的效果，点击确定后变更显示地址，通知结算组件ID
  setup (props, { emit }) {
    // 1.找到默认收货地址
    // 2.没有默认收货地址，使用第一条收货地址
    // 3.如果没有数据，提示添加
    // 切换地址
    const dialogVisible = ref(false)
    const showAddress = ref(null)
    const defaultAddress = props.list.find(item => item.isDefault === 0)
    if (defaultAddress) {
      showAddress.value = defaultAddress
    } else {
      if (props.list.length) {
        // 加上一个注释:忽略下面代码的检查eslint
        // eslint-disable-next-line vue/no-setup-props-destructure
        showAddress.value = props.list[0]
      }
    }
    // emit('change', showAddress.value?.id)
    // 添加收货地址
    const addressEditCom = ref(null)
    const openAddressEdit = (address) => {
      // 添加的时候传的是一个空对象，修改的时候传的是当前地址
      addressEditCom.value.open(address)
      selectedAddress.value = null
    }
    // 切换收获地址
    const openDialog = () => {
      dialogVisible.value = true
    }
    // 添加收获地址成功
    const successHandler = (formData) => {
      // 父组件修改数据
      const editAddress = props.list.find(item => item.id === formData.id)
      if (editAddress) {
        // 修改
        for (const key in editAddress) {
          editAddress[key] = formData[key]
        }
      } else {
        const json = JSON.stringify(formData) // 需要克隆下，不然使用的是对象的引用
        // eslint-disable-next-line vue/no-mutating-props
        props.list.unshift(JSON.parse(json))
      }
    }
    // 选择的地址
    const selectedAddress = ref(null)
    // 确认切换地址
    const confirmAddress = () => {
      showAddress.value = selectedAddress.value
      dialogVisible.value = false
      // 加上？就是如果value有值我们去取id 前置判断
      emit('change', showAddress.value?.id)
    }
    return { openDialog, selectedAddress, confirmAddress, successHandler, dialogVisible, showAddress, addressEditCom, openAddressEdit }
  }
}
</script>
<style lang="less" scoped>
.xtx-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,
      &:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor, 50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>
