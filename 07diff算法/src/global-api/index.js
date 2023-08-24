import { mergeOptions } from '../utils/index'

export function initGlobApi(Vue) {
    // console.log(this);
    // 源码
    // { created:[a,b,c],watch:[a,b]}
    Vue.options = {}  // 全局变量
    Vue.Mixin = function (mixin) {
        //对象合并用的
        Vue.options = mergeOptions(Vue.options, mixin)   //this指向Vue  第一次this.options为
        console.log('Vue.options',Vue.options);
    }
} 