<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Home, Settings as SettingsIcon, LayoutGrid } from "lucide-vue-next";
</script>

<template>
	<aside class="app-sidebar">
		<div class="sidebar-header">
			<div class="logo">
				<LayoutGrid :size="28" class="logo-icon" />
				<span class="logo-text">VueTestes</span>
			</div>
		</div>

		<nav class="sidebar-nav">
			<RouterLink to="/" class="nav-link" active-class="active">
				<Home :size="20" />
				<span>Início</span>
			</RouterLink>
			<RouterLink to="/settings" class="nav-link" active-class="active">
				<SettingsIcon :size="20" />
				<span>Configurações</span>
			</RouterLink>
		</nav>

		<div class="sidebar-footer">
			<div class="version">v1.0.0</div>
		</div>
	</aside>
</template>

<style scoped>
.app-sidebar {
	width: 260px;
	height: 100vh;
	background: rgba(15, 23, 42, 0.8);
	backdrop-filter: blur(20px);
	border-right: 1px solid var(--glass-border);
	display: flex;
	flex-direction: column;
	position: fixed;
	left: 0;
	top: 0;
	z-index: 50;
	transition: all 0.3s ease;
}

.sidebar-header {
	padding: 2.5rem 1.5rem;
}

.logo {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.logo-icon {
	color: var(--primary);
}

.logo-text {
	font-size: 1.25rem;
	font-weight: 700;
	letter-spacing: -0.025em;
	background: linear-gradient(to right, #c084fc, #6366f1);
	-webkit-background-clip: text;
	background-clip: text;
	-webkit-text-fill-color: transparent;
}

.sidebar-nav {
	flex: 1;
	padding: 0 1rem;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.nav-link {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 0.875rem 1rem;
	border-radius: 12px;
	color: var(--text-muted);
	text-decoration: none;
	font-weight: 500;
	transition: all 0.2s ease;
}

.nav-link:hover {
	color: var(--text-main);
	background: rgba(255, 255, 255, 0.05);
}

.nav-link.active {
	background: var(--primary);
	color: white;
	box-shadow: 0 10px 15px -3px rgba(139, 92, 246, 0.3);
}

.sidebar-footer {
	padding: 1.5rem;
	border-top: 1px solid var(--glass-border);
}

.version {
	font-size: 0.75rem;
	color: var(--text-muted);
	text-align: center;
}

@media (max-width: 768px) {
	.app-sidebar {
		width: 80px;
	}
	
	.logo-text, .nav-link span, .version {
		display: none;
	}
	
	.nav-link {
		justify-content: center;
		padding: 1rem;
	}
	
	.logo {
		justify-content: center;
	}
}
</style>
