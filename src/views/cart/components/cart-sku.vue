<template>
  <div class="cart-sku" ref="target">
    <div class="attrs" @click="toggle()">
      <div class="ellipsis">{{ attrsText }}</div>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="layer" v-show="visible">
      <div v-if="!goods" class="loading"></div>
      <GoodsSku
        @change="chagneSku"
        v-if="goods"
        :skuId="skuId"
        :goods="goods"
      />
      <XtxButton
        @click="submit()"
        v-if="goods"
        type="primary"
        size="mini"
        style="margin-left: 60px"
        >确定</XtxButton
      >
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import GoodsSku from '@/views/goods/components/goods-sku.vue'
import { onClickOutside } from '@vueuse/core'
import { getSpecsAndSkus } from '@/api/goods'
export default {
  name: 'CartSku',
  components: { GoodsSku },
  props: {
    skuId: {
      type: String,
      default: ''
    },
    attrsText: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const visible = ref(false)
    const target = ref(null)
    const goods = ref(null)
    // 展开
    const open = () => {
      visible.value = true
      getSpecsAndSkus(props.skuId).then(data => {
        goods.value = data.result
      })
    }
    // 隐藏
    const close = () => {
      visible.value = false
      goods.value = null
    }
    // 点击展开或隐藏
    const toggle = () => {
      visible.value ? close() : open()
    }
    // 点击非点击区域页面，隐藏
    onClickOutside(target, () => {
      close()
    })
    // 选择SKU时触发
    const currSku = ref(null)
    const chagneSku = (sku) => {
      currSku.value = sku
    }
    // 点击确认的时候，提交sku信息给购物车组件
    const submit = () => {
      // 给购物车组件数据的前提：有sku信息，sku信息完整，sku中的skuid不能出现和props.skuid一样
      if (currSku.value && currSku.value.skuId && currSku.value.skuId !== props.skuId) {
        emit('change', currSku.value)
        close()
      }
    }
    return { toggle, visible, target, goods, submit, chagneSku }
  }
}
</script>
<style scoped lang="less">
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display: inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor, 50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: "";
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(0.8, 1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(../../../assets/images/loading.gif) no-repeat center;
      background-size: 200px 100px;
    }
  }
}
</style>
