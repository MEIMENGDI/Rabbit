<template>
  <div class="xtx-city">
    <div class="select" :class="{ active: visible }" @click="toggleDialog()">
      <span v-if="!fullLocation" class="placeholder">{{ placeholder }}</span>
      <!-- <span v-if="!fullName" class="placeholder">{{ placeholder }}</span> -->
      <span v-else class="value">{{ fullLocation }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div ref="target" class="option" v-show="visible">
      <div class="loading" v-if="loading"></div>
      <template v-else>
        <span
          @click="changeItem(item)"
          class="ellipsis"
          v-for="item in currList"
          :key="item.code"
          >{{ item.name }}</span
        >
      </template>
    </div>
  </div>
</template>
<script>
import { computed, reactive, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择配送地址'
    },
    fullName: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    // 获取城市数据
    // 数据在哪里
    // 如何获取 打开城市列表的时候，做个内存中缓存
    // 怎么使用 定义计算属性，根据点击的省份城市
    const getCityData = () => {
      return new Promise((resolve, reject) => {
        if (window.cityData) {
          // 有缓存
          resolve(window.cityData)
        } else {
          const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
          axios.get(url).then(res => {
            window.cityData = res.data
            resolve(window.cityData)
          })
        }
      })
    }
    // 控制展开隐藏
    const visible = ref(false)
    const loading = ref(false)
    const cityData = ref({})
    const openDialog = () => {
      visible.value = true
      loading.value = true
      // 获取城市数据，显示当前地方列表
      getCityData().then(res => {
        // console.log(res.data)
        cityData.value = res
        // console.log(cityData.value)
        loading.value = false
      }).catch(e => {
        console.log(e)
      })
      // 清空选择结果
      for (const key of changeResult) {
        changeResult[key] = ''
      }
    }
    const closeDialog = () => {
      visible.value = false
    }
    const toggleDialog = () => {
      console.log('点击选择地址')
      console.log(visible.value)
      if (visible.value) closeDialog()
      openDialog()
    }
    // 点击其他位置隐藏
    const target = ref(null)
    onClickOutside(target, () => {
      closeDialog()
    })
    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: ''
    })
    //  定义计算属性
    const currList = computed(() => {
      // 省份
      let currList = cityData.value
      // 根据点击的省份城市获取对应的列表
      // 市
      if (changeResult.provinceCode) {
        currList = currList.find(p => p.code === changeResult.provinceCode).areaList
      }
      if (changeResult.cityCode) {
        currList = currList.find(c => c.code === changeResult.cityCode).areaList
      }
      return currList
    })
    const changeItem = (item) => {
      // 省份
      if (item.level === 0) {
        changeResult.provinceCode = item.code
        changeResult.provinceName = item.name
      }
      // 市
      if (item.level === 1) {
        changeResult.cityCode = item.code
        changeResult.cityName = item.name
      }
      if (item.level === 2) {
        changeResult.countyCode = item.code
        changeResult.countyName = item.name
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
        closeDialog()
        emit('change', changeResult)
      }
    }
    return {
      toggleDialog, changeItem, target, cityData, loading, currList, visible
    }
  }
}
</script>
<style lang='less' scoped>
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/200.jpg) no-repeat center;
    }
  }
}
</style>
