/**
 * 工具函数集合
 */

// ==================== 基础工具 ====================

/**
 * 异步等待
 * @param ms 等待时间（毫秒），默认 1000ms
 */
export const sleep = (ms: number = 1000): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param delay 延迟时间（毫秒）
 */
export function debounce<F extends (...args: any[]) => void>(
  func: F,
  delay: number
): (...args: Parameters<F>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return function debounced(...args: Parameters<F>): void {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param delay 延迟时间（毫秒）
 */
export function throttle<F extends (...args: any[]) => void>(
  func: F,
  delay: number
): (...args: Parameters<F>) => void {
  let throttling = false
  return function throttled(...args: Parameters<F>): void {
    if (!throttling) {
      func(...args)
      throttling = true
      setTimeout(() => {
        throttling = false
      }, delay)
    }
  }
}

// ==================== 设备信息 ====================

/**
 * 获取当前设备头部区域信息
 * @returns 设备信息对象
 */
export interface DeviceSystemInfo {
  navBarHeight: number
  menuRight: number
  menuTop: number
  menuHeight: number
  screenWidth: number
}

export const getComputerSystem = (): DeviceSystemInfo => {
  const windowInfo = uni.getWindowInfo()
  const menuButtonInfo = uni.getMenuButtonBoundingClientRect()

  return {
    navBarHeight:
      menuButtonInfo.bottom + menuButtonInfo.top - (windowInfo.statusBarHeight || 0),
    menuRight: (windowInfo.screenWidth || 0) - menuButtonInfo.right,
    menuTop: menuButtonInfo.top,
    menuHeight: menuButtonInfo.height,
    screenWidth: windowInfo.screenWidth,
  }
}

// ==================== 文件上传 ====================

/**
 * 文件上传配置
 */
interface UploadFileOptions {
  baseUrl?: string
  url: string
  filePath: string
  params?: Record<string, any>
}

/**
 * 上传文件到服务器
 * @param options 上传配置
 * @returns Promise<上传结果>
 */
export const uploadFilePromise = (
  options: UploadFileOptions
): Promise<any> => {
  const { baseUrl, url, filePath, params } = options
  const token = uni.getStorageSync('token') || ''

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${baseUrl || import.meta.env.VITE_BASE_API}${url}`,
      filePath,
      name: 'file',
      formData: params,
      header: {
        platform: 'mobile',
        'x-from-weapp': '1',
        Authorization: `Bearer ${token}`,
      },
      success: (res) => {
        try {
          const data = JSON.parse(res.data)
          resolve(data)
        } catch (error) {
          reject(new Error('解析响应数据失败'))
        }
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}

// ==================== 客服功能 ====================

/**
 * 打开客服会话
 * @param options 客服配置
 */
export const openCustomerServiceChat = ({
  corpId,
  url,
}: {
  corpId: string
  url: string
}): void => {
  uni.openCustomerServiceChat({
    corpId,
    extInfo: {
      url,
    },
    success: () => {
      // 打开成功
    },
    fail: (err) => {
      uni.showToast({
        title: `拉取客服失败：${err?.errMsg || '未知错误'}`,
        icon: 'none',
      })
    },
  })
}

// ==================== 参数处理 ====================

/**
 * 将对象转换为查询字符串
 * @param obj 参数对象
 * @returns 查询字符串，如: "a=1&b=2"
 */
export const objectToQueryString = (obj: Record<string, any>): string | false => {
  if (!obj || typeof obj !== 'object') {
    return false
  }
  return Object.entries(obj)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
}

/**
 * 参数类型定义
 */
type ConvertParamsInput = Record<string, any> | null | undefined | string | ArrayBuffer

/**
 * 针对搜索值做统一处理（去除空格、过滤空值）
 * @param props 参数对象、字符串或 ArrayBuffer
 * @returns 处理后的参数对象，如果是字符串或 ArrayBuffer 则原样返回
 */
export const convertParams = (
  props: ConvertParamsInput
): Record<string, any> | string | ArrayBuffer => {
  // 如果是字符串或 ArrayBuffer，直接返回
  if (typeof props === 'string' || props instanceof ArrayBuffer) {
    return props
  }
  
  if (!props || typeof props !== 'object') {
    return {}
  }

  const newParams: Record<string, any> = {}
  for (const key in props) {
    if (Object.prototype.hasOwnProperty.call(props, key)) {
      const item = props[key]
      const type = typeof item

      // 保留 false 和 0
    if (item || item === false || item === 0) {
        if (item && type === 'string') {
          // 去除字符串空格
          newParams[key] = item.replace(/\s/g, '')
        } else if (Object.prototype.toString.call(item) === '[object Object]') {
          // 递归处理对象
          newParams[key] = convertParams(item)
        } else {
          newParams[key] = item
        }
      }
    }
  }
  return newParams
}

// ==================== 时间格式化 ====================

/**
 * 格式化时间
 * @param timelong 时间戳或日期字符串
 * @param format 格式模板，默认 "YYYY-MM-DD"
 * @returns 格式化后的时间字符串
 */
export const formatDateTime = (
  timelong: number | string | Date | null | undefined,
  format: string = 'YYYY-MM-DD'
): string => {
  if (!timelong) {
    return ''
  }

  const format2n = (val: number): string => {
    return val < 10 ? `0${val}` : String(val)
  }

  const date = new Date(timelong)
  if (isNaN(date.getTime())) {
    return ''
  }

  const year = String(date.getFullYear())
  const month = format2n(date.getMonth() + 1)
  const day = format2n(date.getDate())
  const hour = format2n(date.getHours())
  const minute = format2n(date.getMinutes())
  const second = format2n(date.getSeconds())

  return format
    .replace(/YYYY/g, year)
    .replace(/YYY/g, year.slice(1))
    .replace(/YY/g, year.slice(2))
    .replace(/Y/g, year.slice(1))
    .replace(/MM/g, month)
    .replace(/M/g, month.slice(1))
    .replace(/DD/g, day)
    .replace(/D/g, day.slice(1))
    .replace(/hh/g, hour)
    .replace(/h/g, hour.slice(1))
    .replace(/mm/g, minute)
    .replace(/m/g, minute.slice(1))
    .replace(/ss/g, second)
    .replace(/s/g, second.slice(1))
}

// ==================== 文件处理 ====================

/**
 * 图片路径转 base64 格式
 * @param filePath 图片临时路径
 * @returns Promise<base64字符串>
 */
export const imageToBase64 = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    uni.getFileSystemManager().readFile({
      filePath,
      encoding: 'base64',
      success: (res) => {
        resolve(`data:image/jpeg;base64,${res.data}`)
      },
      fail: (err) => {
        reject(new Error(err.errMsg || '读取文件失败'))
      },
    })
  })
}

// ==================== 剪贴板 ====================

/**
 * 复制文本到剪贴板
 * @param content 要复制的内容
 * @returns Promise<void>
 */
export const copyToClipboard = (content: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    uni.setClipboardData({
      data: content,
      success: () => {
        uni.showToast({
          title: '复制成功',
          icon: 'none',
        })
        resolve()
      },
      fail: (err) => {
        uni.showToast({
          title: err?.errMsg || '复制失败',
          icon: 'none',
        })
        reject(err)
      },
    })
  })
}

// ==================== 数字格式化 ====================

/**
 * 格式化数字为每三位加逗号分割形式
 * @param num 需要转换的数字
 * @param fix 保留几位小数，默认 0
 * @returns 格式化后的字符串
 */
export const toThousands = (num: number, fix: number = 0): string => {
  if (fix > 0) {
    return Number(num.toFixed(fix)).toLocaleString()
  }
  return num.toLocaleString()
}

/**
 * 格式化金额（分转元，保留两位小数，千分位展示）
 * @param money 金额（分）
 * @returns 格式化后的金额字符串
 */
export const formatMoney = (money: number | string | null | undefined): string => {
  if (money === null || money === undefined || money === '') {
    return '0.00'
  }
  const formattedNumber = (Number(money) / 100).toFixed(2)
  return formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 格式化金额（千分位，保留两位小数）
 * @param money 金额
 * @returns 格式化后的金额字符串，如果为 undefined 返回 "****"
 */
export const transformMoney = (
  money: number | string | null | undefined
): string => {
  if (money === null || money === undefined || money === '') {
    return '****'
  }
  const formattedNumber = Number(money).toFixed(2)
  return formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// ==================== 数据脱敏 ====================

/**
 * 隐藏手机号中间四位
 * @param phone 手机号
 * @returns 脱敏后的手机号，如: "138****5678"
 */
export const maskPhone = (phone: string): string => {
  if (!phone || typeof phone !== 'string') {
    return phone
  }
  const reg = /^(\d{3})\d{4}(\d{4})$/
  return phone.replace(reg, '$1****$2')
}

/**
 * 隐藏姓名（保留首字符）
 * @param name 姓名
 * @returns 脱敏后的姓名，如: "张***"
 */
export const maskName = (name: string): string => {
  if (!name || typeof name !== 'string') {
    return name
  }
  const regex = /^(\S)\S*$/
  return name.replace(regex, (_, group1: string) => {
    return group1 + '*'.repeat(name.length - 1)
  })
}

/**
 * 隐藏银行卡号
 * @param cardNumber 银行卡号
 * @returns 脱敏后的银行卡号，如: "**** **** **** 1234"
 */
export const maskBankCardNumber = (cardNumber: string): string => {
  if (!cardNumber || typeof cardNumber !== 'string') {
    return cardNumber
  }
  return cardNumber.replace(/\s/g, '').replace(/(\d{4})\d+(\d{4})$/, '**** **** **** $2')
}

/**
 * 隐藏身份证号
 * @param idNumber 身份证号
 * @returns 脱敏后的身份证号
 */
export const maskIDCardNumber = (idNumber: string): string => {
  if (!idNumber || typeof idNumber !== 'string') {
    return idNumber
  }
  const length = idNumber.length
  if (length < 4) {
    return idNumber
  }
  const hiddenPart = idNumber.substring(3, length - 1).replace(/\d/g, '*')
  return idNumber.substring(0, 3) + hiddenPart + idNumber.charAt(length - 1)
}

// ==================== 数据转换 ====================

/**
 * 百分数转化为小数
 * @param percent 百分数字符串，如: "50%"
 * @returns 小数，如: 0.5
 */
export const toPoint = (percent: string): number => {
  if (!percent || typeof percent !== 'string') {
    return 0
  }
  const str = percent.replace('%', '')
  return Number(str) / 100
}

/**
 * 百分数转化为整数
 * @param percent 百分数字符串，如: "50%"
 * @returns 整数，如: 50
 */
export const parsePercent = (percent: string): number => {
  if (!percent || typeof percent !== 'string') {
    return 0
  }
  return Number(percent.replace('%', ''))
}

