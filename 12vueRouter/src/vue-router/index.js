import routerLink from './components/routerLink'
import routerView from './components/routerLink'
import { createMatch } from './createMatch'  //匹配器
import { HtmlHistory } from './history/html5'
import { HashHistory } from './history/hash'

let Vue
export default class VueRouter {
  constructor(options = {}) {
    console.log('options', options);

    // vue-router 核心1 -> match
    this.match = createMatch(options.routes || [])
    console.log('match', this.match);
    // 核心2 -> 浏览器路由管理
    // 1 获取模式
    options.mode = options.mode || 'hash'
    switch (options.mode) {
      case 'hash':
        this.history = new HashHistory(this)
        break;
      case 'history':
        this.history = new HtmlHistory(this)
        break;
    }
    console.log('history', this.history);
  }

  push(location) { //跳转
    this.history.transitionTo(location)
  }

  // 根据路由找到组件 并跳转
  init(app) {
    console.log('init', app);

    // 1 获取到当前的路由
    const history = this.history
    // 2 跳转-监听
    history.transitionTo(
      history.getCurrentLocation(), // 1 当前的路由 
      history.setUpLister() // 2 监听路由的变化
    )
  }
}

VueRouter.install = (_Vue) => {
  Vue = _Vue
  // console.log(Vue);

  // 定义全局组件
  Vue.component('router-link', routerLink)
  Vue.component('router-view', routerView)


  // 实现给每个组件添加router实例 【父子渲染关系】
  Vue.mixin({
    beforeCreate() {
      // console.log(this);
      if (this.$options.router) { // 根实例
        this._routerRoot = this  // 将vue实例存到_routerRoot
        this._router = this.$options.router // 将router实例放到vue实例上
        this._router.init(this) // 初始化初次加载时的路由
        // 变成响应式(Vue的扩展方法) 、 this._router.history.current -> 当前路由
        // Vue.util.defineReactive(this, '_router', this._router.history.current)
        console.log(this);
      } else {
        this._router = this.$parent && this.$parent._router
      }
    }
  })
  // 代理 this.$route属性 this.$router方法
  Object.defineProperty(Vue.prototype, '$router', {
    get() {
      console.log(this);
      return this._router
    }
  })
  Object.defineProperty(Vue.prototype, '$route', {
    get() {
      return this._route
    }
  })

}