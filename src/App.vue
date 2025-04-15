<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'

const isMobile = ref(false)
const isSidebarOpen = ref(false)

// 检查是否为移动设备
const checkIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

// 切换侧边栏状态
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

// 关闭侧边栏
const closeSidebar = () => {
  if (isMobile.value) {
    isSidebarOpen.value = false
  }
}

// 监听窗口大小变化
onMounted(() => {
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkIsMobile)
})
</script>

<template>
  <div class="app-container">
    <!-- 移动端菜单按钮 -->
    <button v-if="isMobile" class="menu-button" @click="toggleSidebar">
      <font-awesome-icon :icon="['fas', 'bars']" />
    </button>

    <!-- 侧边栏遮罩 -->
    <div v-if="isMobile && isSidebarOpen" class="sidebar-overlay" @click="closeSidebar"></div>

    <!-- 侧边栏 -->
    <aside class="sidebar" :class="{ 'sidebar-mobile': isMobile, 'sidebar-open': isSidebarOpen }">
      <div class="sidebar-header">
        <img alt="Logo" class="logo" src="@/assets/logo.svg" width="32" height="32" />
        <h1 class="sidebar-title">物流问答系统</h1>
        <button v-if="isMobile" class="close-button" @click="closeSidebar">
          <font-awesome-icon :icon="['fas', 'xmark']" />
        </button>
      </div>

      <nav class="sidebar-nav">
        <RouterLink to="/" class="nav-item" @click="closeSidebar">
          <font-awesome-icon :icon="['fas', 'house']" />
          <span>首页</span>
        </RouterLink>
        <RouterLink to="/chat" class="nav-item" @click="closeSidebar">
          <font-awesome-icon :icon="['fas', 'comments']" />
          <span>聊天</span>
        </RouterLink>
        <RouterLink to="/settings" class="nav-item" @click="closeSidebar">
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
  transition: transform 0.3s ease;
  z-index: 1000;
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
  flex: 1;
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
  transition: margin-left 0.3s ease;
}

.logo {
  width: 32px;
  height: 32px;
}

/* 移动端样式 */
.menu-button {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1001;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.close-button {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-mobile {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  transform: translateX(-100%);
}

.sidebar-open {
  transform: translateX(0);
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .main-content {
    padding: 1rem;
    margin-left: 0;
  }

  .sidebar {
    width: 240px;
  }

  .sidebar-title {
    font-size: 1.1rem;
  }

  .nav-item {
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }
}

@media screen and (max-width: 480px) {
  .main-content {
    padding: 0.75rem;
  }

  .sidebar {
    width: 220px;
  }

  .sidebar-title {
    font-size: 1rem;
  }

  .nav-item {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }

  .menu-button {
    top: 0.75rem;
    left: 0.75rem;
    width: 36px;
    height: 36px;
  }
}
</style>
