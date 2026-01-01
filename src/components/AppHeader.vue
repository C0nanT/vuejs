<script setup lang="ts">
import { useSettingsStore } from "../stores/settings";

const settings = useSettingsStore();

defineProps({
	title: {
		type: String,
		default: "Vue List",
	},
});
</script>

<template>
	<header class="app-header">
		<div class="header-content">
			<h1>{{ title }}</h1>
			<p class="welcome-msg">Olá, <span>{{ settings.userName }}</span>! 👋</p>
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
