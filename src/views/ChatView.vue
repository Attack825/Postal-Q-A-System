<script setup lang="ts">
import { ref } from 'vue'

const messages = ref([
  {
    role: 'assistant',
    content: '你好！我是AI助手，有什么我可以帮你的吗？'
  }
])

const userInput = ref('')

const sendMessage = () => {
  if (!userInput.value.trim()) return
  
  messages.value.push({
    role: 'user',
    content: userInput.value
  })
  
  // 这里后续可以添加实际的API调用
  messages.value.push({
    role: 'assistant',
    content: '这是一个模拟的回复消息。在实际应用中，这里应该调用AI API获取响应。'
  })
  
  userInput.value = ''
}
</script>

<template>
  <div class="chat-container">
    <div class="messages-container">
      <div v-for="(message, index) in messages" 
           :key="index" 
           :class="['message', message.role]">
        <div class="message-content">
          {{ message.content }}
        </div>
      </div>
    </div>
    
    <div class="input-container">
      <textarea
        v-model="userInput"
        placeholder="输入消息..."
        @keydown.enter.prevent="sendMessage"
        rows="1"
        class="message-input"
      ></textarea>
      <button @click="sendMessage" class="send-button">
        发送
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  height: calc(100vh - 4rem);
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
  background-color: #1a1a1a;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 1rem;
}

.message-input {
  flex: 1;
  background-color: #374151;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 0.75rem;
  color: white;
  resize: none;
  outline: none;
}

.message-input:focus {
  border-color: var(--primary-color);
}

.send-button {
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.send-button:hover {
  background-color: #1d4ed8;
}
</style> 