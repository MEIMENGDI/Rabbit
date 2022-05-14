// import store from '@/store'
import { h } from 'vue'
import { createRouter, createWebHashHistory, RouterView } from 'vue-router'
const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home/index')
const TopCategory = () => import('@/views/category/index')
const SubCategory = () => import('@/views/category/sub')
const Goods = () => import('@/views/goods/index')
const Login = () => import('@/views/login/index')
const LoginCallback = () => import('@/views/login/callback')
const Cart = () => import('@/views/cart/index')
const PayCheckout = () => import('@/views/member/pay/checkout')
const PayIndex = () => import('@/views/member/pay/index')
const MemberLayout = () => import('@/views/member/Layout')
const MemberHome = () => import('@/views/member/home/index')
const MemberOrder = () => import('@/views/member/order')
const MemberOrderDetail = () => import('@/views/member/order/detail')
const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        component: Home
      },
      {
        path: '/category/:id',
        component: TopCategory
      },
      {
        path: '/category/sub/:id',
        component: SubCategory
      },
      {
        path: '/product/:id',
        component: Goods
      },
      {
        path: '/cart',
        component: Cart
      },
      { path: '/member/checkout', component: PayCheckout },
      { path: '/member/pay', component: PayIndex },
      {
        path: '/member',
        component: MemberLayout,
        children: [
          { path: '/member', component: MemberHome },
          {
            path: '/member/order',
            component: { render: () => h(<RouterView />) },
            children: [
              { path: '', component: MemberOrder },
              { path: ':id', component: MemberOrderDetail }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/Login',
    component: Login
  },
  {
    path: '/Login/callback',
    component: LoginCallback
  }
]
const router = createRouter({
  // 使用hash的路由模式
  history: createWebHashHistory(),
  routes,
  scrollBehavior () {
    return { left: 0, top: 0 }
  }
})
// router.beforeEach((to, from, next) => {
//   // 用户信息
//   const { token } = store.state.user.profile
//   // 跳转去member开头的地址却没有登录
//   if (to.path.startsWith('/member') && !token) {
//     next({ path: '/login', query: { redirectUrl: to.fullPath } })
//   }
// })
export default router
