// 1 通过类 watcher实现更新
import { pushTarget, popTarget } from './dep'

let id = 0  // 判断每个watcher都是唯一的
export class Watcher {
  constructor(vm, updateComponent, cb, options) {
    // 1  
    this.vm = vm
    this.exprOrfn = updateComponent
    this.cb = cb
    this.options = options
    this.id = id++

    this.deps = []  // watcher存放dep
    this.despId = new Set()  //用来更新视图

    //  判断
    if (typeof updateComponent === 'function') {
      this.getter = updateComponent  // 用来更新视图
    }
    // 更新视图
    this.get()
  }
  addDep(dep) {
    let id = dep.id
    if (!this.despId.has(id)) {
      this.deps.push(dep)
      this.despId.add(id)
      dep.addSub(this)
    }
  }
  // 初次渲染
  get() {
    pushTarget(this)  // this指向Watcher实例对象，给dep添加watcher
    this.getter() // 渲染页面 vm._update(vm._render()) 
    popTarget()  // 给dep取消watcher
    // console.log('初次渲染',this);
  }
  // 缓存
  update() {

    // 由于每改变一个属性数据，就会通知来这渲染新dom，造成性能问题
    this.getter()
  }
}

/**
 * 
 * 收集依赖 vue dep watcher data:{name,msg}
 * dep: dep 和data中的属性一一对应的              一个属性对应一个dep实例对象
 * watcher: 在视图上用几个，就有几个watcher    
 * dep 和 watcher 多对多的关系：
 *  每个组件都对应一个 watcher，每个响应式属性都有一个 dep 收集器。
 *  一个组件可以包含多个属性（一个 watcher 对应多个 dep），一个属性可以被多个组件使用（一个 dep 对应多个 watcher）
 */

/**
 * 
 * dep负责收集   watcher负责更新视图
 * dep 和data中的属性一一对应的       视图上有几个需要更新的变量就会有几个watcher
 * 将watcher推进subs里面，for循环一次性更新
 */
