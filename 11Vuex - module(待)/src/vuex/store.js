// import { foreach } from './utils/index'
import { Vues } from './mixin'

// 模块化

// root ={
//   _raw: '用户传过来的默认数据',
//   _children: {
//     a:{
//       _raw: '用户传过来的默认数据',
//       _children:{...},
//       state: '根数据'
//     },
//     b:{
//       _raw: '用户传过来的默认数据',
//       _children:{...},
//       state: '根数据'
//     },    
//   },
//   state: '根数据'
// }


class ModulesCollctions{
  constructor(options){
    console.log(options);
  }
}



// 单例模式
export class Store {
  constructor(options) {
   
    this.modules = new ModulesCollctions(options)



    // getters 计算属性 用户：{属性：方法} 使用{对象：值 }
    // Object.keys(getters).forEach( key => {
    //   Object.defineProperty(this.getters,key, {
    //     get: () => {
    //       return getters[key](this.state)
    //     }
    //   })
    // })
    // 获取state
    this._vm = new Vues({
      data: {
        state: options.state
      },
      // computed
    })
  }
  // 代理属性 变成响应式
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
