import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./vnode/index";
import { initGlobApi } from "./global-api/index";
import { stateMixin } from "./initState";

import { compileToFunciton } from "./compiler/index";
import { patch, createEl } from "./vnode/patch";
function Vue(options) {
    // console.log(this);
    this._init(options)
}

//初始化配置项
initMixin(Vue)
// 添加生命周期
lifecycleMixin(Vue)
// 添加_render
renderMixin(Vue)
// 
stateMixin(Vue)

// 创建全局方法  如：Vue.Mixin Vue.component Vue.extend
initGlobApi(Vue)

/**测试 */
let vm1 = new Vue({ data: { name: '张三' } })
// let render1 = compileToFunciton(`<div id="app" class="box" style="font-size: 14px;color:red;">{{name}}<div>1</div></div>`)
let render1 = compileToFunciton(
    `<div>
        <h2 style="background:black" key="a">a</h2>
        <h2 style="background:pink" key="b">b</h2>
        <h2 style="background:green" key="c">c</h2>
    </div>`)
let vnode1 = render1.call(vm1)
document.body.appendChild(createEl(vnode1))

let vm2 = new Vue({ data: { name: '张三' } })
// let render2 = compileToFunciton(`<div class="box" style="color:red;">{{name}}<div>1</div></div>`)
let render2 = compileToFunciton(
    `<div>{{name}}
        <h2 style="background:red" key="d">d</h2>
        <h2 style="background:blue" key="a">a</h2>
        <h2 style="background:gray" key="b">b</h2>
    </div>`)
let vnode2 = render2.call(vm2)

setTimeout(() => {
    patch(vnode1, vnode2)
}, 1000)
console.log(vnode1, vnode2);

export default Vue

/**
 * 补充：生产vnode过程 -> html字符串 -> ast语法树 -> 模板字符串 -> render函数 -> vnode 【执行render函数】
 *       ast与vnode区别：形式相似，但vnode可以更好的跨端执行，例如小程序端等等
 *          
 * 
 * diff算法比对
 * 
 * patch函数 -> 比对旧与新的vnode，然后对需要更新的属性、文本、标签进行局部更新 -> 避免直接操作大量DOM造成性能问题
 * 1 初次渲染 直接按vnode创建真实DOM
 * 
 * 2 此后渲染，需要比对 三步走 -> 标签 、 属性 、 文本子节点
 * 
 * 2.1 标签比对
 * 2.2 属性比对
 * 2.3 子元素 --> diff算法（首尾指针法 -> 新旧vnode各俩个）
    * 2.3.1 首部比对
    * 2.3.2 尾部比对
    * 2.3.3 首尾比对
    * 2.3.4 尾首比对
    * 2.3.5 暴力比对【通过创建旧vnode映射表进行key比对】 -> 递归patch方法比对
 * 
 * 3 暴力比对： 全程指针执行操作
    * 3.1 遍历旧vnode，将索引值赋值给key
    * 3.2 新旧vnode比对key，比对成功-> 将旧vnode插入旧的真实dom前面 -> 移动新vnode开始指针 
    *                          失败-> 将创建指vnode的真实dom 插入旧的真实dom前面 -> 移动新vnode开始指针 
 * **/