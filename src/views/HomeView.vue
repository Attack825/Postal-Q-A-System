<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToChat = () => {
  router.push('/chat')
}
</script>

<template>
  <div class="home-container">
    <div class="hero-section">
      <h1>物流问答系统</h1>
      <p class="subtitle">基于大语言模型的智能对话助手</p>
      <button class="start-button" @click="navigateToChat">开始对话</button>
    </div>

    <div class="features-section">
      <h2>功能特点</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">💬</div>
          <h3>智能对话</h3>
          <p>支持自然语言交互，提供流畅的对话体验</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3>流式响应</h3>
          <p>实时显示 AI 回复，提供更自然的交互体验</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📝</div>
          <h3>Markdown 支持</h3>
          <p>支持代码高亮、表格、列表等丰富的内容展示</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">⚙️</div>
          <h3>灵活配置</h3>
          <p>支持自定义 API 配置，适配不同的模型服务</p>
        </div>
      </div>
    </div>

    <div class="getting-started">
      <h2>快速开始</h2>
      <ol class="steps">
        <li>点击上方"开始对话"按钮进入聊天界面</li>
        <li>在设置页面配置您的 API 密钥和模型参数</li>
        <li>开始与 AI 助手进行对话</li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero-section {
  text-align: center;
  padding: 4rem 0;
  margin-bottom: 4rem;
}

h1 {
  font-size: 3rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.5rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.start-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.start-button:hover {
  background-color: #1d4ed8;
}

.features-section {
  margin-bottom: 4rem;
}

h2 {
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 2rem;
  text-align: center;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: #374151;
  padding: 2rem;
  border-radius: 0.5rem;
  text-align: center;
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

h3 {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.getting-started {
  background-color: #374151;
  padding: 2rem;
  border-radius: 0.5rem;
}

.steps {
  color: var(--text-secondary);
  line-height: 1.8;
  padding-left: 2rem;
}

.steps li {
  margin-bottom: 1rem;
}
</style>
