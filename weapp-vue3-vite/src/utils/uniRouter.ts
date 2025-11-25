/**
 * 路由参数类型定义
 */
type RouteParams = Record<string, string | number | boolean | null | undefined>

/**
 * 构建查询参数字符串
 * @param params 参数对象
 * @returns 查询参数字符串，如: ?key1=value1&key2=value2
 */
function buildQueryString(params?: RouteParams): string {
  if (!params || typeof params !== 'object') {
    return ''
  }

  const entries = Object.entries(params).filter(
    ([, value]) => value !== null && value !== undefined && value !== ''
  )

  if (entries.length === 0) {
    return ''
  }

  const queryString = entries
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&')

  return `?${queryString}`
}

/**
 * 打开新页面并跳转
 * @param url 页面路径
 * @param params 路由参数（可选）
 */
function navigateTo(url: string, params?: RouteParams): void {
  if (!url) {
    console.warn('navigateTo: url 不能为空')
    return
  }

  const fullUrl = url + buildQueryString(params)
  uni.navigateTo({
    url: fullUrl,
    fail: (err) => {
      console.error('navigateTo 失败:', err)
      uni.showToast({
        title: '页面跳转失败',
        icon: 'none',
        duration: 2000,
      })
    },
  })
}

/**
 * 关闭当前页面并跳转到新页面
 * @param url 页面路径
 * @param params 路由参数（可选）
 */
function redirectTo(url: string, params?: RouteParams): void {
  if (!url) {
    console.warn('redirectTo: url 不能为空')
    return
  }

  const fullUrl = url + buildQueryString(params)
  uni.redirectTo({
    url: fullUrl,
    fail: (err) => {
      console.error('redirectTo 失败:', err)
      uni.showToast({
        title: '页面跳转失败',
        icon: 'none',
        duration: 2000,
      })
    },
  })
}

/**
 * 返回上级页面
 * @param delta 返回的页面数，默认为 1
 */
function navBack(delta: number = 1): void {
  const validDelta = typeof delta === 'number' && delta > 0 ? delta : 1

  uni.navigateBack({
    delta: validDelta,
    fail: (err) => {
      console.error('navBack 失败:', err)
      // 如果返回失败，可能是已经在首页，不显示错误提示
    },
  })
}

/**
 * 关闭所有页面并跳转到 tabBar 页面
 * @param url tabBar 页面路径
 */
function switchTab(url: string): void {
  if (!url) {
    console.warn('switchTab: url 不能为空')
    return
  }

  uni.switchTab({
    url: url,
    fail: (err) => {
      console.error('switchTab 失败:', err)
      uni.showToast({
        title: '页面跳转失败',
        icon: 'none',
        duration: 2000,
      })
    },
  })
}

/**
 * 重新加载当前页面
 * @param url 页面路径（可选，默认当前页面）
 * @param params 路由参数（可选）
 */
function reLaunch(url?: string, params?: RouteParams): void {
  const targetUrl = url || ''
  const fullUrl = targetUrl + buildQueryString(params)

  uni.reLaunch({
    url: fullUrl,
    fail: (err) => {
      console.error('reLaunch 失败:', err)
      uni.showToast({
        title: '页面跳转失败',
        icon: 'none',
        duration: 2000,
      })
    },
  })
}

/**
 * 参数转换拼接（保留向后兼容）
 * @deprecated 请使用 buildQueryString
 */
function handleParams(params?: RouteParams): string {
  return buildQueryString(params)
}

export {
  navigateTo,
  redirectTo,
  navBack,
  switchTab,
  reLaunch,
  buildQueryString,
  handleParams,
}

export type { RouteParams }