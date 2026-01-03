<script setup lang="ts">
import { reactive, watch, computed } from "vue";
import type { Item, FormState } from "../types";
import DatePicker from "./DatePicker.vue";
import { ALL_PRIORITIES, ALL_TAGS } from "../data/constants";

const props = defineProps<{
	isOpen: boolean;
	itemToEdit: Item | null;
}>();

const emit = defineEmits<{
	(e: "close"): void;
	(e: "save", form: FormState): void;
}>();

const form = reactive<FormState>({
	id: null,
	name: "",
	description: "",
	category: "Frontend",
	tags: [],
	priority: "Baixa",
});

const errors = reactive({
	name: "",
	description: "",
});

const touched = reactive({
	name: false,
	description: false,
});

// Watch for changes in itemToEdit to populate form
watch(
	() => props.itemToEdit,
	(newItem) => {
		errors.name = "";
		errors.description = "";
		touched.name = false;
		touched.description = false;
		if (newItem) {
			form.id = newItem.id;
			form.name = newItem.name;
			form.description = newItem.description;
			form.category = newItem.category;
			form.tags = newItem.tags || [];
			form.dueDate = newItem.dueDate || undefined;
		} else {
			form.id = Date.now();
			form.name = "";
			form.description = "";
			form.category = "Frontend";
			form.tags = [];
			form.dueDate = undefined;
		}
	},
	{ immediate: true }
);

const isFormValid = computed(() => {
	return form.name.length >= 3 && form.description.length >= 5;
});

const validateField = (field: string) => {
	if (field === 'name') {
		errors.name = form.name.length < 3 ? "O nome deve ter pelo menos 3 caracteres." : "";
	}
	if (field === 'description') {
		errors.description = form.description.length < 5 ? "A descrição deve ter pelo menos 5 caracteres." : "";
	}
};

// Real-time validation
watch(() => form.name, () => {
	if (touched.name) validateField('name');
});

watch(() => form.description, () => {
	if (touched.description) validateField('description');
});

const handleSave = () => {
	touched.name = true;
	touched.description = true;
	validateField('name');
	validateField('description');

	if (isFormValid.value) {
		emit("save", { ...form });
	}
};

const availableTags = ALL_TAGS;

const availablePriorities = ALL_PRIORITIES;

const toggleTag = (tag: string) => {
	const index = form.tags.indexOf(tag);
	if (index > -1) {
		form.tags.splice(index, 1);
	} else {
		form.tags.push(tag);
	}
};

const getPriorityClass = (priority: string) => {
	switch (priority.toLowerCase()) {
		case 'baixa': return 'priority-low';
		case 'média': return 'priority-medium';
		case 'alta': return 'priority-high';
		default: return 'priority-default';
	}
};
</script>

<template>
	<div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
		<div class="modal-content">
			<h2 class="modal-title">
				{{ itemToEdit ? "Editar Item" : "Novo Item" }}
			</h2>

			<div class="form-group">
				<label>Nome <small>(mín. 3 letras)</small></label>
				<input
					v-model="form.name"
					type="text"
					class="form-input"
					:class="{ 'input-error': errors.name }"
					placeholder="Ex: Aprender Vite"
					@blur="touched.name = true; validateField('name')"
				/>
				<span v-if="errors.name" class="error-message">{{ errors.name }}</span>
			</div>

			<div class="form-group">
				<label>Descrição <small>(mín. 5 letras)</small></label>
				<textarea
					v-model="form.description"
					class="form-input"
					:class="{ 'input-error': errors.description }"
					rows="3"
					placeholder="O que você vai fazer?"
					@blur="touched.description = true; validateField('description')"
				></textarea>
				<span v-if="errors.description" class="error-message">{{ errors.description }}</span>
			</div>

			<div class="form-group">
				<label>Tags</label>
				<div class="tags-container">
					<button
						v-for="tag in availableTags"
						:key="tag"
						type="button"
						class="tag-button"
						:class="{ 'tag-selected': form.tags.includes(tag) }"
						@click="toggleTag(tag)"
					>
						{{ tag }}
					</button>
				</div>
			</div>

			<div class="form-group">
				<label>Prioridade</label>
				<div class="tags-container">
					<button
						v-for="priority in availablePriorities"
						:key="priority"
						type="button"
						class="tag-button"
						:class="[
							{ 'tag-selected': form.priority === priority },
							form.priority === priority ? getPriorityClass(priority) : ''
						]"
						@click="form.priority = priority"
					>
						{{ priority }}
					</button>
				</div>
			</div>

			<div class="form-group">
				<label>Data Limite <small>(opcional)</small></label>
				<DatePicker
					v-model="form.dueDate"
					placeholder="Selecione uma data"
				/>
			</div>

			<div class="modal-footer">
				<button class="btn btn-ghost" @click="$emit('close')">
					Cancelar
				</button>
				<button 
					class="btn btn-primary" 
					:disabled="!isFormValid"
					@click="handleSave"
				>
					{{ itemToEdit ? "Salvar Alterações" : "Adicionar Item" }}
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.modal-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.8);
	backdrop-filter: blur(4px);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 100;
	animation: fadeIn 0.3s ease;
}

.modal-content {
	background: var(--input-bg);
	border: 1px solid var(--glass-border);
	padding: 2.5rem;
	border-radius: 24px;
	width: 90%;
	max-width: 500px;
	box-shadow: var(--shadow-lg);
	animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-title {
	font-size: 1.5rem;
	font-weight: 700;
	margin-bottom: 1.5rem;
}

.form-group {
	margin-bottom: 1.5rem;
}

.form-group label {
	display: block;
	margin-bottom: 0.5rem;
	font-size: 0.875rem;
	color: var(--text-muted);
}

.modal-footer {
	display: flex;
	justify-content: flex-end;
	gap: 1rem;
	margin-top: 2rem;
}

.input-error {
	border-color: #ff4d4f;
}
.error-message {
	color: #ff4d4f;
	font-size: 0.8rem;
	margin-top: 4px;
	display: block;
}
.btn-primary:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.tags-container {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	margin-bottom: 0.75rem;
}

.tag-button {
	padding: 0.4rem 0.8rem;
	border: 1px solid var(--glass-border);
	background: var(--input-bg);
	color: var(--text-muted);
	border-radius: 12px;
	cursor: pointer;
	font-size: 0.875rem;
	transition: all 0.2s;
}

.tag-button:hover {
	border-color: var(--primary);
	color: var(--primary);
}

.tag-button.tag-selected {
	background: var(--primary);
	color: white;
	border-color: var(--primary);
}

.selected-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.tag-chip {
	padding: 0.3rem 0.7rem;
	background: var(--primary);
	color: white;
	border-radius: 12px;
	font-size: 0.75rem;
	font-weight: 500;
}
.priority-low {
	background: #10b981 !important;
	border-color: #0caa76 !important;
}

.priority-medium {
	background: #f59e0b !important;
	border-color: #eb9706 !important;
}

.priority-high {
	background: #ef4444 !important;
	border-color: #e43c3c !important;
}

.priority-default {
	background: #64748b !important;
	border-color: #5a6980 !important;
}
</style>
