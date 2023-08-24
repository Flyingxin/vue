
import { parseHTML } from "./parseAST";
import { generate } from "./generate";

// render函数
export function compileToFunciton(template) {
    
    // 1 将html字符串 -> ast语法树
    let ast = parseHTML(template)
    console.log('html字符串 -> ast语法树', ast);

    // 2 ast语法树 -> 模板编译字符串
    let code = generate(ast)
    console.log('ast语法树 -> 模板编译字符串 ',code);

    // 3 模板编译字符串 -> render函数
    let render = new Function(`with(this){return ${code}}`)
    console.log('模板编译字符串 -> render函数',render);

    // render函数
    return render
    
}

