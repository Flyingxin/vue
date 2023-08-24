import Vue from 'vue'


// import vuex from 'vuex'
// Vue.use(vuex) // 使用插件
// // 原理
// // 1 执行这个方法
// // 2 如果这个方法中有一个 install这个属性，这个属性是一个方法，会执行这个方法  --> 使得插件与ve产生关联
// // install方法若有参数，则第一个参数为vue的实例
// function a() {
//   console.log('执行函数a');
// }
// a.install = function(_Vue) {
//   console.log('执行函数a的install方法，并打印出实例对象',_Vue);  // 用实例对象 与插件保持关联
// }
// Vue.use(a)

import vuex from '../vuex/index'
Vue.use(vuex)

const state = {
  sum:0
}

const actions = {
  add({state},data){
    setTimeout(() => {
      state.sum += data      
    }, 800);
  }
}

const mutations = {
  ADD(state,data){
    state.sum += data
  }
}
const getters = {
  caclSum(state) {
    console.log('缓存机制');
    return state.sum * 20
  }
}

//创建并暴露store
export default new vuex.Store({
  actions,
  mutations,
  state,
  getters,
})
