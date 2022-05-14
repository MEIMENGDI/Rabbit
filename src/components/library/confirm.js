// 1.导入组件
// 2.使用createVnode创建虚拟节点
// 3.使用一个dom容器装载组件
// 4.使用render渲染组件se'
import { createVNode, render } from 'vue'
import XtxConfirm from './xtx-confirm.vue'
// 准备一个dom
const div = document.createElement('div')
div.setAttribute('class', 'xtx-confirm-container')
document.body.appendChild(div)
// 该函数渲染XtxConfrim组件，标题和文本
// 函数返回值是promise
export default ({ title, text }) => {
  return new Promise((resolve, reject) => {
    const submitCallback = () => {
      render(null, div)
      resolve()
    }
    const cancelCallback = () => {
      render(null, div)
      reject(new Error('点击取消'))
    }
    const vn = createVNode(XtxConfirm, { title, text, submitCallback, cancelCallback })
    render(vn, div)
  })
}
