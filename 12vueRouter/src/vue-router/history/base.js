import { createRouteRecord } from "../createRouterMap";

// 公共方法
export class History {
  constructor(router){
    this.router = router.match
    this.current = createRouteRecord(null,{path:'/home'})  // 保存当前最新的路由记录
    console.log('History',this);  

  }
  // 跳转对应路由
  transitionTo(location,cb){
    let router = this.router.match(location)  //获取对应路由
    console.log('跳转到最新路由地址',router);
    // 渲染数据 问题： 数据改变，视图也要改个 -> 响应式
    this.current = createRouteRecord(router,{path:location})
    // 执行函数
    cb && cb()
  }
}

