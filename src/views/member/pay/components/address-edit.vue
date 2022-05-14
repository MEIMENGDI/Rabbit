<template>
  <XtxDialog
    :title="formData.id ? '修改收获地址' : '添加收货地址'"
    v-model:visible="dialogVisible"
  >
    <div class="xtx-form">
      <div class="xtx-form-item">
        <div class="label">收货人：</div>
        <div class="field">
          <input
            class="input"
            v-model="formData.receiver"
            type="input"
            placeholder="请输入收货人"
          />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">手机号：</div>
        <div class="field">
          <input
            class="input"
            v-model="formData.contact"
            type="input"
            placeholder="请输入手机号"
          />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">地区</div>
        <div class="field">
          <XtxCity
            placeholder="请选择所在地区"
            :fullLocation="formData.fullLocation"
            @change="changeCity"
          />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">详细地址：</div>
        <div class="field">
          <input
            v-model="formData.address"
            class="input"
            placeholder="请输入详细地址"
          />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">邮政编码：</div>
        <div class="field">
          <input
            v-model="formData.postalCode"
            class="input"
            placeholder="请输入邮政编码"
          />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">地址标签：</div>
        <div class="field">
          <input
            v-model="formData.addressTags"
            class="input"
            placeholder="请输入地址标签，逗号分隔"
          />
        </div>
      </div>
    </div>
    <template v-slot:footer>
      <XtxButton
        @click="dialogVisible = false"
        type="gray"
        style="margin-right: 20px"
        >取消</XtxButton
      >
      <XtxButton @click="submit()" type="primary">确认</XtxButton>
    </template>
  </XtxDialog>
</template>
<script>
import { reactive, ref } from 'vue'
import XtxDialog from './xtx-dialog.vue'
import XtxCity from '@/components/library/xtx-city.vue'
import { addAddress, editAddress } from '@/api/order'
import Message from '@/components/library/xtx-message.vue'
export default {
  name: 'AddressEdit',
  components: {
    XtxDialog, XtxCity
  },
  setup (props, { emit }) {
    // 1.打开关闭表单
    const dialogVisible = ref(false)
    const open = (address) => {
      dialogVisible.value = true
      if (address.id) {
        // 如果是id，填充表单
        for (const key in address) {
          formData[key] = address[key]
        }
      } else {
        // 传入{}的时候就是清空，否则就是赋值
        for (const key in formData) {
          if (key === 'isDafault') {
            formData[key] = 1
          } else {
            formData[key] = []
          }
        }
      }
    }
    // 2.表单数据
    // 表单数据
    const formData = reactive({
      id: '',
      receiver: '',
      contact: '',
      provinceCode: '',
      cityCode: '',
      countyCode: '',
      address: '',
      postalCode: '',
      addressTags: '',
      isDefault: 1,
      fullLocation: null
    })
    // 3.选择地区
    const changeCity = (data) => {
      formData.provinceCode = data.provinceCode
      formData.cityCode = data.cityCode
      formData.countyCode = data.countyCode
      formData.fullLocation = data.fullLocation
    }
    // 4.提交操作
    const submit = () => {
      // 1.省略了校验
      // 2.发送请求
      if (formData.id) {
        editAddress(formData).then(data => {
          // 修改成功
          // Message({ type: 'success', text: '修改地址成功' })
          dialogVisible.value = false
          emit('on-success', formData)
        })
      } else {
        addAddress(formData).then(data => {
          // 添加成功
          Message({ type: 'success', text: '添加收获地址成功' })
          // formDate.id = data.result.id
          dialogVisible.value = false
          emit('on-success', formData)
        })
      }
    }
    return { dialogVisible, open, formData, changeCity, submit }
  }
}
</script>
<style lang="less" scoped>
.xtx-dialog {
  :deep(.wrapper) {
    width: 780px;
    .body {
      font-size: 14px;
    }
  }
}
.xtx-form {
  padding: 0;
  input {
    outline: none;
    &::placeholder {
      color: #ccc;
    }
  }
}
.xtx-city {
  width: 320px;
  :deep(.select) {
    height: 50px;
    line-height: 48px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    .placeholder {
      color: #ccc;
    }
    i {
      color: #ccc;
      font-size: 18px;
    }
    .value {
      font-size: 14px;
    }
  }
  :deep(.option) {
    top: 49px;
  }
}
</style>
