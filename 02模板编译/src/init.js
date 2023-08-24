import { initState } from "./initState";
import { compileToFunciton } from "./compiler/index";
import { mountComponent } from "./lifecycle";

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        let vm = this // 指向Vue实例对象
        vm.$options = options
        // console.log('枚举配置项：',vm.$options);

        //初始化状态
        initState(vm)

        // 渲染模板 el
        if (vm.$options.el) {
            vm.$mounted(vm.$options.el)
        }
    }

    // 创建$mounted
    Vue.prototype.$mounted = function(el) {

        // 先寻render 再寻template ，都没有再寻el的outerHTML
        let vm = this
        el = document.querySelector(el)
        // 旧dom挂到实例对象上，方便diff对比更新
        vm.$el = el 
        let options = vm.$options

        if (!options.render) { // 没有render
            let template = options.template
            if (!template && el) { // 没有template 有el
                el = el.outerHTML 
                // console.log(el); 

                // render函数【html字符串 -> ast -> 模板编译字符串 -> render函数 】
                // render是函数  render()是调用函数 -> 会生成对应组件的vnode
                let render = compileToFunciton(el)
                // console.log('render',render);

                // render函数暴露在实例对象上
                vm.$options.render = render
            }
        }
        // 挂载组件
        mountComponent(vm,el)
    }
}

