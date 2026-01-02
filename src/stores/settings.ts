import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Theme = 'dark' | 'light';

export const useSettingsStore = defineStore('settings', () => {
  const userName = ref(localStorage.getItem("userName") || "Guest");
  const theme = ref<Theme>((localStorage.getItem("theme") as Theme) || "dark");
  const itemsPerPage = ref(
		parseInt(localStorage.getItem("itemsPerPage") || "5")
  );

  // Initialize theme attribute
  document.documentElement.setAttribute("data-theme", theme.value);

  const updateUserName = (newName: string) => {
    userName.value = newName
    localStorage.setItem("userName", newName);
  }

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem("theme", newTheme);
  }

  const setItemsPerPage = (count: number | string) => {
    const value = typeof count === "string" ? parseInt(count) : count;
	itemsPerPage.value = value;
	localStorage.setItem("itemsPerPage", value.toString());
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
