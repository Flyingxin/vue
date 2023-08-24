import { initMixin } from "./init";


function Vue(options){
    console.log(this);
    this._init(options)
}

//初始化配置项
initMixin(Vue)
export default Vue