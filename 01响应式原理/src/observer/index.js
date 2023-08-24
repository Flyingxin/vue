import { ArrayMethods } from './array'

export function observer(data) {
    // console.log('数据已经劫持：',data);

    // 劫持对象  ---> 为对象、null，即无需劫持，直接返回
    if (typeof data != 'object' || data == null) {
        return data
    }
    return new Observer(data) 

}

class Observer {

    constructor(data) {
        // Object.defineProperty缺点  ---> 只能劫持对象中的一个属性 {a:1,b:2}
        Object.defineProperty(data,"__ob__",{
            enumerable: false,
            value: this //指向实例对象vm
        })

        // 劫持数组并重写方法 --->  用于pop、push等方法时，数据也是响应式的
        if (Array.isArray(data)) {
            console.log('劫持到数组：', data);

            data.__proto__ = ArrayMethods;
            // 为数组添加响应式
            this.observerArray(data) 

        } else {

            //由于存在缺点，所以需遍历每个属性进行劫持 
            this.walk(data)          
        }
    }
    // 劫持对象中每个属性
    walk(data) {
        let keys = Object.keys(data)
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i]
            let value = data[key]
            defineReactive(data, key, value) // 劫持单个属性
        }
    }
    // 为数组添加响应式
    observerArray(data){
        for (let i = 0; i < data.length; i++) {
            observer(data[i])
        }
    }
}

// 劫持单个属性
function defineReactive(data, key, value) {
    //深度劫持
    observer(value) 

    Object.defineProperty(data, key, {
        get() {
            // console.log("获取返回值：", value);
            return value
        },
        set(newValue) {
            if (newValue === value) return;
            // console.log(`劫持：${value} -> ${newValue}`);
            value = newValue
        }
    })
}
