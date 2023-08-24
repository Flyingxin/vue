import { patch } from './vnode/patch'
import { Watcher } from './observer/watcher'

export function mountComponent(vm, el) {

    callHook(vm,'beforeMount')

    // 1 vm._render()生成虚拟dom
    // 2 vm._update将vnode变成真实dom放到页面
    // vm._update(vm._render())
    let updateComponent = () => {
        vm._update(vm._render())
    }
    new Watcher(vm, updateComponent, ()=>{
        callHook(vm,'updated')
    },true)  // true/false表示watcher是否渲染

    callHook(vm,'mounted')

}

export function lifecycleMixin(Vue) {
    //原型链注册update方法
    Vue.prototype._update = function (vnode) {

        let vm = this
        vm.$el = patch(vm.$el, vnode) //  更新DOM（旧DOM参数 新DOM参数）
        // console.log('vnode',vnode);
    }
}

// 生命周期 -订阅发布模式
// 即已经订阅好了，要用生命周期调用就行了
export function callHook(vm,hook){
    const handlers = vm.$options[hook]
    if (handlers) {
        for (let i = 0; i < handlers.length; i++) {
            handlers[i].call(vm)  // 改变生命周期this指向，指向vm实例对象
        }
    }
}