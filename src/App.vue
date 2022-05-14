<template>
  <!-- 一级路由 -->
  <div class="container"></div>
  <router-view></router-view>
</template>
<script>
export default {
  name: 'App',
  setup () {
  }
};
</script>
<style scoped lang="less">
.container {
  .hoverShadow();
}
</style>
