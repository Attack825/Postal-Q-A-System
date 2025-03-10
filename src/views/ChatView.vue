<script setup lang="ts">
import { ref } from 'vue'

const messages = ref([
  {
    role: 'assistant',
    content: '你好！我是AI助手，有什么我可以帮你的吗？',
  },
])

const userInput = ref('')

const sendMessage = () => {
  if (!userInput.value.trim()) return

  messages.value.push({
    role: 'user',
    content: userInput.value,
  })

  // 这里后续可以添加实际的API调用
  messages.value.push({
    role: 'assistant',
    content: '这是一个模拟的回复消息。在实际应用中，这里应该调用AI API获取响应。',
  })

  userInput.value = ''
}

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    const file = input.files[0]
    // 这里可以处理文件上传逻辑
    console.log('Selected file:', file.name)
  }
}

// 修改自动调整高度的功能
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
</script>

<template>
  <div class="chat-container">
    <div class="messages-container">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
        <div class="message-content" style="white-space: pre-wrap">
          {{ message.content }}
        </div>
      </div>
    </div>

    <div class="input-container">
      <div class="input-wrapper">
        <textarea
          v-model="userInput"
          placeholder="输入消息... (Shift + Enter 换行)"
          @keydown="handleKeydown"
          @input="autoResize"
          rows="1"
          class="message-input"
        ></textarea>
        <div class="actions">
          <label class="file-upload">
            <input type="file" @change="handleFileUpload" class="hidden" />
            <font-awesome-icon :icon="['fas', 'arrow-up-from-bracket']" />
          </label>

          <button @click="sendMessage" class="send-button">
            <font-awesome-icon :icon="['fas', 'paper-plane']" />
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
</style>
