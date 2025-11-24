import { h } from 'vue'
import { useUserStoreHook } from '@/store/modules/user'
import { ElMessage, ElMessageBox, ElBadge } from 'element-plus'

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const BadgeRender = (type, content) => {
  return [h(ElBadge, { isDot: true, type, style: { marginTop: '8px', marginRight: '5px' } }), h('span', content)]
}

export const _isPcScreen = () => {
  const rect = document.body.getBoundingClientRect()
  return rect.width - 1 < 1670
}

/** 全局权限判断函数，和指令 v-permission 功能类似 */
export const checkPermission = (value: string[]): boolean => {
  if (value && value instanceof Array && value.length > 0) {
    const roles = useUserStoreHook().roles
    const permissionRoles = value
    return roles.some((role) => {
      return permissionRoles.includes(role)
    })
  } else {
    console.error("need roles! Like v-permission=\"['admin','editor']\"")
    return false
  }
}

/** 将全局 CSS 导入 JS 中使用 没有拿到值时，会返回空串*/
export const getCssVariableValue = (cssVariableName: string) => {
  let cssVariableValue = ''
  try {
    cssVariableValue = getComputedStyle(document.documentElement).getPropertyValue(cssVariableName)
  } catch (error) {
    console.error(error)
  }
  return cssVariableValue
}

// 字符串拼接a=1&b=2
export const stringify = (obj: object) => {
  if (!obj) return false
  return Object.entries(obj)
    .map((item) => `${item[0]}=${item[1]}`)
    .join('&')
}

/**
 * @param {Object} props
 * @description 针对搜索值做统一处理
 */
export function convertParams(props) {
  const newParams = {}
  for (const index in props) {
    const item = props[index]
    const type = typeof item
    if (item || item === 0) {
      if (item && type === 'string') {
        newParams[index] = item.replace(/(^\s+)|(\s+$)/g, '')
      } else if (Object.prototype.toString.call(item) === '[object Object]') {
        newParams[index] = convertParams(item)
      } else {
        newParams[index] = item
      }
    }
  }
  return newParams
}

// 拷贝复制内容
export const onCopyText = (content) => {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(content).then(
      () => {
        ElMessage.success('复制成功！')
      },
      () => ElMessage.error('复制失败！')
    )
  } else {
    const textArea = document.createElement('textarea')
    textArea.value = content
    textArea.style.position = 'absolute'
    textArea.style.opacity = '0'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    document.execCommand('copy')
    ElMessage.success('复制成功！')
    textArea.remove()
  }
}

// 全局信息提示弹框提醒
export const publicMessageBox = ({ content, httpApi, message, fetch }) => {
  return ElMessageBox.confirm(content, '提示', {
    confirmButtonText: '确 定',
    cancelButtonText: '取 消',
    type: 'warning',
    beforeClose: async (action, instance, done) => {
      if (action === 'confirm') {
        try {
          instance.confirmButtonLoading = true
          const res: any = await httpApi()
          instance.confirmButtonLoading = false
          if (res?.code === 200) return done()
        } catch (err) {
          instance.confirmButtonLoading = false
          throw new Error(err)
        }
      } else {
        done()
      }
    }
  })
    .then(() => {
      fetch()
      ElMessage.success(message)
    })
    .catch(() => {})
}

/**
 * @param {Number} timelong 时间
 * @param {String} format 格式类型
 * @description 时间转换格式方法
 * */
