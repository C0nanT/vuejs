<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Home, Settings as SettingsIcon, LayoutGrid, Sun, Moon } from "lucide-vue-next";
import { useSettingsStore } from "../stores/settings";

const settings = useSettingsStore();

const toggleTheme = (event: MouseEvent) => {
	const x = event.clientX;
	const y = event.clientY;
	
	const isSupported = (document as any).startViewTransition !== undefined;
	
	if (!isSupported) {
		settings.setTheme(settings.theme === "dark" ? "light" : "dark");
		return;
	}

	document.documentElement.style.setProperty("--x", `${x}px`);
	document.documentElement.style.setProperty("--y", `${y}px`);

	(document as any).startViewTransition(() => {
		settings.setTheme(settings.theme === "dark" ? "light" : "dark");
	});
};
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
			<div class="theme-switch-wrapper">
				<button 
					class="theme-toggle-btn" 
					@click="toggleTheme"
					:title="settings.theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'"
				>
					<component :is="settings.theme === 'dark' ? Sun : Moon" :size="20" />
					<span class="toggle-text">{{ settings.theme === 'dark' ? 'Modo Claro' : 'Modo Escuro' }}</span>
				</button>
			</div>
			<div class="version">v1.0.0</div>
		</div>
	</aside>
</template>


<style scoped>
.app-sidebar {
	width: 260px;
	height: 100vh;
	background: var(--sidebar-bg);
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
	background: var(--hover-bg);
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

.theme-switch-wrapper {
	margin-bottom: 1rem;
	padding: 0 0.5rem;
}

.theme-toggle-btn {
	width: 100%;
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 0.875rem 1rem;
	background: var(--toggle-bg);
	border: 1px solid var(--glass-border);
	border-radius: 12px;
	color: var(--text-main);
	cursor: pointer;
	transition: all 0.2s ease;
	font-weight: 500;
	font-family: inherit;
}

.theme-toggle-btn:hover {
	background: var(--hover-bg);
	border-color: var(--primary);
	transform: translateY(-2px);
	box-shadow: var(--shadow-sm);
}

@media (max-width: 900px) {
	.app-sidebar {
		width: 80px;
		height: 100vh;
		flex-direction: column;
	}
	
	.sidebar-header {
		padding: 1rem 0.75rem;
	}
	
	.logo-text, .nav-link span, .version, .toggle-text {
		display: none;
	}
	
	.sidebar-nav {
		flex-direction: column;
		padding: 0.5rem;
		gap: 0.25rem;
	}
	
	.nav-link, .theme-toggle-btn {
		justify-content: center;
		padding: 0.75rem;
		width: 48px;
		height: 48px;
		min-width: 48px;
		min-height: 48px;
	}
	
	.theme-switch-wrapper {
		padding: 0 0.25rem;
		margin-bottom: 0.5rem;
	}

	.logo {
		justify-content: center;
	}
	
	.sidebar-footer {
		padding: 0.75rem;
		border-top: 1px solid var(--glass-border);
	}
	
	.version {
		display: none;
	}
}

</style>
