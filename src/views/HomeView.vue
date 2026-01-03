<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useToast } from "vue-toastification";
import { useSettingsStore } from "../stores/settings";
import { Search, ArrowUpDown, ArrowUpAz, ArrowDownZa, ArrowUp, ArrowDown } from "lucide-vue-next";
import ItemCard from "../components/ItemCard.vue";
import ItemModal from "../components/ItemModal.vue";
import AppSelect from "../components/AppSelect.vue";
import { apiService } from "../services/api";
import AppHeader from "../components/AppHeader.vue";
import AppLoading from "../components/AppLoading.vue";
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

// Pagination State
const currentPage = ref(1);
const totalPages = ref(1);

// Search State
const searchQuery = ref("");
let debounceTimer: ReturnType<typeof setTimeout>;

// Sorting State
const sortBy = ref<keyof Item>("name");
const sortOrder = ref<"asc" | "desc">("asc");
const isSortDropdownOpen = ref(false);

const sortOptions = [
	{ label: "Nome", value: "name" },
	{ label: "Vencimento", value: "dueDate" },
	{ label: "Prioridade", value: "priority" },
	{ label: "Categoria", value: "category" },
];

const loadItems = async () => {
	isLoading.value = true;
	try {
		const response = await apiService.getItems({ 
			limit: settings.itemsPerPage,
			page: currentPage.value,
			search: searchQuery.value,
			sortBy: sortBy.value,
			order: sortOrder.value
		});
		items.value = response.data;
		totalPages.value = response.totalPages;
	} catch (error) {
		console.error("Erro ao carregar itens:", error);
		toast.error("Erro ao carregar os itens. Tente novamente.");
	} finally {
		isLoading.value = false;
	}
};

const changePage = (page: number) => {
	if (page < 1 || page > totalPages.value) return;
	currentPage.value = page;
	loadItems();
};

const toggleSortOrder = () => {
	sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
};

watch(searchQuery, () => {
	clearTimeout(debounceTimer);
	debounceTimer = setTimeout(() => {
		currentPage.value = 1;
		loadItems();
	}, 500);
});

watch([sortBy, sortOrder], () => {
	currentPage.value = 1;
	loadItems();
});

watch(() => settings.itemsPerPage, () => {
	currentPage.value = 1;
	loadItems();
});

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

const toggleDoneItem = async (item: Item) => {
	try {
		const updated = await apiService.updateItem({
			...item,
			done: !item.done
		});
		const index = items.value.findIndex((i) => i.id === updated.id);
		if (index !== -1) {
			items.value[index] = updated;
		}
		toast.success(item.done ? "Tarefa desmarcada!" : "Tarefa concluída!");
	} catch (error) {
		console.error("Erro ao atualizar tarefa:", error);
		toast.error("Erro ao atualizar tarefa.");
	}
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
			currentPage.value = 1;
			await loadItems();
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
		if (items.value.length === 1 && currentPage.value > 1) {
			currentPage.value--;
		}
		await loadItems();
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
			<div class="header-actions">
				<div class="search-bar">
					<Search :size="18" class="search-icon" />
					<input 
						v-model="searchQuery" 
						type="text" 
						placeholder="Pesquisar itens..." 
						class="search-input"
					/>
				</div>

				<div class="sort-controls" :class="{ 'has-open-dropdown': isSortDropdownOpen }">
					<AppSelect 
						v-model="sortBy" 
						:options="sortOptions"
						placeholder="Ordenar por"
						@toggle="isSortDropdownOpen = $event"
					/>
					<button 
						class="btn btn-icon" 
						@click="toggleSortOrder"
						:title="sortOrder === 'asc' ? 'Ordem Crescente' : 'Ordem Decrescente'"
					>
						<component :is="sortOrder === 'asc' ? ArrowUp : ArrowDown" :size="20" />
					</button>
				</div>

				<button class="btn btn-primary" @click="openModal()">
					+ Novo Item
				</button>
			</div>
		</div>

		<main>
			<div v-if="isLoading" class="loading-overlay">
				<AppLoading />
			</div>
			
			<template v-else-if="items.length > 0">
				<div class="items-list">
					<ItemCard 
						v-for="item in items" 
						:key="item.id" 
						:item="item"
						@edit="openModal"
						@remove="openModalConfirm"
						@toggleDone="toggleDoneItem"
					/>
				</div>

				<!-- Pagination Controls -->
				<div class="pagination" v-if="totalPages > 1">
					<button 
						class="btn btn-ghost" 
						:disabled="currentPage === 1"
						@click="changePage(currentPage - 1)"
					>
						Anterior
					</button>
					
					<div class="page-numbers">
						<button 
							v-for="p in totalPages" 
							:key="p"
							class="page-num"
							:class="{ active: p === currentPage }"
							@click="changePage(p)"
						>
							{{ p }}
						</button>
					</div>

					<button 
						class="btn btn-ghost" 
						:disabled="currentPage === totalPages"
						@click="changePage(currentPage + 1)"
					>
						Próximo
					</button>
				</div>
			</template>
			
			<div v-else class="empty-state">
				<p v-if="searchQuery">Nenhum item encontrado para <strong>{{ searchQuery }}</strong>.</p>
				<p v-else>Nenhum item encontrado. Adicione um novo para começar!</p>
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
	gap: 1.5rem;
}

