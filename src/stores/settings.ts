import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Theme = 'dark' | 'light';

export const useSettingsStore = defineStore('settings', () => {
  const userName = ref('Conan')
  const theme = ref<Theme>('dark')
  const itemsPerPage = ref(5)

  const updateUserName = (newName: string) => {
    userName.value = newName
  }

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const setItemsPerPage = (count: number | string) => {
    itemsPerPage.value = typeof count === 'string' ? parseInt(count) : count
  }

  return { 
    userName, 
    theme, 
    itemsPerPage, 
    updateUserName, 
    setTheme, 
    setItemsPerPage 
  }
})
