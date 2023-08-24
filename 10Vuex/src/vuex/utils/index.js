
// 遍历对象调用方法
export function foreach(obj,cb){
  Object.keys(obj).forEach( key=> {
    cb(key,obj[key])
  })
}