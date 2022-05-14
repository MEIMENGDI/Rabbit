<template>
  <div class="member-home">
    <!-- 概况 -->
    <MemberHomeOverview />
    <!-- 收藏 -->
    <HomePanel title="我的收藏">
      <GoodsItem v-for="item in collectGoods" :key="item.id" :goods="item" />
    </HomePanel>
    <!-- 足迹 -->
    <HomePanel title="我的足迹">
      <GoodsItem v-for="i in 4" :key="i" :goods="goods" />
    </HomePanel>
    <!-- 猜你喜欢 -->
    <GoodsRelevant />
  </div>
</template>
<script>
import MemberHomeOverview from './home-overview.vue'
import HomePanel from './home-panel.vue'
import GoodsRelevant from '@/views/goods/components/goods-relevant.vue'
import GoodsItem from '@/views/category/commponents/goods-item.vue'
import { findCollect } from '@/api/index'
import { ref } from 'vue'
export default {
  name: 'MemberHome',
  components: { GoodsItem, MemberHomeOverview, HomePanel, GoodsRelevant },
  setup () {
    const goods = {
      id: '1',
      name: '自煮火锅不排队 麦饭石不粘鸳鸯火锅',
      picture: 'https://yanxuan-item.nosdn.127.net/fcdcb840a0f5dd754bb8fd2157579012.jpg',
      desc: '清汤鲜香 红汤劲爽',
      price: '159.00'
    }
    const collectGoods = ref([])
    findCollect({ page: 1, pageSize: 4 }).then(data => {
      collectGoods.value = data.result.items
      // console.log(data.result.items)
    })
    return { goods, collectGoods }
  }
}
</script>
<style scoped lang="less">
:deep(.xtx-carousel) .carousel-btn.prev {
  left: 5px;
}
:deep(.xtx-carousel) .carousel-btn.next {
  right: 5px;
}
</style>
