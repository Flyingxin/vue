
// 根据vnode创建真实DOM
export function patch(oldNode, vnode) {

    // 初次渲染
    if (oldNode.nodeType === 1) {
        // 1 vnode -> 真实dom
        // console.log(vnode);
        let el = createEl(vnode)
        // console.log(el);
        // console.log('createEl方法渲染成真实dom',el);

        // 2 替换   ① 获取父节点 ②插入  ③删除
        let parentEL = oldNode.parentNode  // body节点
        parentEL.insertBefore(el, oldNode.nextsibling)
        parentEL.removeChild(oldNode)

        return el
    } else {
        // 1 标签不一样
        if (oldNode.tag !== vnode.tag) {
            // console.log(`标签不一样 ${oldNode.tag} -> ${vnode.tag}`);
            return oldNode.el.parentNode.replaceChild(createEl(vnode), oldNode.el)
        }
        // 2 标签一样
        if (oldNode.tag) { // 老标签存在
            // console.log(`标签一样 ${oldNode.tag} `);
            if (oldNode.text !== vnode.text) {
                return oldNode.el.textContent = vnode.text
            }
            // if (oldNode.children.length == 0 && vnode.children.length == 0) {
            //     console.log('文本一样【 不含子节点 】');
            // } else if (oldNode.children.length == 0) {
            //     console.log('新增文本【 不含子节点 】');
            //     return oldNode.el.textContent = vnode.children[0].text
            // } else if (vnode.children.length == 0) {
            //     console.log('删除文本【 不含子节点 】');
            //     return oldNode.el.textContent = null
            // } else {
            //     console.log('更新文本【 不含子节点 】');
            //     return oldNode.el.textContent = vnode.children[0].text
            // }
        }
        // 2.1属性
        let el = vnode.el = oldNode.el
        updateAttr(vnode, oldNode.data)

        // 3 diff子元素
        let oldChildren = oldNode.children || []
        let newChildren = vnode.children || []
        // console.log(oldChildren, newChildren);
        if (oldChildren.length > 0 && newChildren.length > 0) {  // 继续递归判断
            updateChildren(oldChildren, newChildren, el)  // 更新子元素
        } else if (oldChildren.length > 0) {  // 删除子节点
            el.innerHTML = ''
            // console.log('删除子节点');
        } else if (newChildren.length > 0) {
            for (let i = 0; i < newChildren.length; i++) {  // 添加子节点
                let child = newChildren[i]
                // 渲染真实DOM
                el.appendChild(createEl(child))
                // console.log('添加子节点');

            }
        }

    }
    // 更新属性
    function updateAttr(vnode, oldAttr = {}) {
        let newAttr = vnode.data || {}
        let el = vnode.el //获取当前真实节点
        // console.log(el);
        // 1删除属性
        for (const attr in oldAttr) {
            if (!newAttr[attr]) {
                el.removeAttribute(attr)
                // console.log(`删除属性 ${attr}`);
            }
        }
        // 2更新style样式
        let newStyle = newAttr.style || {}
        let oldStyle = oldAttr.style || {}
        for (const attr in oldStyle) {
            if (!newStyle[attr]) {
                el.style = ''
                // console.log(`移除style样式 ${attr}`);
            }
        }
        // 3添加属性
        for (const attr in newAttr) {
            if (attr === 'style') {
                for (const key in newAttr.style) {
                    el.style[key] = newAttr.style[key]
                    // console.log(`更新style样式 ${key} -> ${newAttr.style[key]}`);
                }
            } else if (attr === 'class') {
                el.className = newAttr.class
                // console.log(`更新类名 ${newAttr.class}`);
            } else {
                el.setAttribute(attr, newAttr[attr])
                // console.log(`更新属性 ${attr} -> ${newAttr[attr]}`);
            }
        }
    }
    // 更新子元素
    function updateChildren(oldChildren,newChildren,parent) {
        // console.log('更新子元素');
        // 1创建旧元素双指针
        let oldStartIndex = 0 // 旧的开头索引
        let oldStartVnode = oldChildren[oldStartIndex]  // 旧的开头元素
        let oldEndIndex = oldChildren.length - 1 // 旧的结束索引
        let oldEndVnode = oldChildren[oldEndIndex] // 旧的结束元素

        // 1创建新元素双指针
        let newStartIndex = 0 // 新的开头索引
        let newStartVnode = newChildren[newStartIndex]  // 新的开头元素
        let newEndIndex = newChildren.length - 1 // 新的结束索引
        let newEndVnode = newChildren[newEndIndex] // 新的结束元素
        // 是否同一个元素
        function isSameVnode(oldContext,newContext) {
            return (oldContext.tag === newContext.tag) && (oldContext.key === newContext.key)
        }
        // 创建旧元素映射表
        function makeIndexByKey(child) {
            let map = {}
            child.forEach( (item, index) => {
                // 注意没有 key
                if (item.key) {
                    map[item.key] = index
                }
            })
            return map
        }
        let map = makeIndexByKey(oldChildren)
        // console.log(map);
        while( oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
            // 头部比对
            if ( isSameVnode(oldStartVnode,newStartVnode)) {
                // console.log('首部元素相同');
                // 递归
                patch(oldStartVnode,newStartVnode)
                // 移动指针
                oldStartVnode = oldChildren[++oldStartIndex]
                newStartVnode = newChildren[++newStartIndex]
            } else if ( isSameVnode(oldEndVnode,newEndVnode) ) {
                // console.log('尾部元素相同');
                // 递归
                patch(oldEndVnode,newEndVnode)
                // 移动指针
                oldEndVnode = oldChildren[--oldEndIndex]
                newEndVnode = newChildren[--newEndIndex]                
            } else if ( isSameVnode(oldStartVnode,newEndVnode) ) {
                // console.log('首尾部元素相同');
                // 递归
                patch(oldStartVnode,newEndVnode)
                // 移动指针
                oldStartVnode = oldChildren[++oldStartIndex]
                newEndVnode = newChildren[--newEndIndex]                   
            }else if ( isSameVnode(oldEndVnode,newStartVnode) ) {
                // console.log('尾首部元素相同');
                // 递归
                patch(oldEndVnode,newStartVnode)
                // 移动指针
                oldEndVnode = oldChildren[--oldEndIndex]
                newStartVnode = newChildren[++newStartIndex]                   
            } else {
                /**暴力比对方法 直接用key比对 */
                // 1 创建旧元素映射表
                // 2 从老的中寻找元素
                let moveIndex = map[newStartVnode.key]
                if (!moveIndex) {  // 新key【找不到的key】
                    parent.insertBefore(createEl( newStartVnode ),oldStartVnode.el) // 直接插入到前面
                } else {  // 找得到的key
                    let moveVnode = oldChildren[moveIndex] // 获取到移动的元素
                    oldChildren[moveIndex]  = null
                    parent.insertBefore( moveVnode.el , oldStartVnode.el) // 插入
                    patch( moveVnode, newStartVnode)  // 递归子元素
                }
                // 新的元素指针位移 
                newStartVnode = newChildren[++newStartIndex]
            }
        }


        // 添加多余的子元素
        if (newStartIndex <= newEndIndex) {
            for (let i = newStartIndex; i <= newEndIndex; i++) {
                // console.log(newChildren[i]);
                parent.appendChild( createEl( newChildren[i] ))
            }
        }
        // 删除多余的元素
        if (oldStartIndex <= oldEndIndex) {
            for (let i = oldStartIndex; i <= oldEndIndex; i++) {
                // console.log(oldChildren[i]);
                // 注意null
                let child =oldChildren[i]
                if (child !== null) {
                    parent.removeChild(child.el)  // 删除元素
                }
            }
        }
    }

}
// 递归创建dom , 但并不渲染样式
export function createEl(vnode) {
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

/**diff算法
 * 
 * 1 首部比对
 * 2 尾部比对
 * 3 首尾比对
 * 4 尾首比对
 * 5 暴力比对（key比对）
 * 
 */

