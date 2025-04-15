import { defineStore } from 'pinia'
import type { ChatMessage } from '@/services/api'

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [
      {
        role: 'assistant' as const,
        content: '你好！我是AI助手，有什么我可以帮你的吗？',
      },
    ] as ChatMessage[],
    currentResponse: '',
  }),

  actions: {
    addMessage(message: ChatMessage) {
      this.messages.push(message)
    },

    updateLastMessage(content: string) {
      if (this.messages.length > 0) {
        this.messages[this.messages.length - 1].content = content
      }
    },

    setCurrentResponse(content: string) {
      this.currentResponse = content
    },

    clearMessages() {
      this.messages = [
        {
          role: 'assistant' as const,
          content: '你好！我是AI助手，有什么我可以帮你的吗？',
        },
      ] as ChatMessage[]
      this.currentResponse = ''
    },
  },

  persist: [
    {
      key: 'chat-messages',
      storage: localStorage,
    },
  ],
})
