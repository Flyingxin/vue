// 1 通过类 watcher实现更新
import { pushTarget, popTarget } from './dep'

let id = 0  // 判断每个watcher都是唯一的
export class Watcher {
  constructor(vm, updateComponent, cb, options){
    // 1  
    this.vm = vm
    this.exprOrfn = updateComponent
    this.cb = cb
    this.options = options
    this.id = id++
    //  判断
    if (typeof updateComponent === 'function') {
      this.getter = updateComponent  // 用来更新视图
    }
    // 更新视图
    this.get()
  }
  // 初次渲染
  get(){
    pushTarget(this)  // 给dep添加watcher
    this.getter() // 渲染页面
    popTarget()  // 给dep取消watcher
  }
  // 更新
  update(){
    this.getter()
  }

}


/**
 * 收集依赖 vue dep watcher data:{name,msg}
 * dep: dep 和data中的属性一一对应的              一个组件对应一个deo实例对象
 * watcher: 在视图上用几个，就有几个watcher
 * deo 与 watcher： 一对多  dep.name = [w1,w2]    一个实例对象dep对应多个wathcer实例对象（一个属性一个wathcer对象）
 */