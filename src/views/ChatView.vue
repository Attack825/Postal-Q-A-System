<script setup lang="ts">
import { ref } from 'vue'
import { apiService } from '@/services/api'
import type { ChatMessage } from '@/services/api'
import { ElMessage } from 'element-plus'
import { marked, type MarkedOptions } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

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
const messages = ref<ChatMessage[]>([
  {
    role: 'assistant' as const,
    content: '你好！我是AI助手，有什么我可以帮你的吗？',
  },
])

/** 用户输入 */
const userInput = ref('')

const isLoading = ref(false)
const currentResponse = ref('')

/**
 * 发送消息, 并获取回复
 */
const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  const userMessage: ChatMessage = {
    role: 'user',
    content: userInput.value,
  }

  messages.value.push(userMessage)
  const currentInput = userInput.value
  userInput.value = ''

  isLoading.value = true
  currentResponse.value = ''

  // 添加一个空的助手消息，用于流式更新
  messages.value.push({
    role: 'assistant',
    content: '',
  })

  try {
    await apiService.streamChatCompletion([...messages.value], (chunk) => {
      currentResponse.value += chunk
      // 更新最后一条消息的内容
      messages.value[messages.value.length - 1].content = currentResponse.value
    })
  } catch {
    ElMessage.error('发送消息失败，请重试')
    messages.value = messages.value.filter((msg) => msg.content !== currentInput)
  } finally {
    isLoading.value = false
    currentResponse.value = ''
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
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
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
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  /* 自定义滚动条样式 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.messages-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.message {
  max-width: 80%;
  padding: 1rem;
  border-radius: 0.5rem;
  line-height: 1.5;
}

.message.user {
  align-self: flex-end;
  background-color: var(--primary-color);
  color: white;
}

.message.assistant {
  align-self: flex-start;
  background-color: #374151;
  color: white;
}

.input-container {
  padding: 1rem;
  background-color: var(--main-bg); /* 改为与chat-container相同的背景色 */
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
  resize: vertical; /* 允许垂直拖动 */
  outline: none;
  min-height: 24px;
  max-height: 150px;
  line-height: 1.5;
  box-sizing: border-box;
  display: block;
  width: 100%;
  font-family: inherit;
  font-size: inherit;
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
}

.message-content :deep(pre) {
  background-color: #1f2937;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.message-content :deep(code) {
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
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
  margin: 1em 0;
  padding-left: 1em;
  color: var(--text-secondary);
}

.message-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

.message-content :deep(th),
.message-content :deep(td) {
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5em;
}

.message-content :deep(th) {
  background-color: rgba(255, 255, 255, 0.05);
}
</style>
