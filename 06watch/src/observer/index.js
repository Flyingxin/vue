import { ArrayMethods } from './array'
import { Dep } from "./dep";

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
        // Object.defineProperty缺点  ---> 只能给对象中的一个属性添加响应式
        Object.defineProperty(data,"__ob__",{
            enumerable: false,
            value: this //指向实例对象vm
        })

        // 1 给所有对象类型属性增加一个dep，不是给里面的属性添加dep   --> 使得数组、对象有了收集依赖
        this.dep = new Dep()

        // 劫持数组并重写方法 --->  用于pop、push等方法时，数据也是响应式的
        if (Array.isArray(data)) {
            // console.log('劫持到数组：', data);

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
    //深度劫持添加添加响应式 自下而上的使用Object.defineProperty原理
    let childDep = observer(value)
    // console.log(childDep);
    let dep = new Dep() //给每个属性添加dep

    Object.defineProperty(data, key, {
        get() {
            if (Dep.target) {
                dep.depend() //收集
                if (childDep.dep) {
                    // console.log(childDep);
                    childDep.dep.depend() //数组收集
                }
            }
            // console.log("获取返回值：", value);
            return value
        },
        set(newValue) {
            if (newValue === value) return;
            // console.log(`劫持：${value} -> ${newValue}`);
            value = newValue

            dep.notify()  // 记得通知更新!!!
        }
    })
}
