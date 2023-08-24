import { nextTick } from "../utils/nextTick"

export function renderMixin(Vue) {

    Vue.prototype._c = function () { // 标签
        // 创建标签
        return createElement(this, ...arguments)
    }
    Vue.prototype._v = function (text) { // 文本
        return createText(text)
        // return vnode(undefined,undefined,undefined,undefined,text)
    }
    Vue.prototype._s = function (val) { // 插值变量
        return val == null ? "" : (typeof val === 'object') ? JSON.stringify(val) : val
    }
    // render函数渲染成 vnode
    Vue.prototype._render = function () {
        let vm = this
        let render = vm.$options.render
        // console.log(render,this);
        let vnode = render.call(this)  //指向vm 【是with语句中的this】
        // console.log(vnode);  // 得到虚拟dom ! ! !
        return vnode
    }
    // 列队处理（异步，统一更新Watcher） -> 缓存
    Vue.prototype.$nextTick = function (cb) {
        nextTick(cb)
    }
}
// 生成vnode格式
function vnode(vm, tag, data, key, children, text, componentOptions) {
    return {
        vm, tag, data, key, children, text, componentOptions
    }
}
// 创建元素
function createElement(vm, tag, data = {}, ...children) {

    if (isResved(tag)) { // 标签
        return vnode(vm, tag, data, data.key, children)
    } else { // 组件渲染
        // 创建组件 在实例vm中
        const Ctor = vm.$options['components'][tag] // 获取到组件自己本身
        // console.log (Ctor);
        return createComponent(vm, tag, data, children, Ctor)
    }
}
// 是否是标签
function isResved(tag) {
    return ['a', 'div', 'h', 'button', 'span', 'input'].includes(tag)
}
// 创建组件vnode
function createComponent(vm, tag, data, children, Ctor) {
    if (typeof Ctor == 'object') {
        Ctor = vm.constructor.extend(Ctor)
        // console.log(Ctor);
    }
    // 添加一个方法 hooks
    // console.log(vm,tag,data,children,Ctor);
    data.hook = {
        init(vnode) { // 组件初始化
            console.log(vnode);
            let child = vnode.componentInstance = new vnode.componentOptions.Ctor({})
            child.$mounted() // $el
        }
    }
    return vnode(vm, tag, data, undefined, undefined, undefined, { Ctor, children })
}
// 创建文本
function createText(text) {
    return vnode(undefined, undefined, undefined, undefined, undefined, text)
}

/**
 * vnode节点  只可描述节点 比ast要垃圾
 * {
 *  tag: 'div',
 *  children: []
 * }
 * 
 */