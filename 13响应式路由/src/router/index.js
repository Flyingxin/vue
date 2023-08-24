import Vue from 'vue'
// import VueRouter from 'vue-router'
import VueRouter from '../vue-router/index'

Vue.use(VueRouter)

const routes =[
  {
    path: '/home',
    name: 'Home',
    component: ()=> import('@/components/my-home.vue'),
    children:[
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
    component: ()=> import('@/components/my-about.vue'),
    children:[
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
export default router