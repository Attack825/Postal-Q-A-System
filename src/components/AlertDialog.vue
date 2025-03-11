<script setup lang="ts">
import { ref, defineExpose } from 'vue'

const isVisible = ref(false)
const title = ref('提示')
const message = ref('这是一条提示信息')
const confirmText = ref('确定')
const cancelText = ref('取消')
const showCancelButton = ref(false)

const emit = defineEmits(['close', 'confirm'])

const open = (options?: {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  showCancelButton?: boolean
}) => {
  if (options) {
    title.value = options.title || '提示'
    message.value = options.message || '这是一条提示信息'
    confirmText.value = options.confirmText || '确定'
    cancelText.value = options.cancelText || '取消'
    showCancelButton.value = options.showCancelButton || false
  }
  isVisible.value = true
}

const close = () => {
  isVisible.value = false
  emit('close')
}

const confirm = () => {
  close()
  emit('confirm')
}

const closeOnClickOutside = (event: Event) => {
  if (event.target === event.currentTarget) {
    close()
  }
}

defineExpose({
  open,
  close,
})
</script>

<template>
  <div v-if="isVisible" class="alert-dialog" @click="closeOnClickOutside">
    <div class="alert-dialog-content">
      <div class="alert-dialog-header">
        <span class="alert-dialog-title">{{ title }}</span>
        <button class="alert-dialog-close" @click="close">×</button>
      </div>
      <div class="alert-dialog-body">
        <p>{{ message }}</p>
      </div>
      <div class="alert-dialog-footer">
        <button class="alert-dialog-button" @click="confirm">{{ confirmText }}</button>
        <button v-if="showCancelButton" class="alert-dialog-button" @click="close">
          {{ cancelText }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alert-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.alert-dialog-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.alert-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.alert-dialog-title {
  font-size: 18px;
  font-weight: bold;
}

.alert-dialog-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.alert-dialog-body {
  margin-bottom: 10px;
}

.alert-dialog-footer {
  text-align: right;
}

.alert-dialog-button {
  background: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 8px;
}

.alert-dialog-button:hover {
  background: #45a049;
}
</style>
