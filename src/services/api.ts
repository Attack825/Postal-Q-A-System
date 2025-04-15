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

  private async validateMessages(messages: ChatMessage[]) {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('消息列表不能为空')
    }

    // 确保消息格式正确
    return messages.map((msg) => ({
      role: msg.role,
      content: String(msg.content),
    }))
  }

  async chatCompletion(messages: ChatMessage[]) {
    try {
      const settingsStore = this.getSettingsStore()
      const formattedMessages = await this.validateMessages(messages)

      const response = await axios.post(
        `${settingsStore.settings.baseUrl}/chat/completions`,
        JSON.stringify({
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

  async streamChatCompletion(messages: ChatMessage[], onChunk: (chunk: string) => void) {
    try {
      const settingsStore = this.getSettingsStore()
      const formattedMessages = await this.validateMessages(messages)

      const response = await fetch(`${settingsStore.settings.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settingsStore.settings.apiKey}`,
        },
        body: JSON.stringify({
          model: settingsStore.settings.model,
          messages: formattedMessages,
          temperature: Number(settingsStore.settings.temperature),
          stream: true,
        }),
      })

      if (!response.ok) {
        throw new Error('请求失败')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('无法读取响应流')
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.trim() === '') continue
          if (line === 'data: [DONE]') continue

          try {
            const data = JSON.parse(line.replace('data: ', ''))
            const chunk = data.choices[0]?.delta?.content || ''
            if (chunk) {
              onChunk(chunk)
            }
          } catch (e) {
            console.error('解析流数据失败:', e)
          }
        }
      }
    } catch (error) {
      console.error('流式请求失败:', error)
      throw error
    }
  }
}

export const apiService = new ApiService()
