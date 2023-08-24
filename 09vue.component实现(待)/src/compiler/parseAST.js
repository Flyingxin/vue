
// Regular Expressions for parsing tags and attributes
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/    // 属性id:'app'
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`  // 标签名称
const qnameCapture = `((?:${ncname}\\:)?${ncname})` // <span:xx>
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 开头标签< 
const startTagClose = /^\s*(\/?)>/  // 匹配结束标签 >
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 结束标签</xxx>  or >
const doctype = /^<!DOCTYPE [^>]+>/i
// #7298: escape - to avoid being passed as HTML comment when inlined in page
const comment = /^<!\--/
const conditionalComment = /^<!\[/

export function parseHTML(html) {
    // 遍历
    let root //根元素
    let createParent  // 当前元素的父亲
    let stack = []  // 栈  -> 父子级关系

    // 创建抽象语法树格式
    function createASTElement(tag, attrs) {
        return {
            tag,
            attrs,
            children: [], // 子节点
            type: 1,  // 元素级别
            parent: null
        }
    }

    // 开始标签
    function start(tag, attrs) {
        let element = createASTElement(tag, attrs)
        if (!root) {
            root = element
        }
        createParent = element
        stack.push(element)
    }
    // 文本
    function charts(text) {
        text = text.replace(/[\  \r\n]+/g, '')  // 替换空格
        if (text) {
            createParent.children.push({
                type: 3,
                text
            })
        }
    }
    // 结束标签
    function end() {
        let element = stack.pop()   // 出栈
        createParent = stack[stack.length - 1]
        if (createParent) {
            element.parent = createParent.tag
            createParent.children.push(element)
        }
    }
    // 获取标签对象【名称、属性】
    function parseStartTag() {
        const start = html.match(startTagOpen)
        // console.log(html,start);

        if (start) {
            let match = {
                tagName: start[1], //标签名称
                attrs: []
            }
            // 删除开始标签  start[0] -> '<div'
            advance(start[0].length)

            // 获取属性,添加到标签对象中
            let attr, end
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) { // 没有> && 有属性 -> 循环

                match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })  // {name:'id', value:'app'}
                advance(attr[0].length) // arrt[0] -> id="app"
                // console.log(attr[0]);
                // break
            }
            if (end) {
                advance(end[0].length)  // end[0] -> >
                // console.log('end',end[0]);

                // console.log(match);
                return match  //结束匹配
            }
        }

    }
    // 删除html中对应的长度 例如：<div
    function advance(str) {

        html = html.substring(str)
        // console.log(`advance函数删除${str}个字符数: `, html);
    }

    while (html) {

        // 文本结束索引值
        let textEnd = html.indexOf('<')
        if (textEnd === 0) { // 没有文本 -> 解析标签
            // 解析开始标签
            const startTagMatch = parseStartTag()
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                // continue;          
            }
            // console.log(startTagMatch);

            // 解析结束标签
            const endTagMatch = html.match(endTag)
            if (endTagMatch) {
                end()
                advance(endTagMatch[0].length)
            }
            // console.log(endTagMatch);
            // continue;
        }
        if (textEnd > 0) { // 有文本 -> 解析文本内容
            let text = html.substring(0, textEnd)

            if (text) {
                advance(text.length)
                // console.log(text);
                charts(text)
            }
        }
        // break;
    }
    // console.log(root);
    return root
}

/**
 * 从
 *    div id="app">hello {{msg}} <span>231</span></div>
 * 
 * 解析成 ast语法树(抽象语法树)
 * {
 * tage: 'div',
 * attrs: [{id:'app'}],
 * children: [{tag:null, text:'hello'}, {tag:'span',text:231},]
 * }
 * 
 */
