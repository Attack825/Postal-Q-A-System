<script setup lang="ts">
import { onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { ElMessage } from 'element-plus'

const settingsStore = useSettingsStore()

const models = [
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'deepseek', label: 'DeepSeek' },
  { value: 'claude-3.5-sonnet', label: 'Claude 3.5' },
  { value: 'glm-4', label: 'GLM-4' },
]

// 组件挂载时加载设置
onMounted(() => {
  settingsStore.loadSettings()
})

const saveSettings = () => {
  settingsStore.saveSettings(settingsStore.settings)
  ElMessage.success('保存成功')
}
</script>

<template>
  <div class="settings-container">
    <h1>设置</h1>
    <div class="settings-group">
      <h2>API 配置</h2>

      <div class="setting-item">
        <label>API baseUrl</label>
        <input
          type="text"
          v-model="settingsStore.settings.baseUrl"
          placeholder="输入你的 API Endpoint"
        />
      </div>
      <div class="setting-item">
        <label>API Key</label>
        <input
          type="password"
          v-model="settingsStore.settings.apiKey"
          placeholder="输入你的 API Key"
        />
      </div>

      <div class="setting-item">
        <label>模型</label>
        <select v-model="settingsStore.settings.model">
          <option v-for="model in models" :key="model.value" :value="model.value">
            {{ model.label }}
          </option>
        </select>
      </div>

      <div class="setting-item">
        <label>Temperature ({{ settingsStore.settings.temperature }})</label>
        <input
          type="range"
          v-model="settingsStore.settings.temperature"
          min="0"
          max="2"
          step="0.1"
        />
      </div>

      <div class="setting-item">
        <label>最大 Tokens</label>
        <input type="number" v-model="settingsStore.settings.maxTokens" min="1" max="4096" />
      </div>
    </div>

    <button @click="saveSettings" class="save-button">保存设置</button>
  </div>
</template>

<style scoped>
.settings-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  margin-bottom: 2rem;
  color: var(--text-primary);
}

.settings-group {
  background-color: #374151;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

h2 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.setting-item {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

input,
select {
  width: 100%;
  padding: 0.75rem;
  background-color: #1f2937;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  color: var(--text-primary);
  outline: none;
}

input:focus,
select:focus {
  border-color: var(--primary-color);
}

input[type='range'] {
  padding: 0;
}

.save-button {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.save-button:hover {
  background-color: #1d4ed8;
}
</style>
