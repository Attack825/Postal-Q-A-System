<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <img alt="Logo" class="logo" src="@/assets/logo.svg" width="32" height="32" />
        <h1 class="sidebar-title">物流问答系统</h1>
      </div>

      <nav class="sidebar-nav">
        <RouterLink to="/" class="nav-item">
          <font-awesome-icon :icon="['fas', 'house']" />
          <span>首页</span>
        </RouterLink>
        <RouterLink to="/chat" class="nav-item">
          <font-awesome-icon :icon="['fas', 'comments']" />
          <span>聊天</span>
        </RouterLink>
        <RouterLink to="/settings" class="nav-item">
          <font-awesome-icon :icon="['fas', 'gear']" />
          <span>设置</span>
        </RouterLink>
      </nav>
    </aside>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
:root {
  --primary-color: #2563eb;
  --sidebar-bg: #111827;
  --main-bg: #1f2937;
  --text-primary: #ffffff;
  --text-secondary: #9ca3af;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--main-bg);
  color: var(--text-primary);
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    sans-serif;
}

.app-container {
  display: flex;
  min-height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.sidebar {
  width: 260px;
  background-color: var(--sidebar-bg);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.sidebar-nav {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.nav-item.router-link-active {
  background-color: var(--primary-color);
  color: var(--text-primary);
}

.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  height: 100vh;
}

.logo {
  width: 32px;
  height: 32px;
}
</style>
