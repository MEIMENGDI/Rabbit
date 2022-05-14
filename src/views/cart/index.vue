<template>
  <div class="xtx-cart-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem>购物车</XtxBreadItem>
      </XtxBread>
      <div class="cart">
        <table>
          <thead>
            <tr>
              <th class="tc" width="120">
                <XtxCheck
                  @change="checkAll"
                  :modelValue="$store.getters['cart/isCheckAll']"
                  >全选</XtxCheck
                >
              </th>
              <th width="400">商品信息</th>
              <th width="220">单价</th>
              <th width="180">数量</th>
              <th width="180">小计</th>
              <th width="140">操作</th>
            </tr>
          </thead>
          <!-- 有效商品 -->
          <tbody>
            <tr v-if="$store.getters['cart/validList'].length === 0">
              <td colspan="6">
                <CartNone />
              </td>
            </tr>
            <tr
              v-for="item in $store.getters['cart/validList']"
              :key="item.skuId"
            >
              <td class="tc">
                <XtxCheck
                  @change="($event) => checkOne(item.skuId, $event)"
                  :modelValue="item.selected"
                />
              </td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${item.skuId}`"
                    ><img :src="item.picture" alt=""
                  /></RouterLink>
                  <div>
                    <p class="name ellipsis">{{ item.name }}</p>
                    <!-- 选择规格组件 -->
                    <!-- @change调用子组件，使用updateCart()接收 -->
                    <CartSku
                      @change="($event) => updateCart(item.skuId, $event)"
                      :attrs-Text="item.attrsText"
                      :skuId="item.skuId"
                    />
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ item.nowPrice }}</p>
                <p v-if="item.price - item.nowPrice > 0">
                  比加入时降价<span class="red"
                    >&yen;{{ item.price - item.nowPrice }}</span
                  >
                </p>
              </td>
              <td class="tc">
                <XtxNumbox
                  :max="item.stock"
                  @change="($event) => changeCount(item.skuId, $event)"
                  :modelValue="item.count"
                />
              </td>
              <td class="tc">
                <p class="f16 red">&yen;{{ item.nowPrice }}</p>
              </td>
              <td class="tc">
                <p>移入收藏夹</p>
                <p>
                  <a
                    @click="deleteCart(item.skuId)"
                    class="green"
                    href="javascript:;"
                    >删除</a
                  >
                </p>
                <p><a href="#">找相似</a></p>
              </td>
            </tr>
          </tbody>
          <!-- 无效商品 -->
          <tbody v-if="$store.getters['cart/invalidList'].length > 0">
            <tr>
              <td colspan="6"><h3 class="tit">失效商品</h3></td>
            </tr>
            <tr
              v-for="item in $store.getters['cart/invalidList']"
              :key="item.id"
            >
              <td>
                <XtxCheck :modelValue="item.selected" style="color: #eee" />
              </td>
              <td>
                <div class="goods">
                  <RouterLink to="`/product/${item.id}`"
                    ><img :src="item.picture" alt=""
                  /></RouterLink>
                  <div>
                    <p class="name ellipsis">
                      {{ item.name }}
                    </p>
                    <p class="attr">{{ item.attrsText }}</p>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ item.price }}</p>
              </td>
              <td class="tc">{{ item.count }}</td>
              <td class="tc">
                <p>&yen;{{ (item.nowPrice * 100 * item.count) / 100 }}</p>
              </td>
              <td class="tc">
                <p><a class="green" href="javascript:;">删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 操作栏 -->
      <div class="action">
        <div class="batch">
          <XtxCheck
            @change="checkAll"
            :modelValue="$store.getters['cart/isCheckAll']"
            >全选</XtxCheck
          >
          <a @click="batchDeleteCart()" href="javascript:;">删除商品</a>
          <a href="javascript:;">移入收藏夹</a>
          <a @click="batchDeleteCart(true)" href="javascript:;">清空失效商品</a>
        </div>
        <div class="total">
          共{{ $store.getters["cart/validTotal"] }}件商品，已选择{{
            $store.getters["cart/selectedTotal"]
          }}件，商品合计：
          <span class="red">￥{{ $store.getters["cart/selectedAmount"] }}</span>
          <XtxButton type="primary" @click="goCheckout()">下单结算</XtxButton>
        </div>
      </div>
      <!-- 猜你喜欢 -->
      <GoodRelevant />
    </div>
  </div>
</template>
<script>
import GoodRelevant from '@/views/goods/components/goods-relevant'
import CartNone from '@/views/cart/components/cart-none.vue'
import CartSku from '@/views/cart/components/cart-sku.vue'
import { useStore } from 'vuex'
import Message from '@/components/library/message'
import { useRouter } from 'vue-router'
import Confirm from '@/components/library/confirm'
export default {
  name: 'XtxCartPage',
  components: { GoodRelevant, CartNone, CartSku },
  setup () {
    const store = useStore()
    // 单选按钮的修改
    const checkOne = (skuId, selected) => {
      console.log(skuId, selected)
      store.dispatch('cart/updateCart', { skuId, selected })
    }
    // 全选按钮
    const checkAll = (selected) => {
      store.dispatch('cart/checkAll', selected)
    }
    // 删除单条商品
    const deleteCart = (skuId) => {
      console.log('点击删除商品')
      Confirm({ text: '您确定从购物车删除该商品吗？', title: 'ok' }).then(() => {
        store.dispatch('cart/deleteCart', skuId)
      }).catch(e => {
        console.log('点击取消')
      })
      // store.dispatch('cart/deleteCart', skuId)
    }
    // 批量删除商品
    const batchDeleteCart = (isClear) => {
      store.dispatch('cart/batchDelteCart')
    }
    // 修改购物车的数量
    const changeCount = (skuId, count) => {
      store.dispatch('cart/updateCart', { skuId, count })
    }
    // 修改规格
    const updateCart = (oldSkuId, newSku) => {
      store.dispatch('cart/updateCartSku', { oldSkuId, newSku })
    }
    const router = useRouter()
    // 下单结算
    const goCheckout = () => {
      // 1.判断是否选中有效商品
      if (store.getters['cart/selectedTotal'] === 0) return Message({ text: '至少选中一件商品才能结算' })
      // 2.判断是否登录
      if (!store.state.user.profile.token) {
        Message({ type: 'success', text: '下单结算需要登录，您是否去登录' })
      }
      // 3.满足以上条件去填写订单结算页面
      router.push('/member/checkout')
      // 下单结束后进入首页
    }
    return { goCheckout, checkOne, checkAll, deleteCart, batchDeleteCart, changeCount, updateCart }
  }
}
</script>
<style scoped lang="less">
.tc {
  text-align: center;
  .xtx-number {
    margin: 0 auto;
    width: 120px;
  }
}
.red {
  color: @priceColor;
}
.green {
  color: @xtxColor;
}
.f16 {
  font-size: 16px;
}
.goods {
  display: flex;
  align-items: center;
  img {
    width: 100px;
    height: 100px;
  }
  > div {
    width: 280px;
    font-size: 16px;
    padding-left: 10px;
    .attr {
      font-size: 14px;
      color: #999;
    }
  }
}
.action {
  display: flex;
  background: #fff;
  margin-top: 20px;
  height: 80px;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  padding: 0 30px;
  .xtx-checkbox {
    color: #999;
  }
  .batch {
    a {
      margin-left: 20px;
    }
  }
  .red {
    font-size: 18px;
    margin-right: 20px;
    font-weight: bold;
  }
}
.tit {
  color: #666;
  font-size: 16px;
  font-weight: normal;
  line-height: 50px;
}
.xtx-cart-page {
  .cart {
    background: #fff;
    color: #666;
    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;
      th,
      td {
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;
        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }
      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }
}
</style>
