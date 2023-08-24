// 重写数组

// 1 获取原来的数组方法
let oldArrayProtoMethods = Array.prototype

// 2 继承
export let ArrayMethods = Object.create(oldArrayProtoMethods)

// 3 劫持
let methods = [
    'push',
    'pop',
    'unshift',
    'shift',
    'splice'
]

methods.forEach(item => {
    // 函数方式进行数组劫持,重写数组方法
    // console.log('劫持数组,正在重写数组方法',item);
    ArrayMethods[item] = function(...args){
        let result = oldArrayProtoMethods[item].apply(this,args)
        // 对应方法添加响应式
        let inserted
        switch (item) {
            case 'push':
            case 'unshift':
                inserted = args
                break;
            case 'splice':
                inserted = args.splice(2); // arr.splice(0,1,{b:6})
                break;
        }
        // console.log(`${item}方法 inserted `,inserted);
        let ob = this.__ob__  //指向数组本身

        if (inserted) {
            ob.observerArray(inserted)
        }
        ob.dep.notify()  // 数组更新
        
        return result
    }
})