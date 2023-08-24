import { History } from "./base"

export class HashHistory extends History {
  constructor(router){
    super(router)  // 继承父类属性
    // console.log(router === this.router); // true
    // console.log('HashHistory',this);
    // 确保当前是hash模式
    ensureSlhash()
  }
  // 获取当前路径
  getCurrentLocation(){
    return getHash()
  }
  // 监听
  setUpLister(){
    window.addEventListener('hashchange',()=>{
      // 跳走到最新路径
      this.transitionTo(getHash())
    })
  }
}
// hash模式是带有#

//确保当前是hash模式
function ensureSlhash(){

  if (window.location.hash) { // 是
    return
  } else {
    window.location.hash = '/'
  }
}

// 获取当前的路由
function getHash(){
  // console.log(window.location.hash);

  // 获取的hash为#号开头,所以要slice(1)
  return window.location.hash.slice(1) 
}