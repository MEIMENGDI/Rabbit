  <template>
  <div class="goods-tabs">
    <nav>
      <a
        :class="{ active: activeName === 'GoodsDetail' }"
        @click="clickTab('GoodsDetail')"
        href="javascript:;"
        >商品详情</a
      >
      <a
        :class="{ active: activeName === 'GoodsComment' }"
        @click="clickTab('GoodsComment')"
        href="javascript:;"
        >商品评价<span>({{ goods.commentCount }})</span></a
      >
    </nav>
    <!-- 切换内容的地方,其实是两个组件 -->
    <component :is="activeName"></component>
  </div>
</template>
<script>
import { inject, ref } from 'vue'
import GoodsDetail from './goods-detail.vue'
import GoodsComment from './goods-comment.vue'
export default {
  name: 'GoodsTab',
  components: {
    GoodsDetail, GoodsComment
  },
  setup () {
    const goods = inject('goods')
    // 详情-->detail comment-->评价
    const activeName = ref('GoodsDetail')
    const clickTab = (name) => {
      activeName.value = name
    }
    return { activeName, clickTab, goods }
  }
}
</script>
<style lang="less" scoped>
.goods-tabs {
  margin-top: 20px;
  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;
      > span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
      &:first-child {
        border-right: 1px solid #f5f5f5;
      }
      &.active {
        &::before {
          content: "";
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>
