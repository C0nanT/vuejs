<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useToast } from "vue-toastification";
import { useSettingsStore } from "../stores/settings";
import ItemCard from "../components/ItemCard.vue";
import ItemModal from "../components/ItemModal.vue";
import { apiService } from "../services/api";
import AppHeader from "../components/AppHeader.vue";
import type { Item, FormState } from "../types";
import ModalConfirm from "../components/ModalConfirm.vue";

const settings = useSettingsStore();
const toast = useToast();

const items = ref<Item[]>([]);
const isLoading = ref(false);
const isModalOpen = ref(false);
const itemToEdit = ref<Item | null>(null);
const itemToDelete = ref<Item | null>(null);
const isModalConfirmOpen = ref(false);

const loadItems = async () => {
	isLoading.value = true;
	try {
		const response = await apiService.getItems({ limit: settings.itemsPerPage });
		items.value = response.data;
	} catch (error) {
		console.error("Erro ao carregar itens:", error);
		toast.error("Erro ao carregar os itens. Tente novamente.");
	} finally {
		isLoading.value = false;
	}
};

watch(() => settings.itemsPerPage, loadItems);

onMounted(loadItems);

const openModal = (item: Item | null = null) => {
	itemToEdit.value = item ? { ...item } : null;
	isModalOpen.value = true;
};

const openModalConfirm = (item: Item) => {
	itemToDelete.value = item;
	isModalConfirmOpen.value = true;
};

const closeModal = () => {
	isModalOpen.value = false;
};

const closeModalConfirm = () => {
	isModalConfirmOpen.value = false;
	itemToDelete.value = null;
};

const saveItem = async (formData: FormState) => {
	isLoading.value = true;
	try {
		if (itemToEdit.value) {
			const updated = await apiService.updateItem({
				...itemToEdit.value,
				...formData
			} as Item);
			const index = items.value.findIndex((i) => i.id === updated.id);
			if (index !== -1) {
				items.value[index] = updated;
			}
			toast.success("Item atualizado com sucesso!");
		} else {
			const newItem = await apiService.addItem(formData);
			items.value.unshift(newItem);
			toast.success("Item criado com sucesso!");
		}
		closeModal();
	} catch (error) {
		console.error("Erro ao salvar item:", error);
		toast.error("Erro ao salvar o item. Verifique os dados.");
	} finally {
		isLoading.value = false
	}
};

const removeItem = async () => {
	if (!itemToDelete.value) return;

	const id = itemToDelete.value.id;
	isLoading.value = true;
	try {
		await apiService.deleteItem(id);
		items.value = items.value.filter((item) => item.id !== id);
		toast.success("Item removido com sucesso!");
	} catch (error) {
		console.error("Erro ao remover item:", error);
		toast.error("Erro ao remover o item.");
	} finally {
		isLoading.value = false;
		closeModalConfirm();
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
					@remove="openModalConfirm"
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

		<ModalConfirm 
			:is-open="isModalConfirmOpen"
			title="Remover Item"
			:itemName="`${itemToDelete?.name}`"
			@close="closeModalConfirm"
			@confirm="removeItem"
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
