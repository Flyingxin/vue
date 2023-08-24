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

Dep.target = null
// 添加watcher
export function pushTarget(watcher) {
  Dep.target = watcher
}
// 取消watcher
export function popTarget() {
  Dep.target = null
}