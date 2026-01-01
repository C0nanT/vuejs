<script setup>
import { ref, onMounted, watch } from "vue";
import { useSettingsStore } from "../stores/settings";
import ItemCard from "../components/ItemCard.vue";
import ItemModal from "../components/ItemModal.vue";
import { apiService } from "../services/api";
import AppHeader from "../components/AppHeader.vue";

const settings = useSettingsStore();

const items = ref([]);
const isLoading = ref(false);
const isModalOpen = ref(false);
const itemToEdit = ref(null);

const loadItems = async () => {
	isLoading.value = true;
	try {
		const response = await apiService.getItems({ limit: settings.itemsPerPage });
		items.value = response.data;
	} catch (error) {
		console.error("Erro ao carregar itens:", error);
	} finally {
		isLoading.value = false;
	}
};

watch(() => settings.itemsPerPage, loadItems);

onMounted(loadItems);

const openModal = (item = null) => {
	itemToEdit.value = item ? { ...item } : null;
	isModalOpen.value = true;
};

const closeModal = () => {
	isModalOpen.value = false;
};

const saveItem = async (formData) => {
	isLoading.value = true;
	try {
		if (itemToEdit.value) {
			const updated = await apiService.updateItem(formData);
			const index = items.value.findIndex((i) => i.id === updated.id);
			if (index !== -1) {
				items.value[index] = updated;
			}
		} else {
			const newItem = await apiService.addItem(formData);
			items.value.unshift(newItem);
		}
		closeModal();
	} catch (error) {
		console.error("Erro ao salvar item:", error);
	} finally {
		isLoading.value = false;
	}
};

const removeItem = async (id) => {
	if (confirm("Tem certeza que deseja remover este item?")) {
		isLoading.value = true;
		try {
			await apiService.deleteItem(id);
			items.value = items.value.filter((item) => item.id !== id);
		} catch (error) {
			console.error("Erro ao remover item:", error);
		} finally {
			isLoading.value = false;
		}
	}
};
</script>

<template>
	<div class="view-container">
		<AppHeader />
		<div class="view-header">
			<h2>Sua Lista de Itens</h2>
			<button class="btn btn-primary" @click="openModal()">
				+ Novo Item
			</button>
		</div>

		<main>
			<div v-if="isLoading" class="loading-overlay">
				<div class="spinner"></div>	
			</div>
			
			<div v-else-if="items.length > 0" class="items-list">
				<ItemCard 
					v-for="item in items" 
					:key="item.id" 
					:item="item"
					@edit="openModal"
					@remove="removeItem"
				/>
			</div>
			
			<div v-else class="empty-state">
				<p>Nenhum item encontrado. Adicione um novo para começar!</p>
			</div>
		</main>

		<ItemModal 
			:is-open="isModalOpen"
			:item-to-edit="itemToEdit"
			@close="closeModal"
			@save="saveItem"
		/>
	</div>
</template>

<style scoped>
.view-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
}

.view-header h2 {
	margin: 0;
	font-size: 1.5rem;
	color: var(--text-main);
}

.items-list {
	display: grid;
	gap: 1.5rem;
}

.empty-state {
	text-align: center;
	padding: 3rem 1.5rem;
	color: var(--text-muted);
	border: 2px dashed var(--glass-border);
	border-radius: 24px;
	background: var(--card-bg);
}

.loading-overlay {
	min-height: 200px;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
