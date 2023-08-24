import { observer } from "./observer/index";
import { Watcher } from "./observer/watcher";


export function initState(vm) {
    let opts = vm.$options
    //判断是否初始化对应配置项
    opts.pros ? initProps(vm) : null
    opts.data ? initData(vm) : null
    opts.watch ? initWatch(vm) : null
    opts.computed ? initComputed(vm) : null
    opts.methods ? initMethods(vm) : null
}
export function stateMixin(vm) {
    vm.prototype.$watch = function (exprOrfn, handler, options = {}) {
        // 实现watch 就是 实例Watcher类   //user 用户的配置项,用来区分是否是watch属性，不是则是依赖收集
        let watcher = new Watcher(this, exprOrfn, handler, { ...options, user: true })
        // 初次渲染立即执行
        if (options.immediate) {
            watcher.run()
        }
    }
}
// 初始化配置项
function initProps() { }
function initWatch(vm) {

    // 获取watch
    let watch = vm.$options.watch
    // 遍历属性
    for (const key in watch) {
        // 判断字符串、函数、数组、对象格式
        let handler = watch[key] // 值
        // console.log(key, handler);

        if (Array.isArray(handler)) { //数组
            handler.forEach(item => {
                createWatcher(vm, key, handler)
            })
        } else {
            // 创建方法处理
            createWatcher(vm, key, handler)
        }
    }
}
function initComputed() { }
function initMethods() { }
function initData(vm) {
    // 对象形式、函数形式两种
    let data = vm.$options.data
    // call改变this指向（Windows -> Vue）
    data = vm._data = typeof data === "function" ? data.call(vm) : data

    // 数据劫持(劫持对象中分劫持简单数据类型、劫持数组) --> 添加响应式原理
    observer(data)

    // 数据代理到vm实例对象上
    for (const key in data) {
        proxy(vm, '_data', key)
    }
}

// 从_data中代理到vm实例上
function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key]
        },
        set(newValue) {
            vm[source][key] = newValue
        }
    })
}

// 格式化处理watch
function createWatcher(vm, exprOrfn, handler) {
    // 处理handler
    let options
    if (typeof handler === 'object') {
        options = handler   // 用户配置项
        handler = handler.handler   // 函数     
    }
    if (typeof handler === 'string') {
        handler = vm[handler]
    }
    // 其余均是函数、exprOrfn为函数 or 表达式
    // console.log(exprOrfn,handler,options);
    return vm.$watch(exprOrfn, handler, options)
}

