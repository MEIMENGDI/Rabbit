<template>
  <Form
    :validation-schema="mySchema"
    v-slot="{ errors }"
    autocomplete="off"
    class="xtx-form"
    ref="formCom"
  >
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi,{{ nickname }}欢迎来小兔鲜，完成绑定后可以qq一键登录哦</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field
          class="input"
          :class="{ err: errors.mobile }"
          name="mobile"
          v-model="form.mobile"
          type="text"
          placeholder="绑定的手机号"
        />
      </div>
      <div class="error" v-if="errors.mobile">
        <i class="iconfont icon-warning" />
        {{ errors.mobile }}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field
          class="input"
          :class="{ err: errors.code }"
          name="code"
          v-model="form.code"
          type="text"
          placeholder="短信验证码"
        />
        <span class="code" @click="send()">{{
          time === 0 ? "发送验证码" : `${time}秒后重新发送`
        }}</span>
      </div>
    </div>
    <a href="javascript:;" @click="submit()" class="submit">立即绑定</a>
  </Form>
</template>
<script>
import { onUnmounted, reactive, ref } from 'vue'
import { Form, Field } from 'vee-validate'
import QC from 'qc'
import schema from '@/utils/vee-validate-schema'
import { userQQBindCode, userQQBindLogin } from '@/api/user'
import Message from '@/components/library/message'
import { useIntervalFn } from '@vueuse/core';
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'CallbackBind',
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  components: {
    Form, Field
  },
  setup (props) {
    // 准备信息，unionId(openId) qq头像 昵称
    // 完成表单校验
    // 发送验证码（校验，定义api，调用，完成倒计时）
    // 进行绑定（绑定成功就是登录成功）
    // 第1步
    const nickname = ref('null')
    const avatar = ref('null')
    if (QC.Login.check()) {
      QC.api('get_user_info').success(res => {
        avatar.value = res.data.figureurl_qq_1
        nickname.value = res.data.nickname
      })
    }
    // 第2步---校验表单
    // 表单数据对象
    const form = reactive({
      mobile: '',
      code: ''
    })
    // 校验规则
    const mySchema = reactive({
      mobile: schema.mobile,
      code: schema.code
    })
    // 第3步---点击验证码校验表单并且验证码倒计时
    const formCom = ref('null')
    const time = ref(0)
    const { pause, resume } = useIntervalFn(() => {
      time.value--
      if (time.value <= 0) {
        pause()
      }
    }, 1000, false)
    onUnmounted(() => {
      pause()
    })
    const send = async () => {
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        // 通过
        if (time.value === 0) {
          // 没有倒计时才可以发送
          await userQQBindCode(form.mobile)
          Message({ type: 'success', text: '发送成功' })
          time.value = 60
          resume()
        }
      } else {
        // 失败，使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
        formCom.value.setFieldError('mobile', valid)
      }
    }
    // 第4步---绑定手机号
    // 需要整体校验一下，手机号和验证码是否有误，无误进行信息的存储，登录到
    const store = useStore()
    const router = useRouter()
    const submit = async () => {
      const valid = formCom.value.validate()
      if (valid) {
        await userQQBindLogin({ unionId: props.unionId, ...form }).then(data => {
          // 实现用户存储
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          // 返回到原来页面
          router.push(store.state.user.redirectUrl)
          // 登录成功
          store.dispatch('cart/mergeLocalCart').then(() => {
            // 提示
            Message({ type: 'success', text: '绑定成功' })
            // 跳转
            router.push(store.state.user.redirectUrl || '/')
          })
        }).catch(e => {
          Message({ type: 'error', text: '绑定失败' })
        })
      }
    }
    return { avatar, nickname, mySchema, form, send, formCom, time, submit }
  }
}
</script>
<style lang="less" scoped>
.user-info {
  width: 320px;
  height: 70px;
  margin: 0 auto;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 25px;
  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }
  p {
    padding-left: 10px;
  }
}
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
