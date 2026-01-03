import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiService } from '../services/api'

export type Theme = 'dark' | 'light';

export const useSettingsStore = defineStore('settings', () => {
  const userName = ref("Guest");
  const theme = ref<Theme>("dark");
  const itemsPerPage = ref(5);

  // Initialize theme attribute
  document.documentElement.setAttribute("data-theme", theme.value);

  // Fetch settings from API
  const fetchSettings = async () => {
    try {
      const settings = await apiService.getSettings();
      userName.value = settings.userName;
      theme.value = settings.theme as Theme;
      itemsPerPage.value = settings.itemsPerPage;
      document.documentElement.setAttribute("data-theme", theme.value);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      // Fallback to localStorage if API fails
      userName.value = localStorage.getItem("userName") || "Guest";
      theme.value = (localStorage.getItem("theme") as Theme) || "dark";
      itemsPerPage.value = parseInt(localStorage.getItem("itemsPerPage") || "5");
      document.documentElement.setAttribute("data-theme", theme.value);
    }
  };

  const updateUserName = async (newName: string) => {
    userName.value = newName;
    try {
      await apiService.updateSettings({ userName: newName, theme: theme.value, itemsPerPage: itemsPerPage.value });
    } catch (error) {
      console.error('Failed to save userName:', error);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    theme.value = newTheme
    document.documentElement.setAttribute('data-theme', newTheme)
    try {
      await apiService.updateSettings({ userName: userName.value, theme: newTheme, itemsPerPage: itemsPerPage.value });
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  }

  const setItemsPerPage = async (count: number | string) => {
    const value = typeof count === "string" ? parseInt(count) : count;
	itemsPerPage.value = value;
    try {
      await apiService.updateSettings({ userName: userName.value, theme: theme.value, itemsPerPage: value });
    } catch (error) {
      console.error('Failed to save itemsPerPage:', error);
    }
  }

  // Fetch settings on store creation
  fetchSettings();

  return { 
    userName, 
    theme, 
    itemsPerPage, 
    updateUserName, 
    setTheme, 
    setItemsPerPage,
    fetchSettings
  }
})
