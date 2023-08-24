import { foreach } from './utils/index'

export let Vue
// 单例模式
export class Store {
  constructor(options) {
    console.log('store ', options,this); // this指向store实例对象实例
    // state
    // this.state = options.state // 获取数据但是没有响应式
    
    let actions = options.actions
    this.actions = {}
    foreach(actions,(key,value)=>{
      this.actions[key] = (data) =>{
        value(this,data)
      }
    })

    let mutations = options.mutations
    this.mutations = {}
    foreach(mutations,(key,value)=>{
      this.mutations[key] = (data) =>{
        value(this.state,data)
      }
    })

    // getters 相当于Vue属性中的计算属性 缓存机制
    let computed = {}
    let getters = options.getters
    this.getters = {}
    foreach(getters, (key, value) => {
      computed[key] = () => {
        return value(this.state)
      }
      // 从this._vm[key]取值，与key绑定代理到this.getters上
      Object.defineProperty(this.getters, key, {
        get: () => {
          return this._vm[key]
        }
      })
    })

    // getters 计算属性 用户：{属性：方法} 使用{对象：值 }
    // Object.keys(getters).forEach( key => {
    //   Object.defineProperty(this.getters,key, {
    //     get: () => {
    //       return getters[key](this.state)
    //     }
    //   })
    // })

    // 将公共数据和计算属性存到新的实例对象上，供调用
    this._vm = new Vue({
      // 指向同一个栈地址
      data: {
        state: options.state
      },
      computed
    })
  }
  // 获取state 
  // get state() 与function state()区别就是 前者调用属性，后者调用方法【this.state()】获取到
  get state() {
    // console.log(this._vm);
    return this._vm.state
  }
  // 发布订阅模式
  commit = (name,data) =>{
    this.mutations[name](data)
  }
  dispatch = (name,data) =>{
    this.actions[name](data)
  }
}

// 实现store放到每一个使用的组件中
export const install = function (_Vue) {
  // console.log('install方法');
  Vue = _Vue
  // 使用vue提供的方法 Vue.mixin
  Vue.mixin({
    // 让每个组件都能访问到父组件/根实例上的store
    beforeCreate() {
      // console.log(this.$options);
      let options = this.$options
      if (options.store) { // 根实例
        this.$store = options.store
      } else { // 其他
        this.$store = this.$parent && this.$parent.$store
      }
    }
  })
}