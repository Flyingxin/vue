import { observer } from "./observer/index";
export function initState(vm) {
    let opts = vm.$options
    //判断是否初始化对应配置项
    if (opts.props) {
        initProps(vm)
    }
    if (opts.data) {
        initData(vm)
    }
    if (opts.watch) {
        initWatch(vm)
    }
    if (opts.computed) {
        initComputed(vm)
    }
    if (opts.methods) {
        initMethods(vm)
    }
}

// 初始化配置项
function initProps() { }
function initWatch() { }
function initComputed() { }
function initMethods() { }
function initData(vm) {
    // 对象形式、函数形式两种
    let data = vm.$options.data
    // call改变this指向（Windows -> Vue）
    data = vm._data = typeof data === "function" ? data.call(vm): data 

    // 数据劫持(劫持对象中分劫持简单数据类型、劫持数组) --> 添加响应式原理
    observer(data)
    
    // 数据代理到vm实例对象上
    for (const key in data) {
        proxy(vm,'_data',key)
    }
}

// 从_data中代理到vm实例上
function proxy(vm,source,key){
    Object.defineProperty(vm,key,{
        get(){
            return vm[source][key]
        },
        set(newValue){
            vm[source][key] = newValue
        }
    })
}

