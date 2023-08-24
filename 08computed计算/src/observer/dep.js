/**
 * 发布-订阅模式
 */

let id = 0
export class Dep {
  constructor() {
    this.id = id++
    this.subs = []   // 订阅subscribe
  }
  // 收集watcher（添加）
  depend() {
    // 希望watcher 可以存放dep  -----> 双向记忆

    // this.subs.push(Dep.target)
    Dep.target.addDep(this)
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  // 更新watcher
  notify() {
    this.subs.forEach(watcher => {
      watcher.update()
    })
  }
}
// 栈，处理多个watcher【除了渲染的（包括属性与watch）、还有computed的】，
// 所以用栈，渲染完一个watcher就删除一个watcher，以往是直接变[]
let stack = []  

Dep.target = null
// 添加watcher
export function pushTarget(watcher) {
  Dep.target = watcher

  stack.push(watcher) // 入栈 -> 渲染watcher 其他watcher
}
// 取消watcher
export function popTarget() {
  // Dep.target = null

  // 解析完watcher 就删除一个watcher
  stack.pop()
  Dep.target = stack[stack.length - 1]
}