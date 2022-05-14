// 导入组件
// 将组件渲染为虚拟节点
// 把虚拟节点渲染在Dom中
// 为组件设置定时，三秒之后消失
// 1.
import { createVNode, render } from 'vue'
import XtxMessage from './xtx-message.vue'

const div = document.createElement('div')
div.setAttribute('class', 'XtxMessage-container')
document.body.appendChild(div)
// 定时器
let timer = null
// 2.
export default ({ type, text }) => {
  const vnode = createVNode(XtxMessage, { type, text })
  render(vnode, div)
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 3000)
}
