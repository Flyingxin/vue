
const defaultTageRE = /\{\{((?:.|\r?\n)+?)\}\}/g  //匹配插值表达式

// 生成模板编译字符串
export function generate(el) {

    // 处理子节点
    function genChildren(el) {
        let children = el.children
        if (children) {
            return children.map(item => gen(item)).join(',')
        }
    }
    function gen(node) { // 子节点类型 1标签 3文本
        if (node.type === 1) { // 标签 
            return generate(node)
        } else { // 文本
            let text = node.text
            if (!defaultTageRE.test(text)) { // 没有插值语法
                return `_v(${JSON.stringify(text)})`
            }
            let tokens = [] // 保存值
            let lastindex = defaultTageRE.lastIndex = 0  //下一次查找的索引位置
            let match
            while (match = defaultTageRE.exec(text)) { // exec捕获插值表达式
                // console.log('match',match);
                let index = match.index //首次匹配上的子串的起始下标
                if (index > lastindex) {
                    tokens.push(JSON.stringify(text.slice(lastindex, index))) //文本内容                
                }
                tokens.push(`_s(${match[1].trim()})`) // 插值表达式变量名
                lastindex = index + match[0].length
            }
            if (lastindex < text.length) {
                tokens.push(JSON.stringify(text.slice(lastindex)))
            }
            // console.log(tokens);
            return `_v(${tokens.join('+')})`
        }
    }
    /**
     * 处理style属性行内样式
     * {name: 'style', value: 'color: red;font-size: 14px;'} 
     *  ->
     * {name: 'style', attrs: {color: red,font-size: 14px} } 
     */
    function genProps(attrs) {
        let str = ''
        if (attrs) {
            attrs.forEach(attr => {
                if (attr.name === 'style') {
                    let obj = {}
                    let items = attr.value.split(';')
                    items.forEach(item => {
                        let [key, value] = item.split(':')
                        obj[key] = value
                    });
                    attr.value = obj
                }
                // 拼接
                str += `${attr.name}:${JSON.stringify(attr.value)},`
            })            
        }
        // console.log('style属性行内样式：',str);
        return `{${str.slice(0, -1)}}` //切除最后一个逗号！！！
    }

    let children = genChildren(el)
    //  _c解析标签【也可以解析子标签】 _v解析文本 _s解析插值表达式 
    let code = `_c('${el.tag}',${el.attrs.length ? `${genProps(el.attrs)}` : `${genProps(0)}`},${children ? `${children}` : ''})`
    // console.log('code',code);
    return code

}


/**
 * 从
 * 
 * {
 *  tage: 'div',
 *  attrs: [{id:'app'}],
 *  children: [{tag:null, text:'hello'}, {tag:'span',text:231},]
 * }
 * 
 * 解析成
 * 
 * render() { _c解析标签【也可以解析子标签】 _v解析文本 _s解析插值表达式 
 *  return _c('div',{id:'app'},_v('hello '+_s(msg)),_c('h1'))
 * }
 * 
 */