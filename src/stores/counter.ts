import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 导出模块
export const useCounterStore = defineStore('counter', () => {
  // 模块中的响应式将自动被注入到store中
  // 属性
  const count = ref(0)
  // 简单计算的基本属性
  const doubleCount = computed(() => count.value * 2)
  // 函数操作
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
