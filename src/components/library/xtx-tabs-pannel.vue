<template>
  <div class="xtx-tabs-panel" v-show="name === activeName">
    <slot />
  </div>
</template>
<script>
import { inject } from 'vue'
export default {
  name: 'XtxTabsPanel',
  props: {
    // 选项卡文字 $slot.default()默认插槽内容
    label: {
      type: String,
      defalut: ''
    },
    // 唯一标识
    name: {
      type: [String, Number],
      defalut: ''
    }
  },
  setup () {
    const activeName = inject('activeName')
    return { activeName }
  }
}
</script>
