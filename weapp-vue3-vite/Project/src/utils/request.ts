import { convertParams } from '@/utils/utilsTool'

// 通用接口前缀
export const prefix = '/api/v1/weapp'

// HTTP 方法类型
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'get' | 'post' | 'put' | 'delete'

// 请求选项接口
interface RequestOptions {
  contentType?: string
  timeout?: number
  [key: string]: any
}

// 请求配置接口
interface RequestConfig {
  url: string
  method?: HttpMethod
  params?: string | object | ArrayBuffer
  options?: RequestOptions
  baseUrl?: string
  loadingText?: string
  showLoading?: boolean
}

// API 响应数据结构
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  [key: string]: any
}

// HTTP 状态码错误信息映射
const HTTP_STATUS_MESSAGE: Record<number, string> = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '登录过期请重新登录',
  404: '请求资源不存在。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
}

// 环境映射
const ENV_MAP: Record<string, string> = {
  development: '开发环境',
  test: '测试环境',
  production: '生产环境',
}

// 获取环境名称
const getEnvName = (): string => {
  return ENV_MAP[import.meta.env.MODE] || '未知环境'
}

// 获取完整请求 URL
const getFullUrl = (url: string, baseUrl?: string): string => {
  return `${baseUrl || import.meta.env.VITE_BASE_API}${url}`
}

// 获取请求头
const getHeaders = (contentType?: string): Record<string, string> => {
  const token = uni.getStorageSync('token') || ''
  return {
    platform: 'mobile',
    'content-type': contentType || 'application/json;charset=UTF-8',
    Authorization: `Bearer ${token}`,
    'x-from-weapp': '1',
  }
}

// 日志打印函数
const logRequest = (
  url: string,
  params: any,
  data: any,
  logType: 'log' | 'warn' | 'error' = 'log',
  msg: string = '请求日志'
): void => {
  if (import.meta.env.MODE === 'development') {
    const envName = getEnvName()
    const result = {
      url,
      params: convertParams(params),
      data,
    }
    console[logType](`--${envName}--${msg}---`, result)
  }
}

// 显示错误提示
const showErrorToast = (message: string): void => {
  if (message && message.length > 20) {
    uni.showModal({
      title: '提示',
      showCancel: false,
      content: message,
    })
  } else {
    uni.showToast({
      title: message || '请求失败',
      icon: 'none',
      duration: 3000,
    })
  }
}

// 处理登录过期
const handleLoginExpired = (message?: string): void => {
  if (message) {
    uni.showToast({
      title: message,
      icon: 'none',
      duration: 3000,
    })
  }
  uni.removeStorageSync('token')
  uni.navigateTo({
    url: '/subPages/login/login',
  })
}

// 处理成功响应
const handleSuccessResponse = <T>(
  res: UniApp.RequestSuccessCallbackResult,
  resolve: (value: ApiResponse<T>) => void,
  reject: (reason?: any) => void,
  fullUrl: string,
  params: any
): void => {
  const data = res.data as ApiResponse<T>
  const message = data?.message || ''
  
  logRequest(fullUrl, params, data)
  
  switch (res.statusCode) {
    case 200:
      if (data.code === 0) {
        resolve(data)
        return
      }
      // 业务错误码非 0
      showErrorToast(message)
      resolve(data)
      break
      
    case 403:
      // 登录过期
      handleLoginExpired(message)
      reject(new Error(message || '登录已过期'))
      break
      
    default:
      // 其他 HTTP 错误状态码
      const errorMsg = HTTP_STATUS_MESSAGE[res.statusCode] || '未知异常，请稍后重试！'
      uni.showModal({
        title: '温馨提示',
        showCancel: false,
        content: `${res.statusCode}: ${errorMsg}`,
      })
      reject(new Error(errorMsg))
  }
}

// 处理请求失败
const handleRequestFail = (
  err: UniApp.GeneralCallbackResult,
  reject: (reason?: any) => void,
  fullUrl: string,
  params: any
): void => {
  const errorMessage = HTTP_STATUS_MESSAGE[(err as any).statusCode] || err.errMsg || '未知接口，请求异常'
  
  showErrorToast(errorMessage)
  logRequest(fullUrl, params, { errMsg: err.errMsg }, 'error', '错误日志')
  reject(new Error(err.errMsg || errorMessage))
}

/**
 * 通用请求函数
 * @param config 请求配置
 * @returns Promise<ApiResponse>
 */
const request = <T = any>(config: RequestConfig): Promise<ApiResponse<T>> => {
  const {
    url,
    method = 'GET',
    params,
    options = {},
    baseUrl,
    loadingText = '加载中...',
    showLoading = true,
  } = config
  
  const { contentType } = options
  const fullUrl = getFullUrl(url, baseUrl)
  const headers = getHeaders(contentType)
  const convertedParams = convertParams(params)
  
  return new Promise<ApiResponse<T>>((resolve, reject) => {
    // 显示加载提示
    if (showLoading) {
      uni.showLoading({
        title: loadingText,
        mask: true,
      })
    }
    
    // 发起请求
    uni.request({
      url: fullUrl,
      method: method.toUpperCase() as UniApp.RequestOptions['method'],
      data: convertedParams,
      header: headers,
      timeout: options.timeout || 30000,
      success: (res) => {
        uni.hideLoading()
        handleSuccessResponse(res, resolve, reject, fullUrl, params)
      },
      fail: (err) => {
        uni.hideLoading()
        handleRequestFail(err, reject, fullUrl, params)
      },
    })
  })
}

export default request
export type { RequestConfig, RequestOptions, ApiResponse, HttpMethod }