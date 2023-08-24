import { observer } from "./observer/index";
import { Watcher } from "./observer/watcher";
import { Dep } from "./observer/dep";

export function initState(vm) {
    let opts = vm.$options
    //判断是否初始化对应配置项
    opts.pros ? initProps(vm) : null
    opts.data ? initData(vm) : null
    opts.watch ? initWatch(vm) : null
    opts.computed ? initComputed(vm) : null
    opts.methods ? initMethods(vm) : null
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
function initComputed(vm) {
    let computed = vm.$options.computed
    console.log('computed',computed);
    // 1 需要一个watcher
    let watcher = vm._computedWatchers = {}
    // 2 将computed 属性通过defineProperty 进行处理
    for (const key in computed) {
        // 两种方式 方法、对象
        let userDef = computed[key]
        // 获取get
        let getter = typeof userDef == 'function' ? userDef : userDef.get
        // 给每个计算属性添加Watcher,并挂载到实例_computedWatchers上
        watcher[key] = new Watcher(vm,getter,()=>{},{lazy:true}) // lazy->不被使用，就不更新数据
        // 响应式、代理
        defineComputed(vm,key,userDef)
    }
}
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

// 定义$watch方法
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

// 格式化处理computed，并将属性代理到实例对象上vm
let sharepropDefinition = {}
function defineComputed(vm, key, userDef) { // userDef 是computed 属性值
    // console.log( key, userDef);
    sharepropDefinition = {
        enumerable: true,
        configurable: true,
        get: () => {},
        set: () => {},
    }
    if (typeof userDef == 'function') {
        // sharepropDefinition.get = userDef  // 没有缓存机制
        sharepropDefinition.get = createComputedGetter(key)  //缓存机制 -> 同一个属性只计算一次
    } else {
        // sharepropDefinition.get = userDef.get // 没有缓存机制
        sharepropDefinition.get = createComputedGetter(key)  // 注意：this指向变成了watcher
        sharepropDefinition.set = userDef.set
    }
    //  注意 get vm.xxx 
    Object.defineProperty(vm, key, sharepropDefinition)
}
// computed缓存机制
function createComputedGetter(key) { // 返回用户方法
    return function () {

        let watcher = this._computedWatchers[key]
        if (watcher) {
            if (watcher.dirty) { // 缓存【节流阀】
                // true 执行用户方法，重新计算，计算完关掉，需要时再打开计算、不需要时一直用缓存
                watcher.evaluate()  
            }
            // 判断一下有没有渲染的watcher， 有执行：相互存放watcher
            if (Dep.target) {  // 收集渲染watcher，让它再执行一次，渲染到页面上
                watcher.depend()
            }
            return watcher.oldVal
        } 
    }
}