/**
 * 动态路由
 * title?: string
 * icon?: string
 * svgIcon?: string
 * hidden?: boolean // 是否在侧边栏显示，默认false
 * roles?: string[] // 权限码
 * roles: ["admin", "editor"], // 可以在根路由中设置角色
 * alwaysShow: true // 将始终显示根菜单
 * noNestingMenu?: boolean // 将嵌套目录设置为一级目录
 *
 */
import { createRouter, createWebHashHistory, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routerList = import.meta.glob('./router/*.ts', { import: 'default', eager: true })

/** 免登录白名单路由 */
export const whiteLoginList = ['/login']

export const routers: any = Object.values(routerList).flat()

// 常量路由（不需要权限的路由：登录页、错误页等）
export const constantRoutes: RouteRecordRaw[] = []
// 异步路由（需要权限的路由：dashboard、permission 等）
export const asyncRoutes: RouteRecordRaw[] = []

// 分类路由
routers.forEach((routeArray: RouteRecordRaw[]) => {
  if (Array.isArray(routeArray)) {
    routeArray.forEach((route: RouteRecordRaw) => {
      // 判断是否为常量路由（登录页、错误页）
      if (
        route.meta?.hidden === true ||
        route.path === '/login' ||
        (typeof route.path === 'string' && (route.path.includes('error-page') || route.path.includes(':pathMatch')))
      ) {
        constantRoutes.push(route)
      } else {
        // 其他路由都是异步路由
        asyncRoutes.push(route)
      }
    })
  }
})

const router = createRouter({
  history:
    import.meta.env.VITE_ROUTER_HISTORY === 'hash'
      ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH)
      : createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: routers
})

/** 重置路由
 *  注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
 */
export function resetRouter() {
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch (error) {
    window.location.reload()
  }
}

export default router
