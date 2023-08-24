import { createRouterMap, createRouteRecord} from "./createRouterMap"

// 路由匹配
export function createMatch(routes) { 

  // 1 格式化成路由映射表 【 routes->object格式 】
  const pathMap = createRouterMap(routes)
  // console.log('pathMap',pathMap);
  
  // 2 动态添加路由  合并用户写的和动态添加的路由
  function addRoutes(routes) {
    createRouterMap(routes, pathMap)
  }

  /**
    // /about/a 、  /about/c
    // addRoutes([
    //   {
    //     path:'/about',
    //     component:'xx',
    //     children: [
    //       {
    //         path:'a',
    //         component: '111'
    //       }
    //     ]
    //   },
    //   {
    //     path:'/about',
    //     component:'xx',
    //     children: [
    //       {
    //         path:'b',
    //         component: '111'
    //       }
    //     ]
    //   }
    // ])   * 
   */
    
  // ---------------核心-----------
  // 3 匹配指定路由并返回每一层路由    
  function match(location) {
    // console.log('location',location);
    let recode = pathMap[location]
    if (recode) {
      // 创建路由记录
      return createRouteRecord(recode, { path: location })
    }
    // 若没有 
    return createRouteRecord(null, { path: location })
  }

  // console.log('匹配路由/about/c\n',match('/about/c'));
  return {
    addRoutes,
    match
  }
}
