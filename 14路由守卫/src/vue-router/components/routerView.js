// 函数式组件
export default {
  functional: true,   // 不是function!!!
  render(h, { parent, data }) { // 1 h 、2 属性
    // 1 获取到组件
    let route = parent.$route
    console.log(route);
    // 2 解决嵌套路由问题 /about/a
    data.routerView = true
    let depath = 0
    while (parent) {
      // $vnode 相当于一个占位符
      if (parent.$vnode && parent.$vnode.data.routeView) {
        depath++
      }
      parent = parent.$parent  // 逐级查找
    }
    let recode = route.matched[0].matched[depath]
    // console.log(route);
    // console.log(recode);
    if (!recode) {
      return h()  //空
    }
    return h(recode.component, data)
  }

}