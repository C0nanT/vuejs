<script setup lang="ts">
import { RouterView, RouterLink } from "vue-router";
import { Home, Settings as SettingsIcon } from "lucide-vue-next";
import AppHeader from "./components/AppHeader.vue";
</script>

<template>
	<div id="app">
		
		<nav class="main-nav">
			<RouterLink to="/" class="nav-link" active-class="active">
				<Home :size="20" />
				<span>Início</span>
			</RouterLink>
			<RouterLink to="/settings" class="nav-link" active-class="active">
				<SettingsIcon :size="20" />
				<span>Configurações</span>
			</RouterLink>
		</nav>
		
		<main class="page-content">
			<RouterView v-slot="{ Component }">
				<transition name="fade" mode="out-in">
					<component :is="Component" />
				</transition>
			</RouterView>
		</main>
	</div>
</template>

<style scoped>
#app {
	max-width: 800px;
	margin: 0 auto;
	padding: 2rem 1rem;
}

.main-nav {
	display: flex;
	gap: 1rem;
	margin-bottom: 3rem;
	background: var(--card-bg);
	padding: 0.5rem;
	border-radius: 16px;
	border: 1px solid var(--glass-border);
	width: fit-content;
}

.nav-link {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.75rem 1.25rem;
	border-radius: 12px;
	color: var(--text-muted);
	text-decoration: none;
	font-weight: 500;
	transition: all 0.3s ease;
}

.nav-link:hover {
	color: var(--text-main);
	background: rgba(255, 255, 255, 0.05);
}

.nav-link.active {
	background: var(--primary);
	color: white;
}

.page-content {
	position: relative;
	min-height: 400px;
}

/* Page Transitions */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
	opacity: 0;
	transform: translateY(10px);
}

.fade-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}
</style>
