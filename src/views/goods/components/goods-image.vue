<template>
  <div class="goods-image">
    <div
      v-show="show"
      ref="target"
      class="large"
      :style="[{ backgroundImage: `url(${images[currIndex]})` }, bgPosition]"
    ></div>
    <div class="middle" ref="target">
      <img :src="images[currIndex]" alt="" />
      <div class="layer" v-show="show" :style="position"></div>
    </div>
    <ul class="small">
      <li
        v-for="(img, i) in images"
        :key="img"
        :class="{ active: i === currIndex }"
      >
        <img @mouseenter="currIndex = i" :src="img" alt="" />
      </li>
    </ul>
  </div>
</template>
<script>
import { reactive, ref, watch } from 'vue'
import { useMouseInElement } from '@vueuse/core'
export default {
  name: 'GoodsImage',
  props: {
    images: {
      type: Array,
      default: () => []
    }
  },
  setup (props) {
    const currIndex = ref(0)
    const target = ref(null)
    const show = ref(false)
    const { elementX, elementY, isOutside } = useMouseInElement(target)
    const position = reactive({ left: 0, top: 0 })
    const bgPosition = reactive({ backgroundPositionX: 0, backgroundPositionY: 0 })
    watch([elementX, elementY, isOutside], () => {
      show.value = !isOutside.value
      // 遮罩左边位置
      if (elementX.value < 100) position.left = 0
      else if (elementX.value > 300) position.left = 200
      else position.left = elementX.value - 100
      // 遮罩右边位置
      if (elementY.value < 100) position.top = 0
      else if (elementY.value > 300) position.top = 200
      else position.top = elementY.value - 100
      // 背景放大位置
      bgPosition.backgroundPositionX = -2 * position.left + 'px'
      bgPosition.backgroundPositionY = -2 * position.top + 'px'
      position.left = position.left + 'px'
      position.top = position.top + 'px'
    })
    return { currIndex, target, bgPosition, position, show }
  }
}
</script>
<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  z-index: 500;
  .large {
    width: 400px;
    height: 400px;
    position: absolute;
    left: 412px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }
  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    position: relative;
    cursor: move;
    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0, 0, 0, 0.2);
      left: 0;
      top: 0;
      position: absolute;
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,
      &.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
