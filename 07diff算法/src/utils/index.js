
export const HOOKS = [
        "beforeCreate",
        "created",
        "beforeMount",
        "mounted",
        "beforeUpdate",
        "updated",
        "beforeDestory",
        "destroyed"
]


// 策略模式   对于有很多种if else的语句，可以使用策略模式
let starts = {}
starts.data = function(parentVal,childVal){
        return childVal
} // 合并data

// starts.computed = function(){} // 合并computed
// starts.watch = function(){} // 合并watch
// starts.methods = function(){} // 合并methods

// 遍历生命周期
HOOKS.forEach( hook =>{
         //不用加(),因为目前是定义很多变量,等待starts[key](parent[key], child[key]) 执行
        starts[hook] = mergeHook  
})
// 合并全局方法（Vue.Mixin等 和生命周期）
// 有孩子、父亲进行拼接成同一个数组，否则返回儿子或父亲
function mergeHook(parentVal,childVal){
        if (childVal) {
                if (parentVal) {
                        return parentVal.concat(childVal)  // 数组连接
                }else {
                        return [childVal]
                }
        }else {
                return parentVal
        }
}

export function mergeOptions(parent, child) {

        const options = {}
        // 有父亲，没有儿子 -> 遍历父亲
        for (let key in parent) {
                mergeField(key)
        }
        // 有儿子，没有父亲 -> 遍历儿子
        for (let key in child) {
                mergeField(key)
        }
        function mergeField(key) {
                // 根据key 策略模式
                if (starts[key]) { //{ created:[a,b,c],watch:[a,b]}
                        options[key] = starts[key](parent[key], child[key])
                }else {
                        options[key] = child[key]
                }
        }
        // console.log('options',options);
        return options
}