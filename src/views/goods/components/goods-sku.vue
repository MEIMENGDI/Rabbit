<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img
            :class="{ selected: val.selected, disabled: val.disabled }"
            @click="changeSku(item, val)"
            v-if="val.picture"
            :src="val.picture"
            :title="val.name"
            alt=""
          />
          <span
            :class="{ selected: val.selected, disabled: val.disabled }"
            @click="changeSku(item, val)"
            v-else
            >{{ val.name }}</span
          >
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import getPowerSet from '@/vender/power-set'
const spliter = '★'
// 得到一个路径字典对象
const getPathMap = (skus) => {
  const pathMap = {}
  // 1.得到所有的sku 集合 props.goods.skus
  // 2.从所有的sku中筛选出有效的sku
  // 3.根据有效的sku使用power-set算法得到子集
  // 4.根据子集往路径字典对象中存储 key-value
  skus.forEach(sku => {
    // 1.过滤有库存的
    if (sku.inventory > 0) {
      // 2.计算当前有库存sku的子集
      // 例如：[1,2,3]==> [[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]
      // 3.可选值数组
      const valueArr = sku.specs.map(val => val.valueName)
      // console.log(valueArr)
      //  可选数组 子集
      const valueArrPowerSet = getPowerSet(valueArr)
      // console.log(valueArrPowerSet)
      // 4.设置给路径字典对象
      valueArrPowerSet.forEach(set => {
        const key = set.join(spliter)
        // console.log(key)
        if (pathMap[key]) {
          // 已经有key往数组追加
          pathMap[key].push(sku.id)
        } else {
          // 没有key设置一个数组
          pathMap[key] = [sku.id]
          // console.log(pathMap[key])
        }
      })
    }
  })
  return pathMap
}
// 得到当前选中的规格集合
const getSelectedArr = (specs) => {
  const selectedArr = []
  specs.forEach(spec => {
    const selectedVal = spec.values.find(val => val.selected)
    selectedArr.push(selectedVal ? selectedVal.name : undefined)
  })
  return selectedArr
}
// 更新按钮的禁用状态
const updateDisabledStatus = (specs, pathMap) => {
  specs.forEach((spec, i) => {
    const selectedArr = getSelectedArr(specs)
    spec.values.forEach(val => {
      // 已经选中的不用判断
      if (val.name === selectedArr[i]) return false
      // 未选中的替换对应的值
      selectedArr[i] = val.name
      // 过滤无效值得到key
      const key = selectedArr.filter(v => v).join(spliter)
      // console.log(key)
      // console.log(pathMap[key])
      // 设置禁用状态
      val.disabled = !pathMap[key]
    })
  })
}
// 初始化选中状态
const initSelectedStatus = (goods, skuId) => {
  // 默认选中
  // 1.找出sku的信息
  // 2.遍历每一个按钮，按钮的值和sku记录的值相同时，就选中
  const sku = goods.skus.find(sku => sku.id === skuId)
  goods.specs.forEach((spec, i) => {
    const val = spec.values.find(val => val.name === sku.specs[i].valueName)
    val.selected = true
  })
}
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({ specs: [], skus: [] })
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const pathMap = getPathMap(props.goods.skus)
    if (props.skuId) {
      initSelectedStatus(props.goods, props.skuId)
    }
    // console.log('map----' + pathMap)
    updateDisabledStatus(props.goods.specs, pathMap)
    // 1.约定每一个按钮都有自己的选中状态数据
    // 2.点击当前按钮 ,点击选中，再次点击取消
    // 3.在当前规格中选中过按钮，再选择未选中的按钮，把同一规格的按钮改成未选中，选中当前按钮
    const changeSku = (item, val) => {
      // 如果是禁用状态不作为
      if (val.disabled) return false
      if (val.selected) {
        val.selected = false
      } else {
        item.values.forEach(valItem => {
          valItem.selected = false
        })
        val.selected = true
      }
      // 点击的时候更新禁用状态
      updateDisabledStatus(props.goods.specs, pathMap)
      // 触发change事件将sku数据传递出去
      // 都选中的话传递数据 未选中传递空对象
      const selectedArr = getSelectedArr(props.goods.specs).filter(v => v)
      if (selectedArr.length === props.goods.specs.length) {
        // 数据完整
        const skuIds = pathMap[selectedArr.join(spliter)]
        // console.log(skuIds)
        const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          // 属性名：属性值 属性名1：属性值1 去除掉首尾的空字符串
          specsText: sku.specs.reduce((p, c) => `${p} ${c.name}:${c.valueName}`, '').trim()
        })
        // console.log(sku.specs.reduce((p, c) => `${p} ${c.name}:${c.valueName}`, ''))
      } else {
        emit('change', {})
      }
    }

    return { changeSku }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        border: 1px solid #e4e4e4;
        margin-right: 10px;
        margin-top: 10px;
        cursor: pointer;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
