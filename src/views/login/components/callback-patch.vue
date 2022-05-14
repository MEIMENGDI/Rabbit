<template>
  <Form
    ref="formCom"
    :validation-schema="mySchema"
    v-slot="{ errors }"
    autocomplete="off"
    class="xtx-form"
  >
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field
          v-model="form.account"
          :class="{ err: errors.account }"
          name="account"
          class="input"
          type="text"
          placeholder="请输入用户名"
        />
      </div>
      <div class="error" v-if="errors.account">
        {{ errors.account }}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field
          v-model="form.mobile"
          :class="{ err: errors.mobile }"
          name="mobile"
          class="input"
          type="text"
          placeholder="请输入手机号"
        />
      </div>
      <div class="error" v-if="errors.mobile">
        {{ errors.mobile }}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field
          v-model="form.code"
          :class="{ err: errors.code }"
          name="code"
          class="input"
          type="text"
          placeholder="请输入验证码"
        />
        <span class="code" @click="send()">{{
          time === 0 ? "发送验证码" : `${time}秒后发送`
        }}</span>
      </div>
      <div class="error" v-if="errors.code">{{ errors.code }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          v-model="form.password"
          :class="{ err: errors.password }"
          name="password"
          class="input"
          type="password"
          placeholder="请输入密码"
        />
      </div>
      <div class="error" v-if="errors.password">{{ errors.password }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          name="rePassword"
          v-model="form.rePassword"
          :class="{ err: errors.rePassword }"
          class="input"
          type="password"
          placeholder="请确认密码"
        />
      </div>
      <div class="error" v-if="errors.rePassword">{{ errors.rePassword }}</div>
    </div>
    <a href="javascript:;" class="submit" @click="submit()">立即提交</a>
  </Form>
</template>
<script>
import { Form, Field } from 'vee-validate'
import { reactive, ref } from 'vue'
import schema from '@/utils/vee-validate-schema'
import { userQQPatchCode, userQQPatchLogin } from '@/api/user'
import Message from '@/components/library/message'
import { useIntervalFn } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
  name: 'CallbackPatch',
  components: {
    Form, Field
  },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    // 表单数据对象
    const form = reactive({
      account: null,
      mobile: null,
      code: null,
      password: null,
      rePassword: null
    })
    // 表单校验规则
    const mySchema = reactive({
      account: schema.accountApi,
      mobile: schema.mobile,
      code: schema.code,
      password: schema.password,
      rePassword: schema.rePassword
    })
    const formCom = ref(null)
    const time = ref(0)
    const { pause, resume } = useIntervalFn(() => {
      time.value--
      if (time.value <= 0) pause()
    }, 1000, false)
    // 发送验证码
    const send = async () => {
      // 发送验证码的时候只校验手机号
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        if (time.value === 0) {
          await userQQPatchCode(form.mobile)
          Message({ type: 'success', text: '发送成功' })
          time.value = 60
          resume()
        }
      } else {
        formCom.value.setFieldError('mobile', valid)
      }
    }
    // 进行提交--需要一个接口
    // 进行存储
    // 存储完跳转到源页面
    const store = useStore()
    const router = useRouter()
    const submit = async () => {
      const valid = formCom.value.validate()
      if (valid) {
        await userQQPatchLogin({ unionId: props.unionId, ...form }).then(data => {
          const { id, account, avatar, mobile, nickname, token } = data.result
          // 1.存储信息
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          // 2. 跳转到来源页或者首页
          // 合并购物车操作
          store.dispatch('cart/mergeLocalCart').then(() => {
            // 2. 提示
            Message({ type: 'success', text: '完善信息成功' })
            // 3. 跳转
            router.push(store.state.user.redirectUrl || '/')
          })
          // 3. 成功提示
          Message({ type: 'success', text: 'QQ完善信息成功' })
        }).catch(e => {
          Message({ type: 'error', text: '完善信息失败' })
        })
      }
    }
    return { form, formCom, mySchema, send, submit, time }
  }
}
</script>
<style lang="less" scoped>
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
