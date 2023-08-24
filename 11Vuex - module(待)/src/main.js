import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
Vue.config.productionTip = false

new Vue({
  store, // 为什么写在这，是因为$store要在每个组件中使用，但组件的关系是父子关系，所以放在根元素上
  render: h => h(App),
}).$mount('#app')
