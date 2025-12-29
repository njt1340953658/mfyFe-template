import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCacheDataStore = defineStore('cache', () => {
  const cacheData = ref<any>({})

  const setCache = (current, label?) => {
    if (label) {
      return (cacheData.value[label] = current)
    }
    return (cacheData.value = current)
  }

  const getCache = (label?) => {
    if (label) {
      return cacheData.value[label]
    }
    return cacheData.value
  }

  const clearCache = (label?) => {
    if (label) {
      return delete cacheData.value[label]
    }
    return (cacheData.value = {})
  }

  return { cacheData, setCache, getCache, clearCache }
})
