// 1 通过类 watcher实现更新
import { pushTarget, popTarget } from './dep'
import { nextTick } from "../utils/nextTick";
// import { callHook } from '../lifecycle';/

let id = 0  // 判断每个watcher都是唯一的
export class Watcher {
  constructor(vm, updateComponent, cb, options) {
    // 1  
    this.vm = vm
    this.exprOrfn = updateComponent
    this.cb = cb
    this.options = options
    this.id = id++

    this.deps = []
    this.despId = new Set()

    // watch配置项
    this.user = !!options.user // 代表改watcher为watch

    // computed配置项
    this.lazy = options.lazy  // 代表改watcher为computed
    this.dirty = this.lazy // 取值的时候，表示用户执行

    //  判断
    if (typeof updateComponent === 'function') {
      this.getter = updateComponent  // 用来更新DOM视图
    } else { // watch监听

      this.getter = function () {
        // 做深层属性监测处理  'obj.four.a' -> [obj,four,a]
        let path = this.exprOrfn.split('.')
        let value = vm
        for (let i = 0; i < path.length; i++) {
          value = value[ path[ i ] ]
          // console.log(`watch -> ${this.exprOrfn}：`, value);
        }
        return value
      }
    }
    // 更新视图 / watch中就是获取初始值 / lazy为computed是否执行函数
    this.oldVal = this.lazy ? void 0 : this.get()
  }
  addDep(dep) {
    let id = dep.id
    if (!this.despId.has(id)) {
      this.deps.push(dep)
      this.despId.add(id)
      dep.addSub(this)  // this执行watcher
    }
  }
  // 初次渲染
  get() {
    pushTarget(this) 
    const oldVal = this.getter.call(this.vm) // 让computed属性指向vm实例
    popTarget()
    // console.log('初次渲染',this);
    return oldVal
  }
  // 缓存
  update() {

    // callHook(this.vm, 'beforeUpdate')

    // 所以引入队列处理（缓存更新dom）watch
    // queueWatcher(this)

    // computed 计算属性
    this.lazy ? this.dirty = true : queueWatcher(this)
  }
  // 更新DOM
  run() {
    let newVal = this.get() // newVal
    let oldVal = this.oldVal // oldVal
    this.oldVal = newVal
    // 执行handler（cb）这个用户的watcher
    if (this.user) {
      this.cb.call(this.vm, newVal,oldVal)
    }
  }
  // computed的
  evaluate() {
    this.oldVal = this.get()
    this.dirty = false
  }
  // computed的
  depend() {
    // 收集watcher 存放到dep中 dep会存放到对应watcher
    // 通过这个watcher 找到对应所有dep，再让所有dep都记住这个渲染的watcher 
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }
}

// 队列处理（缓存更新dom）
let queue = []
let has = {}
let pending = false
function queueWatcher(watcher) {
  let id = watcher.id

  if (!has[id]) { // 若不存在
    queue.push(watcher)
    has[id] = true

    // 防抖: 连续触发的事件，只触发一次
    if (!pending) {

      nextTick(flushWatcher)
    }
    pending = true
  }
}
// 更新一次dom，刷新
function flushWatcher() {
  queue.forEach(watcher => watcher.run())
  queue = []
  has = {}
  pending = false
}