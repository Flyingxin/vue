
let callback = []
let pending = false
let timerFunc

// 列队处理（异步，统一更新Watcher） -> 缓存
export function nextTick(cb) {

  // console.log(cb);

  callback.push(cb)
  // console.log(callback);
  if (!pending) {
    /**
     * 异步统一更新dom
     * 原本 -> 定时器
     * 现在 -> promise  但存在兼容性问题，需解决
     */
    timerFunc()
  }
}

// 处理兼容性问题
if (Promise) {
  timerFunc = () => {
    Promise.resolve().then(flush)
    pending = true
  }
} else if (MutationObserver) {  // h5 异步方法 可以监听DOM变化，监控完毕后再来异步更新

  let observer = new MutationObserver(flush)
  let textnode = document.createTextNode(1) // 创建文本
  observer.observe(textnode, { characterData: true }) // 监测文本内容
  timerFunc = () => {
    textnode.textContent = 2
  }
} else if (setImmediate) {  // ie
  timerFunc = () => {
    setImmediate(flush)
  }
}

// 更新
function flush() {
  callback.forEach(cb => cb())
  pending = false  //刷新完置为false  -> 没有依赖dep正在更新dom
}