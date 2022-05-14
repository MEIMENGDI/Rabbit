<template>
  <div class="xtx-checkbox" @click="changeChecked()">
    <i v-if="checked" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <!-- 有插槽存在，才会显示span标签 -->
    <span v-if="$slots.default"><slot /></span>
  </div>
</template>
<script>
// import { ref, watch } from 'vue'

import { useVModel } from '@vueuse/core'
export default {
  name: 'XtxCheck',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    const checked = useVModel(props, 'modelValue', emit)
    const changeChecked = () => {
      const newVal = !checked.value
      // 通知父组件
      checked.value = newVal
      // 使用emit组件通知父组件数据的变化
      emit('change', newVal)
    }
    // 使用监听器，得到父组件传递的数据，给checked数据
    // watch(() => props.moudelValue, () => {
    //   checked.value = props.moudelValue
    // }, { immediate: true })
    return {
      changeChecked, checked
    }
  }
}
</script>
<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