.header-actions {
	display: flex;
	align-items: center;
	gap: 1rem;
	flex: 1;
	justify-content: flex-end;
	flex-wrap: wrap;
}

.sort-controls {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	min-width: 200px;
}

.btn-icon {
	width: 44px;
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--input-bg);
	border: 1px solid var(--glass-border);
	border-radius: 12px;
	color: var(--text-main);
	cursor: pointer;
	transition: all 0.2s ease;
}

.btn-icon:hover {
	border-color: var(--primary);
	background: var(--hover-bg);
	transform: translateY(-2px);
}

.search-bar {
	position: relative;
	max-width: 300px;
	width: 100%;
}

.search-icon {
	position: absolute;
	left: 1rem;
	top: 50%;
	transform: translateY(-50%);
	color: var(--text-muted);
	pointer-events: none;
}

.search-input {
	width: 100%;
	padding: 0.75rem 1rem 0.75rem 2.8rem;
	background: var(--input-bg);
	border: 1px solid var(--glass-border);
	border-radius: 12px;
	color: var(--text-main);
	font-size: 0.95rem;
	transition: all 0.2s ease;
}

.search-input:focus {
	outline: none;
	border-color: var(--primary);
	box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.btn-primary {
	flex-shrink: 0;
}

@media (max-width: 768px) {
	.view-header {
		flex-direction: column;
		align-items: stretch;
		gap: 1rem;
	}
	
	.header-actions {
		flex-direction: column;
		align-items: stretch;
	}
	
	.search-bar {
		max-width: none;
	}
}

.view-header h2 {
	margin: 0;
	font-size: 1.5rem;
	color: var(--text-main);
	white-space: nowrap;
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

/* Pagination Styles */
.pagination {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 1.5rem;
	margin-top: 3rem;
	padding: 1rem;
	background: var(--card-bg);
	border: 1px solid var(--glass-border);
	border-radius: 16px;
	backdrop-filter: blur(10px);
}

.page-numbers {
	display: flex;
	gap: 0.5rem;
}

.page-num {
	width: 36px;
	height: 36px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
	border: 1px solid var(--glass-border);
	background: rgba(255, 255, 255, 0.05);
	color: var(--text-main);
	cursor: pointer;
	transition: all 0.2s ease;
	font-weight: 500;
}

.page-num:hover {
	border-color: var(--primary);
	background: var(--hover-bg);
}

.page-num.active {
	background: var(--primary);
	color: white;
	border-color: var(--primary);
	box-shadow: 0 0 15px rgba(139, 92, 246, 0.3);
}

.btn:disabled {
	opacity: 0.4;
	cursor: not-allowed;
}
</style>
