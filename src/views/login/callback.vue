<template>
  <LoginHeader>联合登录</LoginHeader>
  <section class="container" v-if="isBind">
    <div class="unbind">
      <div class="loading"></div>
    </div>
  </section>
  <section class="container" v-else>
    <nav class="tab">
      <a
        @click="hasAccount = true"
        :class="{ active: hasAccount }"
        href="javascript:;"
      >
        <i class="iconfont icon-bind" />
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a
        @click="hasAccount = false"
        :class="{ active: !hasAccount }"
        href="javascript:;"
      >
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <CallbackBind :unionId="unionId" />
    </div>
    <div class="tab-content">
      <CallbackPatch :unionId="unionId" />
    </div>
  </section>
  <LoginFooter @unionId="unionId" />
</template>
<script>
import LoginHeader from './components/login-header.vue'
import LoginFooter from './components/login-footer.vue'
import CallbackBind from './components/callback-bind.vue'
import CallbackPatch from './components/callback-patch.vue'
import { userQQLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import Message from '@/components/library/message'
import QC from 'qc'
export default {
  name: 'CallBack',
  components: {
    LoginHeader, LoginFooter, CallbackBind, CallbackPatch
  },
  setup () {
    const unionId = ref(null)
    const hasAccount = ref(true)
    const store = useStore()
    const router = useRouter()
    // 假设已经绑定，默认回去登录，登录失败证明未绑定
    const isBind = ref(true)
    if (QC.Login.check()) {
      // 检查qq是否登录
      // 登录了才能获取qq互联的oppenID
      QC.Login.getMe((openId) => {
        unionId.value = openId
        // 根据qq互联的oppenId去进行登录，准备一个接口
        userQQLogin(openId).then(data => {
          console.log('调用成功')
          // 代表qq登录成功
          // 存储用户信息--就需要在登录页面存储来源页面以便于跳转
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          // 跳转原来页面
          store.dispatch('cart/mergeLocalCart').then(() => {
            // 2. 跳转到来源页或者首页
            router.push(store.state.user.redirectUrl)
            // 3. 成功提示
            Message({ type: 'success', text: 'QQ登录成功' })
          })
        }).catch(e => {
          // 代表：使用qq登录失败
          console.dir(e)
          isBind.value = false
        })
      })
    }
    return { hasAccount, isBind, unionId }
  }
}
</script>
<style lang="less" scoped>
.container {
  padding: 25px 0;
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>
