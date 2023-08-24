
// 根据vnode创建真实DOM
export function patch(oldNode, vnode) {

    // 1 vnode -> 真实dom
    let el = createEl(vnode)
    // console.log('createEl方法渲染成真实dom',el);

    // 2 替换   ① 获取父节点 ②插入  ③删除
    let parentEL = oldNode.parentNode  // body节点
    parentEL.insertBefore(el, oldNode.nextsibling)
    parentEL.removeChild(oldNode)

    return el
}
// 递归创建dom
function createEl(vnode) {
    let { tag, children, data, key, text } = vnode

    if (typeof tag == 'string') { //标签
        vnode.el = document.createElement(tag)   // 创建元素
        // 子节点
        if (children.length > 0) {
            children.forEach(child => {

                vnode.el.appendChild(createEl(child))  //递归创建子节点
                // console.log(vnode.el.nodeType);
                // console.log('vnode.el',vnode.el);
            });
        }
    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el   // 记得返回值啊啊啊啊啊！！！！
}


