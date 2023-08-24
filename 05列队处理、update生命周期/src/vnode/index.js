import { nextTick } from "../utils/nextTick"

export function renderMixin(Vue) {

    Vue.prototype._c = function () { // 标签
        // 创建标签
        return createElement(...arguments)
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
function vnode(tag,data,key,children,text){
    return {
        tag,data,key,children,text
    }
}
// 创建元素
function createElement(tag,data={},...children){
    return vnode(tag,data,data.key,children)
}
// 创建文本
function createText(text){
    return vnode(undefined,undefined,undefined,undefined,text)
}

/**
 * vnode节点  只可描述节点 比ast要垃圾
 * {
 *  tag: 'div',
 *  children: []
 * }
 * 
 */