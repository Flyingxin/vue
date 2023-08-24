import { patch } from './vnode/patch'

export function mountComponent(vm, el) {

    // 1 vm._render()生成虚拟dom
    // 2 vm._update将vnode变成真实dom放到页面
    vm._update(vm._render())

}

export function lifecycleMixin(Vue) {
    //原型链注册update方法
    Vue.prototype._update = function (vnode) {

        let vm = this
        vm.$el = patch(vm.$el, vnode) //  更新DOM（旧DOM参数 新DOM参数）
        // console.log(vnode);
    }
}