<template>
  <div class="account-box">
    <div class="toggle">
      <a
        @click="isMsgLogin = false"
        href="javascript:;"
        v-if="(isMsgLogin = isMsgLogin)"
      >
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin = true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <Form
      ref="formCom"
      class="form"
      :validation-schema="schema"
      v-slot="{ errors }"
      autocomplete="off"
    >
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field
              :class="{ error: errors.account }"
              v-model="form.account"
              name="account"
              type="text"
              placeholder="请输入用户名或手机号"
            />
          </div>
          <div class="error" v-if="errors.account">
            <i class="iconfont icon-warning" />{{ errors.account }}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field
              :class="{ error: errors.password }"
              v-model="form.password"
              name="password"
              type="password"
              placeholder="请输入密码"
            />
          </div>
          <div class="error" v-if="errors.password">
            <i class="iconfont icon-warning" />{{ errors.password }}
          </div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field
              :class="{ error: errors.mobile }"
              v-model="form.mobile"
              name="mobile"
              type="text"
              placeholder="请输入手机号"
            />
          </div>
          <div class="error" v-if="errors.mobile">
            <i class="iconfont icon-warning" />{{ errors.mobile }}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field
              :class="{ error: errors.code }"
              v-model="form.code"
              name="code"
              type="password"
              placeholder="请输入验证码"
            />
            <span @click="send()" class="code">{{
              time === 0 ? "发送验证码" : `${time}秒后发送`
            }}</span>
          </div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <Field as="XtxCheck" name="isAgree" v-model="form.isAgree" />{{
            form.isAgree
          }}
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
      </div>
      <a @click="login" href="javascript:;" class="btn">登录</a>
    </Form>
    <div class="action">
      <a
        href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback"
      >
        <img
          src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png"
          alt=""
        />
      </a>

      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, reactive, watch } from 'vue'
import { Form, Field } from 'vee-validate';
import schema from '@/utils/vee-validate-schema'
import Message from '@/components/library/message'
import { userAccountLogin, userMobileLoginMsg } from '@/api/user'
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex'
import { useIntervalFn } from '@vueuse/core';
// import QC from 'qc'
export default {
  name: 'LoginForm',
  components: {
    Form, Field
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    // 是否短信登录
    const isMsgLogin = ref(false)
    // 表单信息对象
    const form = reactive({
      isAgree: true,
      account: null,
      password: null,
      mobile: null,
      code: null
    })
    // 校验规则对象
    const mySchema = {
      account: schema.account,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code,
      isAgree: schema.isAgree
    }
    // 重置表单
    const formCom = ref(null)
    watch(isMsgLogin, () => {
      // 还原数据
      form.isAgree = true
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
      // 补充校验效果清除，Form组件提供resetForm()
      formCom.value.resetForm()
    })
    const login = async () => {
      // 校验整体表单
      // Form组件提供的一个validate函数为整体表单校验，但是返回的是一个promise
      // 不是短信登录
      if (isMsgLogin.value) {
        // 手机号验证登录
        // 未输入手机号情况下要做一下判断
        // 点击发送验证码，获取接口发送过来的验证码，显示倒计时，如果倒计时为0时，可以再次点击发送

      } else {
        // 校验整体表单
        const valid = await formCom.value.validate()
        // console.log(valid)
        if (valid) {
          // 如果成功
          const { account, password } = form
          userAccountLogin({ account, password }).then(data => {
            // 存储信息
            const { id, account, mobile, token, nickname, avatar } = data.result
            store.commit('user/setUser', { id, account, mobile, token, nickname, avatar })
            Message({ type: 'success', text: '用户已成功登录' })
            // 合并购物车操作
            store.dispatch('cart/mergeLocalCart').then(() => {
              // 提示
              Message({ type: 'success', text: '绑定成功' })
              // 跳转
              router.push(route.query.redirectUrl || '/')
            })
          }).catch(e => {
            console.dir(e)
            Message({ type: 'error', text: e.response.data.message || '登录失败' })
          })
        }
      }

      // Message({ type: 'success', text: '用户已成功登录' })
    }
    const time = ref(0)
    const { pause, resume } = useIntervalFn(() => {
      time.value--
      if (time.value <= 0) {
        // 暂停
        pause()
      }
    }, 1000, false)

    const send = async () => {
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        // 如果发送成功
        if (time.value === 0) {
          await userMobileLoginMsg(form.mobile)
          Message({ type: 'success', text: '发送成功' })
          time.value = 60
          resume()
        }
      } else {
        // 失败，使用vee的错误函数显示错误信息 setFieldError(字段，错误信息)
        formCom.value.setFieldError('mobile', valid)
      }
    }
    // onMounted(() => {
    //   // 组件渲染完毕，使用 QC生成qq登录
    //   QC.Login({
    //     btnId: 'qqLoginBtn'
    //   })
    // })
    return { isMsgLogin, form, schema: mySchema, formCom, login, send, time }
  }
}
</script>
<style lang="less" scoped>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
