<script setup lang="ts">
import { useSettingsStore } from "../stores/settings";
import { User, Moon, Sun, List } from "lucide-vue-next";


const settings = useSettingsStore();

const toggleTheme = () => {
	const newTheme = settings.theme === "dark" ? "light" : "dark";
	settings.setTheme(newTheme);
};
</script>

<template>
	<div class="view-container">

		<div class="view-header">
			<h2>Configurações</h2>
		</div>

		<hr class="header-separator">

		<div class="settings-content">
			<!-- Perfil -->
			<section class="settings-section">
				<div class="section-icon">
					<User :size="20" />
				</div>
				<div class="section-content">
					<h3>Perfil</h3>
					<div class="form-group">
						<label>Nome do Usuário</label>
						<input 
							v-model="settings.userName" 
							type="text" 
							class="form-input"
							placeholder="Seu nome"
							style="margin-top: 0.25rem;"
						>
					</div>
				</div>
			</section>

			<!-- Preferências de Lista -->
			<section class="settings-section">
				<div class="section-icon">
					<List :size="20" />
				</div>
				<div class="section-content">
					<h3>Preferências de Interface</h3>
					<div class="form-group">
						<label>Itens por Página na Home</label>
						<select 
							v-model="settings.itemsPerPage" 
							class="form-input"
							style="margin-top: 0.25rem;"
						>
							<option :value="5">5 itens</option>
							<option :value="10">10 itens</option>
							<option :value="20">20 itens</option>
						</select>
					</div>
				</div>
			</section>

			<section class="settings-section">
				<div class="section-icon">
					<component :is="settings.theme === 'dark' ? Moon : Sun" :size="20" />
				</div>
				<div class="section-content">
					<h3>Aparência</h3>
					<div class="setting-row">
						<span>Tema Escuro</span>
						<button 
							class="theme-toggle" 
							:class="{ active: settings.theme === 'dark' }"
							@click="toggleTheme"
						>
							<div class="toggle-dot"></div>
						</button>
					</div>
				</div>
			</section>
		</div>
	</div>
</template>

<style scoped>
.view-header {
	margin-bottom: 1rem;
}

.settings-content {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

.settings-section {
	display: flex;
	gap: 1.5rem;
	padding: 2rem;
	background: var(--card-bg);
	border: 1px solid var(--glass-border);
	border-radius: 20px;
	backdrop-filter: blur(10px);
}

.section-icon {
	width: 40px;
	height: 40px;
	background: var(--primary);
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	flex-shrink: 0;
}

.section-content {
	flex-grow: 1;
}

.section-content h3 {
	margin: 0 0 1.5rem 0;
	font-size: 1.25rem;
}

.setting-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

/* Custom Toggle */
.theme-toggle {
	width: 50px;
	height: 26px;
	background: #334155;
	border-radius: 100px;
	border: none;
	cursor: pointer;
	position: relative;
	transition: background 0.3s;
}

.theme-toggle.active {
	background: var(--primary);
}

.toggle-dot {
	width: 20px;
	height: 20px;
	background: white;
	border-radius: 50%;
	position: absolute;
	top: 3px;
	left: 3px;
	transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-toggle.active .toggle-dot {
	transform: translateX(24px);
}
</style>
