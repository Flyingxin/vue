import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./vnode/index";
import { initGlobApi } from "./global-api/index";

function Vue(options){
    // console.log(this);
    this._init(options)
}

//初始化配置项
initMixin(Vue)
// 添加生命周期
lifecycleMixin(Vue)
// 添加_render
renderMixin(Vue)
// 创建全局方法  如：Vue.Mixin Vue.component Vue.extend
initGlobApi(Vue)


export default Vue