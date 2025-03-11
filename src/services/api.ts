import axios, { AxiosError } from 'axios'
import { useSettingsStore } from '@/stores/settings'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export class ApiService {
  private getSettingsStore() {
    return useSettingsStore()
  }

  async chatCompletion(messages: ChatMessage[]) {
    try {
      const settingsStore = this.getSettingsStore()

      // 验证消息格式
      if (!Array.isArray(messages) || messages.length === 0) {
        throw new Error('消息列表不能为空')
      }

      // 确保消息格式正确
      const formattedMessages = messages.map((msg) => ({
        role: msg.role,
        content: String(msg.content),
      }))

      const response = await axios.post(
        `${settingsStore.settings.baseUrl}/chat/completions`,
        JSON.stringify({
          // 将整个请求体序列化为 JSON 字符串
          model: settingsStore.settings.model,
          messages: formattedMessages,
          temperature: Number(settingsStore.settings.temperature),
          stream: false,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${settingsStore.settings.apiKey}`,
          },
        },
      )

      return response.data.choices[0].message.content
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('API Error:', error.response?.data)
        throw new Error(error.response?.data?.error?.message || '请求失败')
      }
      throw error
    }
  }
}

export const apiService = new ApiService()
