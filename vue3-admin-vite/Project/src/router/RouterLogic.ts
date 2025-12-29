import router, { whiteLoginList } from '@/router'
import AutoUpdateChecker from '@/utils/autoUpdate'
import { useUserStoreHook } from '@/store/modules/user'
import { usePermissionStoreHook } from '@/store/modules/permission'
import { getToken } from '@/utils/cookies'
import asyncRouteSettings from './interface/async-route'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

const autoUpdateChecker = new AutoUpdateChecker('', 30000)
const isDevelopment = import.meta.env.MODE === 'development'

// 获取首页路由
const getHomeRoute = (): string => {
  return '/dashboard'
}

// 初始化用户权限和路由
const initUserRoutes = async (
  userStore: ReturnType<typeof useUserStoreHook>,
  permissionStore: ReturnType<typeof usePermissionStoreHook>
) => {
  if (asyncRouteSettings.open) {
    await userStore.getInfo()
    permissionStore.setRoutes(userStore.roles)
  } else {
    userStore.setRoles(asyncRouteSettings.defaultRoles)
    permissionStore.setRoutes(asyncRouteSettings.defaultRoles)
  }
  permissionStore.dynamicRoutes.forEach((route: any) => router.addRoute(route))
}

router.beforeEach(async (to, _from, next) => {
  NProgress.start()
  const userStore = useUserStoreHook()
  const permissionStore = usePermissionStoreHook()

  // 版本检测（仅非白名单路由）
  if (!whiteLoginList.includes(to.path) && !isDevelopment) {
    if (await autoUpdateChecker.checkNow()) {
      autoUpdateChecker.refreshApp()
      return
    }
  }

  const hasToken = getToken()

  // 未登录：白名单放行，否则跳转登录
  if (!hasToken) {
    if (whiteLoginList.includes(to.path)) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
    return
  }

  // 已登录：处理首页和登录页跳转
  if (to.path === '/' || to.path === '/login') {
    next({ path: getHomeRoute(), replace: to.path === '/' })
    NProgress.done()
    return
  }

  // 初始化权限路由（首次加载）
  if (userStore.roles.length === 0) {
    try {
      await initUserRoutes(userStore, permissionStore)
      // 如果目标路径是首页，需要根据时间判断跳转
      next(to.path === '/' ? { path: getHomeRoute(), replace: true } : { ...to, replace: true })
    } catch (err: any) {
      userStore.resetToken()
      next('/login')
      NProgress.done()
    }
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})
