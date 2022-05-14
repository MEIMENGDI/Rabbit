<template>
  <div class="goods-relevant">
    <div class="header">
      <i class="icon"></i>
      <span class="title">同类商品推荐</span>
      <xtxCarousel :sliders="sliders" style="height: 380px" auto-play />
    </div>
  </div>
</template>

<script>
import { findRelGoods } from '@/api/goods'
import { ref } from 'vue'
import xtxCarousel from '@/components/library/xtx-carousel.vue'
export default {
  components: { xtxCarousel },
  name: 'GoodsRelevant',
  props: {
    goodsId: {
      type: String,
      default: undefined
    }
  },
  // 最终需要sliders数据
  // sliders:[[4],[4],[4],[4]]
  setup (props) {
    const sliders = ref([])
    findRelGoods({ id: props.goodsId }).then(data => {
      // sliders.value = data.result
      const size = 4
      const total = Math.ceil(data.result.length / size)
      for (let i = 0; i < total; i++) {
        sliders.value.push(data.result.slice(i * size, (i + 1) * size))
      }
      // alert(props.goodsId)
      // alert(sliders)
    })
    return { sliders }
  }
}
</script>

<style scoped lang='less'>
.goods-relevant {
  background: #fff;
  min-height: 460px;
  margin-top: 20px;
  .header {
    height: 80px;
    line-height: 80px;
    padding: 0 20px;
    .title {
      font-size: 20px;
      padding-left: 10px;
    }
    .icon {
      width: 16px;
      height: 16px;
      display: inline-block;
      border-top: 4px solid @xtxColor;
      border-right: 4px solid @xtxColor;
      box-sizing: border-box;
      position: relative;
      transform: rotate(45deg);
      &::before {
        content: "";
        width: 10px;
        height: 10px;
        position: absolute;
        left: 0;
        top: 2px;
        background: lighten(@xtxColor, 40%);
      }
    }
  }
}
:deep(.xtx-carousel) {
  height: 380px;
  .carousel {
    &-indicator {
      // height: 30px;
      bottom: -30px;
      span {
        &.active {
          background: @xtxColor;
        }
      }
    }
    &-btn {
      top: 110px;
      opacity: 1;
      background: rgba(0, 0, 0, 0);
      color: #ddd;
      i {
        font-size: 30px;
      }
    }
    &-price {
      height: 30px;
    }
  }
}
</style>
