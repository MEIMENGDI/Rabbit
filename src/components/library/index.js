// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，注意：没有全局过滤器
// import XtxSkeleton from './xtx-skeleton.vue'
// import XtxCarousel from './xtx-carousel.vue'
// import XtxMore from './xtx-more.vue'
import defaultImg from '@/assets/images/200.jpg'
import Message from './message'
// import XtxBread from './xtx-bread.vue'
// import XtxBreadItem from './xtx-bread-item'
// 这就是插件
// Vue2.0插件写法要素：导出一个对象，有install函数 ，默认传入了vue构造函数 ,vue基础之上扩展
// Vue3.0插件写法要素：导出一个对象，有install函数 ，默认传入了app构造函数,app基础之上扩展
// 批量导入组件
// 只需要一个函数，require.context(dir,deep,matching)
// 1.路径 2.是否加载子目录 3.符合的正则规则
const importFn = require.context('./', false, /\.vue$/)

export default {
  install (app) {
    // 在app上进行扩展，app提供component directive函数
    // 如果要挂载原型 app.config.globalProperties 方式
    // app.component(XtxSkeleton.name, XtxSkeleton)
    // app.component(XtxCarousel.name, XtxCarousel)
    // app.component(XtxMore.name, XtxMore)
    // app.component(XtxBread.name, XtxBread)
    // app.component(XtxBreadItem.name, XtxBreadItem)
    importFn.keys().forEach(key => {
      // 导入组件
      const component = importFn(key).default
      // 注册组件
      app.component(component.name, component)
    })
    defineDirective(app)
    // 如果你想挂载全局的属性，能够通过组件实例调用的属性   this.$message
    app.config.globalProperties.$message = Message // 原型函数
  }
}
const defineDirective = (app) => {
  // 图片懒加载指令
  app.directive('lazyload', {
    mounted (el, binding) {
      const observer = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          observer.unobserve(el)
          el.onerror = () => {
            el.src = defaultImg
          }
          el.src = binding.value
        }
      }, {
        threshold: 0.01
      })
      observer.observe(el)
    }
  })
}
