<script setup>
import { ref, onMounted } from "vue";
import AppHeader from "./components/AppHeader.vue";
import ItemCard from "./components/ItemCard.vue";
import ItemModal from "./components/ItemModal.vue";
import { apiService } from "./services/api";

const items = ref([]);
const isLoading = ref(false);
const isModalOpen = ref(false);
const itemToEdit = ref(null);

const loadItems = async () => {
	isLoading.value = true;
	try {
		const response = await apiService.getItems({ limit: 5 });
		items.value = response.data;
	} catch (error) {
		console.error("Erro ao carregar itens:", error);
	} finally {
		isLoading.value = false;
	}
};

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
	<div id="app">
		<AppHeader @add="openModal" />

		<main>
			<!-- if loading -->
			<!-- else if items.length > 0 -->
			<!-- else -->
			<div v-if="isLoading" class="loading-overlay">
				<!-- spinner -->
				<div class="spinner"></div>	
			</div>
			<div v-else-if="items.length > 0" class="items-list">
				<h3>Total de itens exibidos: {{ items.length }}</h3>
				
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
			<!-- end if -->
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
#app {
	max-width: 800px;
	margin: 0 auto;
	padding: 3rem 1rem;
}

main {
	position: relative;
	min-height: 200px;
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
	position: fixed;
	inset: 0;
	background: rgba(15, 23, 42, 0.7);
	backdrop-filter: blur(8px);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 9999;
}

.spinner {
	border: 4px solid var(--glass-border);
	border-top-color: var(--primary);
	border-radius: 50%;
	width: 2.5rem;
	height: 2.5rem;
	animation: spin 0.8s linear infinite;
}
</style>
