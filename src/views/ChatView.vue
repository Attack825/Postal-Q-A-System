<script setup lang="ts">
import { ref } from 'vue'
import { apiService } from '@/services/api'
import type { ChatMessage } from '@/services/api'
import { ElMessage } from 'element-plus'
import { marked, type MarkedOptions } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import { useChatStore } from '@/stores/chat'
import { knowledgeBaseService } from '@/services/knowledgeBase'

const chatStore = useChatStore()

// 配置 marked 用于渲染markdown
marked.setOptions({
  highlight: function (code: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  },
  breaks: true,
  gfm: true,
} as MarkedOptions)

/**
 * 聊天消息
 */
const userInput = ref('')
const isLoading = ref(false)

/**
 * 发送消息, 并获取回复
 */
const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  const userMessage: ChatMessage = {
    role: 'user',
    content: userInput.value,
  }

  chatStore.addMessage(userMessage)
  const currentInput = userInput.value
  userInput.value = ''

  isLoading.value = true
  chatStore.setCurrentResponse('')

  // 添加一个空的助手消息，用于流式更新
  chatStore.addMessage({
    role: 'assistant',
    content: '',
  })

  try {
    // 检索相关知识
    const knowledgeItems = await knowledgeBaseService.searchKnowledge(currentInput)
    const knowledgePrompt = knowledgeBaseService.formatKnowledgeAsPrompt(knowledgeItems)

    // 构建系统消息
    const systemMessage: ChatMessage = {
      role: 'system',
      content:
        '你是一个专业的物流顾问，请根据提供的知识回答问题。' +
        (knowledgePrompt ? '\n\n' + knowledgePrompt : ''),
    }

    // 构建完整的消息历史
    const messagesWithKnowledge = [systemMessage, ...chatStore.messages]

    await apiService.streamChatCompletion(messagesWithKnowledge, (chunk) => {
      chatStore.setCurrentResponse(chatStore.currentResponse + chunk)
      chatStore.updateLastMessage(chatStore.currentResponse)
    })
  } catch {
    ElMessage.error('发送消息失败，请重试')
    chatStore.messages = chatStore.messages.filter((msg) => msg.content !== currentInput)
  } finally {
    isLoading.value = false
    chatStore.setCurrentResponse('')
  }
}

/**
 * 处理文件上传
 * @param event 事件
 */
const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    const file = input.files[0]
    // 这里可以处理文件上传逻辑
    console.log('Selected file:', file.name)
  }
}

/**
 * 自动调整文本框高度
 * @param event 输入事件
 */
const autoResize = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement
  const maxHeight = 150 // 最大高度

  // 重置高度以获取正确的 scrollHeight
  textarea.style.height = 'auto'

  // 计算新高度，但不超过最大高度
  const newHeight = Math.min(textarea.scrollHeight, maxHeight)
  textarea.style.height = newHeight + 'px'

  // 如果内容超过最大高度，启用滚动
  textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden'
}

/**
 * 处理键盘事件:
 * - 如果是 Shift + Enter，允许换行
 * - 如果是单独的 Enter，阻止默认换行并发送消息
 * @param event 键盘事件
 *
 */
const handleKeydown = (event: KeyboardEvent) => {
  // 如果是 Shift + Enter，允许换行
  if (event.key === 'Enter' && event.shiftKey) {
    return
  }

  // 如果是单独的 Enter，阻止默认换行并发送消息
  if (event.key === 'Enter') {
    event.preventDefault()
    sendMessage()
  }
}

/**
 * 渲染 Markdown 内容
 */
const renderMarkdown = (content: string) => {
  return marked(content)
}
</script>

