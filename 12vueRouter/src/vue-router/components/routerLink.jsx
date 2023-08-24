
export default {
  props: { // 组件属性
    to:{
      type: String,
      require: true
    },
    tag: {
      type:String
    }
  },
  // jsx
  render() {
    let tag = this.tag || 'a'
    let hander = ()=>{
      // 跳转
      this.$router.push(this.to)
    }
    return <tag onclick={hander}>{this.$slots.default}</tag>
  }
}