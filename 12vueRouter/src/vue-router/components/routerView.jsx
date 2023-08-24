export default {

  render() {
    let hander = ()=>{
      // 跳转
      this.$router.push(this.to)
    }
    return <a onclick={hander}>{this.$slots.default}</a>
  }
}