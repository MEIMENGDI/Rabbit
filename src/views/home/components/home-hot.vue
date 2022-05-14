<template>
  <div class="home-new">
    <HomePanel ref="target" title="人气推荐" sub-title="人气爆款 不容错过">
      <!-- 面板内容 -->
      <div style="position: relative; height: 426px">
        <Transition name="fade">
          <ul v-if="goods.length" class="goods-list">
            <li v-for="item in goods" :key="item.id">
              <RouterLink :to="`/product/${item.id}`">
                <img :src="item.picture" alt="" />
                <p class="name">{{ item.title }}</p>
                <p class="desc">{{ item.alt }}</p>
              </RouterLink>
            </li>
          </ul>
          <HomeSkeleton v-else />
        </Transition>
      </div>
    </HomePanel>
  </div>
</template>
<script>
import HomePanel from '@/views/home/components/home-panel.vue'
import { findHot } from '@/api/home'
import HomeSkeleton from '@/views/home/components/home-skeleton.vue'
import { useLazyData } from '@/hooks/index'
export default {
  name: 'HomeHot',
  components: { HomePanel, HomeSkeleton },
  setup () {
    const { result, target } = useLazyData(findHot)
    return { goods: result, target }
  }
}
</script>
<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;
  li {
    width: 306px;
    height: 406px;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
