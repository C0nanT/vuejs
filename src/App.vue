<script setup>
import { ref, reactive } from "vue";

// State
const items = ref([
	{
		id: 1,
		name: "Lorem",
		description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
	},
	{
		id: 2,
		name: "Ipsum",
		description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
	},
	{
		id: 3,
		name: "Dolor",
		description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
	},
	{
		id: 4,
		name: "Sit",
		description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
	},
]);

const isModalOpen = ref(false);
const isEditing = ref(false);
const form = reactive({
	id: null,
	name: "",
	description: "",
});

// Actions
const openModal = (item = null) => {
	if (item) {
		isEditing.value = true;
		form.id = item.id;
		form.name = item.name;
		form.description = item.description;
	} else {
		isEditing.value = false;
		form.id = Date.now();
		form.name = "";
		form.description = "";
	}
	isModalOpen.value = true;
};

const closeModal = () => {
	isModalOpen.value = false;
};

const saveItem = () => {
	if (!form.name || !form.description) return;

	if (isEditing.value) {
		const index = items.value.findIndex((i) => i.id === form.id);
		if (index !== -1) {
			items.value[index] = { ...form };
		}
	} else {
		items.value.push({ ...form });
	}
	closeModal();
};

const removeItem = (id) => {
	items.value = items.value.filter((item) => item.id !== id);
};
</script>

<template>
	<div id="app">
		<header>
			<h1>Vue Mastery</h1>
			<p class="subtitle">
				Explorando o poder da reatividade e templates
			</p>

			<div class="header-actions">
				<button class="btn btn-primary" @click="openModal()">
					<span>+</span> Adicionar
				</button>
			</div>
		</header>

		<main>
			<div v-if="items.length > 0" class="items-list">
				<h3>Total de itens: {{ items.length }}</h3>
				<div v-for="item in items" :key="item.id" class="item-card">
					<div class="item-info">
						<h3 class="item-name">{{ item.name }}</h3>
						<p class="item-desc">{{ item.description }}</p>
					</div>
					<div class="item-actions">
						<button class="btn btn-ghost" @click="openModal(item)">
							Editar
						</button>
						<button
							class="btn btn-danger"
							@click="removeItem(item.id)"
						>
							Remover
						</button>
					</div>
				</div>
			</div>

			<div v-else class="empty-state">
				<p>Nenhum item encontrado. Adicione um novo para começar!</p>
			</div>
		</main>

		<!-- Modal -->
		<div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
			<div class="modal-content">
				<h2 class="modal-title">
					{{ isEditing ? "Editar Item" : "Novo Item" }}
				</h2>

				<div class="form-group">
					<label>Nome</label>
					<input
						v-model="form.name"
						type="text"
						class="form-input"
						placeholder="Ex: Aprender Vite"
					/>
				</div>

				<div class="form-group">
					<label>Descrição</label>
					<textarea
						v-model="form.description"
						class="form-input"
						rows="3"
						placeholder="O que você vai fazer?"
					></textarea>
				</div>

				<div class="modal-footer">
					<button class="btn btn-ghost" @click="closeModal">
						Cancelar
					</button>
					<button class="btn btn-primary" @click="saveItem">
						{{ isEditing ? "Salvar Alterações" : "Adicionar Item" }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
