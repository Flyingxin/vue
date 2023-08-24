
export let Vues

// 实现store放到每一个使用的组件中
export const install = function (_Vue) {
  // console.log('install方法');
  Vues = _Vue
  // 使用vue提供的方法 Vue.mixin
  Vues.mixin({
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