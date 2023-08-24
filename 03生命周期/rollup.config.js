import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

export default {
    input: './src/index.js',
    output: {
        file: 'dist/vue.js',
        format: 'umd',   //通过umd模块处理 就可以在在window上出现Vue 
        name: 'Vue',
        sourcemap: true
    },
    plugins:[
        // babel 将高级语法转换成每个浏览器都能识别的语法 ，例如ES6 -> ES5
        babel({
            exclude: 'node_modules/**' //排除该文件夹的转换
        }),
        serve({
            port:3000,
            contentBase: '', //表示当前目录下的index。html
            openPage: '/index.html'  
        })
    ]
}