<template>
  <div class="chat-container">
    <div class="messages-container">
      <div
        v-for="(message, index) in chatStore.messages"
        :key="index"
        :class="['message', message.role]"
      >
        <div
          class="message-content markdown-body"
          v-html="message.role === 'assistant' ? renderMarkdown(message.content) : message.content"
        ></div>
      </div>
    </div>

    <div class="input-container">
      <div class="input-wrapper">
        <textarea
          v-model="userInput"
          :disabled="isLoading"
          placeholder="输入消息... (Shift + Enter 换行)"
          @keydown="handleKeydown"
          @input="autoResize"
          rows="1"
          class="message-input"
        ></textarea>
        <div class="actions">
          <label class="file-upload" :class="{ disabled: isLoading }">
            <input type="file" @change="handleFileUpload" class="hidden" :disabled="isLoading" />
            <font-awesome-icon :icon="['fas', 'arrow-up-from-bracket']" />
          </label>

          <button @click="sendMessage" class="send-button" :disabled="isLoading">
            <font-awesome-icon
              :icon="['fas', isLoading ? 'fa-spinner' : 'paper-plane']"
              :class="{ 'fa-spin': isLoading }"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--main-bg);
  padding: 0;
  margin: 0;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  /* 自定义滚动条样式 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.messages-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.message {
  max-width: 85%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  line-height: 1.5;
  font-size: 0.95rem;
}

.message.user {
  align-self: flex-end;
  background-color: var(--primary-color);
  color: white;
  margin-left: 1rem;
}

.message.assistant {
  align-self: flex-start;
  background-color: #374151;
  color: white;
  margin-right: 1rem;
}

.input-container {
  padding: 0.75rem;
  background-color: var(--main-bg);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.input-wrapper {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
  background-color: #374151;
  border-radius: 0.5rem;
  padding: 0.5rem;
}

.message-input {
  flex: 1;
  background-color: transparent;
  border: none;
  padding: 0.5rem;
  color: white;
  resize: none;
  outline: none;
  min-height: 24px;
  max-height: 120px;
  line-height: 1.5;
  box-sizing: border-box;
  display: block;
  width: 100%;
  font-family: inherit;
  font-size: 0.95rem;
}

.message-input::-webkit-scrollbar {
  width: 4px;
}

.message-input::-webkit-scrollbar-track {
  background: transparent;
}

.message-input::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.file-upload {
  cursor: pointer;
  padding: 0.5rem;
  color: var(--text-secondary);
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-upload:hover {
  color: var(--text-primary);
}

.hidden {
  display: none;
}

.send-button {
  padding: 0.5rem;
  background-color: transparent;
  color: var(--primary-color);
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.send-button:hover {
  color: #1d4ed8;
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.message-content {
  line-height: 1.6;
  word-break: break-word;
}

.message-content :deep(pre) {
  background-color: #1f2937;
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 0.75rem 0;
}

.message-content :deep(code) {
  font-family: 'Fira Code', monospace;
  font-size: 0.85em;
}

.message-content :deep(p) {
  margin: 0.5em 0;
}

.message-content :deep(ul),
.message-content :deep(ol) {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.message-content :deep(blockquote) {
  border-left: 4px solid var(--primary-color);
  margin: 0.75em 0;
  padding-left: 1em;
  color: var(--text-secondary);
}

.message-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 0.75em 0;
  font-size: 0.9em;
}

.message-content :deep(th),
.message-content :deep(td) {
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5em;
}

.message-content :deep(th) {
  background-color: rgba(255, 255, 255, 0.05);
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .message {
    max-width: 90%;
    padding: 0.5rem;
    font-size: 0.9rem;
  }

  .message.user {
    margin-left: 0.5rem;
  }

  .message.assistant {
    margin-right: 0.5rem;
  }

  .input-container {
    padding: 0.5rem;
  }

  .message-input {
    font-size: 0.9rem;
    max-height: 100px;
  }

  .message-content :deep(pre) {
    padding: 0.5rem;
  }

  .message-content :deep(code) {
    font-size: 0.8em;
  }

  .message-content :deep(table) {
    font-size: 0.8em;
  }
}

@media screen and (max-width: 480px) {
  .message {
    max-width: 95%;
    padding: 0.4rem;
    font-size: 0.85rem;
  }

  .input-wrapper {
    padding: 0.4rem;
  }

  .message-input {
    font-size: 0.85rem;
    max-height: 80px;
  }

  .actions {
    gap: 0.3rem;
  }

  .file-upload,
  .send-button {
    padding: 0.4rem;
  }
}
</style>
