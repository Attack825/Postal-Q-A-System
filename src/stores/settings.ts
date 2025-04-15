import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // settings 的默认值
  // const settings = ref({
  //   baseUrl: 'https://api.openai.com/v1/engines',
  //   apiKey: '',
  //   model: 'gpt-3.5-turbo',
  //   temperature: 0.7,
  //   maxTokens: 2000,
  // })

  // xiaoai
  const settings = ref({
    baseUrl: 'https://xiaoai.plus/v1',
    apiKey: 'sk-FEQUUavLOinU753K5892E325564c4773A82304C89b0d65A5',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 2000,
  })

  // 保存设置到 localStorage,localStorage是浏览器提供的本地存储方案
  function saveSettings(newSettings: typeof settings.value) {
    settings.value = newSettings
    localStorage.setItem('settings', JSON.stringify(newSettings))
  }

  // 初始化时从 localStorage 加载设置
  function loadSettings() {
    const savedSettings = localStorage.getItem('settings')
    if (savedSettings) {
      settings.value = JSON.parse(savedSettings)
    }
  }

  return {
    settings,
    saveSettings,
    loadSettings,
  }
})
