<template>
  <Transition name="down">
    <div class="xtx-message" v-show="visible">
      <!-- 上边小图标样式 -->
      <!-- 下边是提示错误文字 -->
      <i class="iconfont" :class="[style[type].icon]"></i>
      <span class="text">{{ text }}</span>
    </div>
  </Transition>
</template>
<script>
import { onMounted, ref } from 'vue'
export default {
  name: 'XtxMessage',
  // 消息提示组件 在上方显示
  // 有三种 成功 失败 警告
  // 封装成工具函数方式
  props: {
    text: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'warn'
    }
  },
  setup (props) {
    // 定义一个对象，包含三种情况的样式，对象key就是类型字符串
    const style = {
      warn: {
        icon: 'icon-warning',
        color: '#E6A23C',
        backgroundColor: 'rgb(253, 246, 236)',
        borderColor: 'rgb(250, 236, 216)'
      },
      error: {
        icon: 'icon-shanchu',
        color: '#F56C6C',
        backgroundColor: 'rgb(254, 240, 240)',
        borderColor: 'rgb(253, 226, 226)'
      },
      success: {
        icon: 'icon-queren2',
        color: '#67C23A',
        backgroundColor: 'rgb(240, 249, 235)',
        borderColor: 'rgb(225, 243, 216)'
      }
    }
    // 定义一个数据控制显示隐藏，默认是隐藏，组件挂载完毕显示
    const visible = ref(false)
    onMounted(() => {
      visible.value = true
    })
    return { style, visible }
  }
}
</script>
<style lang="less" scoped>
.down {
  &-enter {
    &-from {
      transform: translate3d(0, -75px, 0);
      opacity: 0;
    }
    &-active {
      transition: all 0.5s;
    }
    &-to {
      transform: none;
      opacity: 1;
    }
  }
}
.xtx-message {
  width: 300px;
  height: 50px;
  position: fixed;
  z-index: 9999;
  left: 50%;
  margin-left: -150px;
  top: 25px;
  line-height: 50px;
  padding: 0 25px;
  border: 1px solid #e4e4e4;
  background: #f5f5f5;
  color: #999;
  border-radius: 4px;
  i {
    margin-right: 4px;
    vertical-align: middle;
  }
  .text {
    vertical-align: middle;
  }
}
</style>
