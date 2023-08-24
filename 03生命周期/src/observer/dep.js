import { watch } from "rollup"

export class Dep {
  constructor(){
    this.subs = []
  }
  // 收集watcher
  depend(){
    this.subs.push(Dep.target)
  }
  // 更新watcher
  notify(){
    this.subs.forEach( watcher => {
      watcher.update()
    })
  }
}
// 添加watcher
Dep.target = null
export function pushTarget(watcher){
  Dep.target = watcher
}
// 取消watcher
Dep.target = null
export function popTarget(){
  Dep.target = null
}