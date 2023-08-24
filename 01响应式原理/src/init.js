import { initState } from "./initState";

export function initMixin(Vue){
    Vue.prototype._init = function(options){
        let vm = this // 指向Vue实例对象
        vm.$options = options
        // console.log('枚举配置项：',vm.$options);

        //初始化状态
        initState(vm)
    }
}

