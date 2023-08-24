import Vue from 'vue'
// import VueRouter from 'vue-router'
import VueRouter from '../vue-router/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/components/my-home.vue'),
    children: [
      {
        path: 'a',
        name: 'About1',
        component: 'xxx1'
      },
      {
        path: 'b',
        name: 'About2',
        component: 'xxx2'
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/components/my-about.vue'),
    children: [
      {
        path: 'c',
        name: 'About3',
        component: 'xxx3'
      },
    ]
  },
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

router.beforeEach((from,to,next) =>{
  console.log(1);
  setTimeout(() => {
    next()
  }, 1000);
})
router.beforeEach((from,to,next) =>{
  console.log(2);
  setTimeout(() => {
    next()
  }, 1000);
})
export default router

/**
 * https://v3.router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E7%BB%84%E4%BB%B6%E5%86%85%E7%9A%84%E5%AE%88%E5%8D%AB
 * #完整的导航解析流程
      导航被触发。
      在失活的组件里调用 beforeRouteLeave 守卫。
      调用全局的 beforeEach 守卫。
      在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
      在路由配置里调用 beforeEnter。
      解析异步路由组件。
      在被激活的组件里调用 beforeRouteEnter。
      调用全局的 beforeResolve 守卫 (2.5+)。
      导航被确认。
      调用全局的 afterEach 钩子。
      触发 DOM 更新。
      调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传
 */