export const formatDateTime = (timelong: any, format = 'YYYY-MM-DD') => {
  if (!timelong) return ''
  function format2n(val) {
    return val < 10 ? '0' + '' + val : val
  }
  const date = new Date(timelong)
  const year = date.getFullYear() + ''
  const month = format2n(date.getMonth() + 1) + ''
  const day = format2n(date.getDate()) + ''
  const hour = format2n(date.getHours()) + ''
  const minute = format2n(date.getMinutes()) + ''
  const second = format2n(date.getSeconds()) + ''
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

/**
 * @descripting 轮询功能
 * @param {Function} callback 回调事件
 * @param {Number} interval 轮询间隔时间
 */
export const pollingHttp = (callback, interval = 2000) => {
  let timer,
    isStop = false
  const stop = () => {
    isStop = true
    clearTimeout(timer)
  }
  const start = async () => {
    isStop = false
    await loopEvent()
  }
  const loopEvent = async () => {
    try {
      await callback(stop)
    } catch (err) {
      throw new Error('轮询出错：', err)
    }
    if (isStop) return
    return (timer = setTimeout(loopEvent, interval))
  }
  return { start, stop }
}

/**
 * @param {Array} data 目标数组
 * @param {String} label 目标key值
 * @descripting 求数组内key相同放一个新数组内
 */
export const targetArrayFormatter = (data, label) => {
  if (!data || !data.length) return []
  const groups = data.reduce((acc, curr) => {
    if (!acc[curr[label]]) {
      acc[curr[label]] = []
    }
    acc[curr[label]].push(curr)
    return acc
  }, {})
  const result = Object.entries(groups)
    .sort((a, b) => (b[1] as []).length - (a[1] as []).length)
    .map(([key, value]) => ({ [key]: value }))
  return result
}

/**
 * @param {Array} data 目标数组
 * @param {String} pid 目标key值
 * @descripting 根据parentId将数据递归成树状
 */
export const formatToTree = (data, pid?, lable = 'parentId') => {
  if (!data?.length) return []
  return data
    .filter((item) => (!pid ? item[lable] === 0 : item[lable] === pid))
    .map((item) => {
      item.children = formatToTree(data, item.id)
      return item
    })
}

/**
 * @param {Array} formSearch 目标数组
 * @param {String} label 目标key值
 * @param {String} value 目标value值
 * @param {String} maxlength 目标value最大长度
 * @descripting input渲染长度校验
 */
export const handleOnInput = (formSearch, label, value, maxlength?) => {
  if (value && Number(value) < 0) {
    formSearch[label] = undefined
  }
  if (maxlength && value && value.length > maxlength) {
    formSearch[label] = formSearch[label].slice(0, maxlength)
  }
}

/* @param {Object} response 请求响应
 * @descripting 根据请求下载文件流
 */
export const downloadFile = (response) => {
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', decodeURIComponent(response.headers['content-disposition'].split('=')[1])) // 获取文件名并解码
  document.body.appendChild(link)
  link.click()
}

// 禁止用户防盗刷功能
export const antiTheftBrush = () => {
  if (window.location.origin !== 'https://afe.123fe.net') return false
  document.addEventListener('contextmenu', (event) => {
    alert('本站已禁止使用右键菜单，请合理浏览网站，谢谢！')
    event.preventDefault()
  })

  document.addEventListener('keydown', function (e) {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
      alert('本站已禁止使用右键菜单，请合理浏览网站，谢谢！')
      e.preventDefault()
    }
  })

  if (location.href.indexOf('view-source:') > -1) {
    alert('本站已禁止使用右键菜单，请合理浏览网站，谢谢！')
  }

  setInterval(function () {
    checkDebug()
  }, 3000)

  const checkDebug = function () {
    function doCheck(a) {
      if (('' + a / a)['length'] !== 1 || a % 20 === 0) {
        ;(function () {})['constructor']('debugger')()
      } else {
        ;(function () {})['constructor']('debugger')()
      }
      doCheck(++a)
    }
    try {
      doCheck(0)
    } catch (err) {
      // 静默处理错误，避免控制台输出
    }
  }
  checkDebug()
}

export const formatTimeAgo = (timelong) => {
  const nowtime = new Date().getTime()
  const diffValue = Math.abs(nowtime - timelong)
  const targetDate = new Date(timelong)
  const nowDate = new Date(nowtime)
  const isSameYear = nowDate.getFullYear() === targetDate.getFullYear()

  if (diffValue < 864e5) {
    return '今天'
  } else if (diffValue < 1728e5) {
    return '昨天'
  } else if (diffValue < 2592e5) {
    return '三天内'
  } else if (isSameYear) {
    return formatDateTime(timelong, 'MM-DD')
  } else {
    return formatDateTime(timelong, 'YYYY-MM-DD')
  }
}

export const formatMonthOrYear = (inputNumber) => {
  if (inputNumber >= 1 && inputNumber < 12) {
    return inputNumber + '个月'
  } else if (inputNumber % 12 === 0 && inputNumber < 1200) {
    return inputNumber / 12 + '年'
  } else if (inputNumber >= 1200) {
    return '终身'
  }
}

/**
 * 计算两个日期之间的年、月差值，并智能返回格式
 * @param {Date} startDate 开始日期
 * @param {Date} endDate 结束日期
 * @returns {string} 返回格式：不足1年返回"X个月"，超过1年返回"X年Y个月"
 */
export function getDateDiffSmart(startDate, endDate) {
  startDate = new Date(startDate)
  endDate = new Date(endDate)
  if (startDate > endDate) {
    ;[startDate, endDate] = [endDate, startDate] // 交换日期
  }
  console.log(startDate, endDate)
  let years = endDate.getFullYear() - startDate.getFullYear()
  let months = endDate.getMonth() - startDate.getMonth()
  if (months < 0) {
    years--
    months += 12
  }
  if (years === 0) {
    return months + '个月'
  } else {
    return years + '年'
  }
}

export const SearchList = (obj: any, data: any[]) => {
  const queryColumns = ['name', 'key']
  const loop = (item: any) =>
    Object.keys(obj).every((key) => {
      if (!obj[key]) return true
      if (key === 'query') {
        return obj.query.split('\n').some((qStr) => queryColumns.some((column) => item[column]?.toString().includes(qStr)))
      }
      return item[key] === obj[key]
    })

  return data.filter(loop)
}
