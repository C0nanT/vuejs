<script setup lang="ts">
import { computed } from "vue";
import { useSettingsStore } from "../stores/settings";

const settings = useSettingsStore();

defineProps({
	title: {
		type: String,
		default: "Vue List",
	},
});

const greeting = computed(() => {
	const hour = new Date().getHours();
	if (hour >= 5 && hour < 12) return "Bom dia";
	if (hour >= 12 && hour < 18) return "Boa tarde";
	return "Boa noite";
});
</script>

<template>
	<header class="app-header">
		<div class="header-content">
			<h1>{{ title }}</h1>
			<p class="welcome-msg">{{ greeting }}, <span>{{ settings.userName }}</span>! 👋</p>
		</div>
	</header>
	<hr class="header-separator">
</template>

<style scoped>
.app-header {
	margin-bottom: 1rem;
}

.welcome-msg {
	color: var(--text-muted);
	font-size: 1.1rem;
	margin: 0;
}

.welcome-msg span {
	color: var(--primary);
	font-weight: 600;
}
</style>
