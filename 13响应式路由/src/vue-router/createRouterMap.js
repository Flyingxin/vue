// 创建路由映射表
export function createRouterMap(routes,routerOptions ={}) {
  // console.log(routes);
  // let pathMap = {}
  let pathMap = routerOptions

  routes.forEach(router => {
    // 格式处理
    addRouterRecode(router,pathMap)
  });

  // console.log('路由映射表',pathMap);
  return pathMap
}

// routes-深度-格式化-处理-路由配置信息
function addRouterRecode(router,pathMap,parent){
  // console.log(router);

  let path = parent ? `${parent.path}/${router.path}` : router.path
  let recode = {
    path: router.path,
    name:router.name,
    component: router.component,
    parent
  }
  // 添加
  if (!pathMap[path]) {
    pathMap[path] = recode
  }
  // 处理子路由
  if (router.children) {
    // 递归
    router.children.forEach( child =>{
      // 注意parent
      addRouterRecode(child,pathMap,recode)
    })
  }
}

// 创建路由记录
export function createRouteRecord(recode,{path}){

  // 定义结构
  let matched = []
  if (recode) {
    // 逐层遍历
    while(recode){
      matched.unshift(recode)
      recode = recode.parent
    }
  }
  return {
    path,
    matched
  }
}
