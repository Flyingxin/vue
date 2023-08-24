import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./vnode/index";


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
export default Vue