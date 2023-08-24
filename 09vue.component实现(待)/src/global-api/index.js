import { mergeOptions } from '../utils/index'

export function initGlobApi(Vue) {
    // console.log(this);
    // { created:[a,b,c],watch:[a,b]}
    Vue.options = {}  // 全局变量
    Vue.Mixin = function (mixin) {
        //对象合并用的
        Vue.options = mergeOptions(this.options, mixin)   //this指向Vue  第一次this.options为
        console.log('Vue.options', Vue.options);
    }

    // 组件
    // 1 定义Vue.component方法
    Vue.options.components = {}
    Vue.component = function (id, componentDef) {
        // 组件名
        componentDef.name = componentDef.name || id
        // 核心 Vue创建组件的核心 Vue.extend()
        componentDef = this.extend(componentDef) // 返回一个实例
        this.options.components[id] = componentDef
        console.log('全局options',this.options);
        // return componentDef
    }
    // 核心 - 继承父组件属性
    Vue.extend = function (options) { // 全局传的
        let Super = this
        const Sub = function vueComponent(opts) { // 初始化用户写的方法, opts是子组件实例
            // 注意 new Sub().$mount()
            // 初始化
            console.log(opts);
            this._init(opts)
        }
        // 子组件继承父组件属性  类的继承
        Sub.prototype = Object.create(this.prototype)
        // 问题 子组件中this 的执行 -> 使得指向自己
        Sub.prototype.constructor = Sub
        // 将父组件中的属性合并到子组件中
        // console.log(this.options);
        // console.log(options);
        Sub.options = mergeOptions(this.options, options)
        console.log('组件options',Sub.options);
        return Sub // 函数
    }
} 