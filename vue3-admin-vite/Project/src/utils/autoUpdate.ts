/**
 * 自动更新检查器
 * 用于检查应用是否有新版本并提示刷新
 */
class AutoUpdateChecker {
  private checkUrl: string
  private checkInterval: number
  private timer: number | null = null

  constructor(checkUrl: string = '', checkInterval: number = 30000) {
    this.checkUrl = checkUrl
    this.checkInterval = checkInterval
  }

  /**
   * 立即检查更新
   */
  async checkNow(): Promise<boolean> {
    // 如果未配置检查URL，则不检查
    if (!this.checkUrl) {
      return false
    }

    try {
      const response = await fetch(this.checkUrl, {
        method: 'HEAD',
        cache: 'no-cache'
      })
      // 这里可以根据实际需求判断是否有更新
      // 简单示例：检查响应头中的版本信息
      return false
    } catch (error) {
      console.warn('检查更新失败:', error)
      return false
    }
  }

  /**
   * 开始定时检查
   */
  start(): void {
    if (this.timer) {
      this.stop()
    }
    this.timer = window.setInterval(() => {
      this.checkNow().then((hasUpdate) => {
        if (hasUpdate) {
          this.refreshApp()
        }
      })
    }, this.checkInterval)
  }

  /**
   * 停止检查
   */
  stop(): void {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  /**
   * 刷新应用
   */
  refreshApp(): void {
    window.location.reload()
  }
}

export default AutoUpdateChecker

