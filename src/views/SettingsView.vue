<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useSettingsStore } from "../stores/settings";
import { User, List, SettingsIcon } from "lucide-vue-next";
import AppSelect from "../components/AppSelect.vue";

const settings = useSettingsStore();
const showSuccessBorder = ref(false);
const showSuccessInterface = ref(false);
const isInterfaceDropdownOpen = ref(false);
const localUserName = ref(settings.userName);

onMounted(async () => {
	await settings.fetchSettings();
	localUserName.value = settings.userName;
});

const saveUserName = async () => {
	if (localUserName.value !== settings.userName) {
		await settings.updateUserName(localUserName.value);
		showSuccessBorder.value = true;
		setTimeout(() => {
			showSuccessBorder.value = false;
		}, 2000);
	}
};

watch(() => settings.itemsPerPage, () => {
	settings.setItemsPerPage(settings.itemsPerPage);
	showSuccessInterface.value = true;
	setTimeout(() => {
		showSuccessInterface.value = false;
	}, 2000);
});

const itemsPerPageOptions = [
	{ label: "5 itens", value: 5 },
	{ label: "10 itens", value: 10 },
	{ label: "20 itens", value: 20 },
];
</script>


<template>
	<div class="view-container">
		<div class="view-header">
			<SettingsIcon :size="20" />
			<span class="view-title"><strong>Configurações</strong></span>
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
							v-model="localUserName" 
							@blur="saveUserName"
							type="text" 
							class="form-input"
							:class="{ 'input-success': showSuccessBorder }"
							placeholder="Seu nome"
							style="margin-top: 0.5rem;"
						>
					</div>
				</div>
			</section>

			<!-- Preferências de Lista -->
			<section class="settings-section" :class="{ 'has-open-dropdown': isInterfaceDropdownOpen }">
				<div class="section-icon">
					<List :size="20" />
				</div>
				<div class="section-content">
					<h3>Preferências de Interface</h3>
					<div class="form-group">
						<label>Itens por Página na Home</label>
						<AppSelect 
							v-model="settings.itemsPerPage" 
							:options="itemsPerPageOptions"
							:class="{ 'input-success': showSuccessInterface }"
							style="margin-top: 0.5rem;"
							@toggle="isInterfaceDropdownOpen = $event"
						/>
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
	position: relative;
	z-index: 1;
	width: 100%;
	box-sizing: border-box;
	overflow: visible;
}

.settings-section.has-open-dropdown {
	z-index: 50;
}

@media (max-width: 768px) {
	.settings-section {
		padding: 1.5rem;
		gap: 1rem;
	}
}

@media (max-width: 640px) {
	.settings-section {
		flex-direction: column;
		padding: 1rem;
		gap: 0.75rem;
	}
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

@media (max-width: 640px) {
	.section-icon {
		width: 36px;
		height: 36px;
	}
}

.section-content {
	flex-grow: 1;
	overflow: visible;
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
	background: var(--toggle-bg);
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

.view-title {
	font-size: 1.5rem;
	font-weight: 600;
	margin-left: 1rem;
}

.view-container {
	width: 100%;
	box-sizing: border-box;
}
</style>

