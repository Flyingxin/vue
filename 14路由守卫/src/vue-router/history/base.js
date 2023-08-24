import { createRouteRecord } from "../createRouterMap";

// 公共方法
export class History {
  constructor(router) {
    this.router = router.match
    this.beforeHooks = router.beforeHooks
    this.current = createRouteRecord(null, { path: '/home' })  // 保存当前最新的路由记录
    console.log('History', router);
  }
  // 跳转对应路由
  transitionTo(location, cb) {
    let router = this.router.match(location)  //获取对应路由
    console.log('获取到最新路由地址', router);
    // 渲染数据 问题： 数据改变，视图也要改个 -> 响应式
    this.current = createRouteRecord(router, { path: location })

    // 获取全局守卫队列
    let queue = [].concat(this.beforeHooks)  // queue是全局守卫自定义函数形成的队列
    console.log('全局守卫队列', queue);
    // 执行队列
    const iterator = (hook, next) => {
      // 当前的
      hook(this.current, router, () => {
        next()
      })
    }
    runQueue(queue, iterator, () => {
      // 更新路由
      this.cb && this.cb(this.current)
      cb && cb() // 执行函数
    })

  }
  push(location) {
    this.transitionTo(location, () => {
      window.location.hash = location
    })
  }
  listen(cb) {
    this.cb = cb
  }

}
// 执行全局守卫队列
function runQueue(queue, iterator, cb) {
  // 异步执行
  function setp(index) {
    if (index >= queue.length) return cb()

    let hook = queue[index]
    iterator(hook, () => setp(index + 1))
  }
  setp(0)
}
