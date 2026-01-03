<script setup lang="ts">
import { computed } from "vue";
import { Pencil, Trash2, Calendar } from "lucide-vue-next";
import type { Item } from "../types";

const props = defineProps<{
	item: Item;
}>();

defineEmits<{
	(e: "edit", item: Item): void;
	(e: "remove", item: Item): void;
}>();

const isOverdue = computed(() => {
	if (!props.item.dueDate) return false;
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const dueDate = new Date(props.item.dueDate);
	dueDate.setHours(0, 0, 0, 0);
	return dueDate < today;
});

const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
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
	<div class="item-card">
		<div class="item-info">
			<h3 class="item-name">{{ item.name }}</h3>
			<p class="item-desc">{{ item.description }}</p>
			<div v-if="item.tags && item.tags.length > 0" class="item-tags">
				<span v-for="tag in item.tags" :key="tag" class="item-tag tag-label">{{ tag }}</span>
				<span v-if="item.category" class="item-category tag-label">{{ item.category }}</span>
				<span v-if="item.priority" class="tag-label" :class="getPriorityClass(item.priority)">{{ item.priority }}</span>
			</div>
			<div v-if="item.dueDate" class="item-due-date tag-label" :class="{ 'overdue': isOverdue }">
				<Calendar :size="14" />
				<span>{{ formatDate(item.dueDate) }}</span>
				<span v-if="isOverdue" class="overdue-badge">Atrasado</span>
			</div>
		</div>
		<div class="item-actions">
			<button 
				class="btn btn-ghost btn-icon" 
				@click="$emit('edit', item)"
				title="Editar item"
			>
				<Pencil :size="18" />
			</button>
			<button 
				class="btn btn-danger btn-icon" 
				@click="$emit('remove', item)"
				title="Remover item"
			>
				<Trash2 :size="18" />
			</button>
		</div>
	</div>
</template>

<style scoped>
.item-card {
	background: var(--card-bg);
	backdrop-filter: blur(12px);
	border: 1px solid var(--glass-border);
	border-radius: 16px;
	padding: 1.5rem;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	gap: 1.5rem;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	box-shadow: var(--shadow-sm);
	animation: slideUp 0.5s ease backwards;
}

.item-card:hover {
	border-color: var(--primary);
	transform: translateY(-4px);
	background: var(--hover-bg);
	box-shadow: var(--shadow-md);
}

.item-info {
	flex-grow: 1;
}

.item-name {
	font-size: 1.25rem;
	font-weight: 600;
	margin-bottom: 0.25rem;
	margin-top: 0.5rem;
}

.item-desc {
	color: var(--text-muted);
	font-size: 0.9rem;
}

.item-actions {
	display: flex;
	gap: 0.75rem;
}

.item-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.4rem;
	margin-top: 0.5rem;
}

.item-tag {
	background: var(--primary);
}

.item-due-date {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	margin-top: 0.5rem;
	font-size: 0.8rem;
	color: var(--text-muted);
}

.item-due-date.overdue {
	color: #ff4d4f;
}

.overdue-badge {
	padding: 0.2rem 0.5rem;
	background: #ff4d4f;
	color: white;
	border-radius: 8px;
	font-size: 0.7rem;
	font-weight: 600;
	text-transform: uppercase;
}

.item-category {
	background: var(--secondary);
}

.tag-label {
	padding: 0.3rem 0.7rem;
	color: white;
	border-radius: 10px;
	font-size: 0.75rem;
	font-weight: 500;
	width: fit-content;
}

.priority-low {
	background: #10b981; /* Emerald 500 */
}

.priority-medium {
	background: #f59e0b; /* Amber 500 */
}

.priority-high {
	background: #ef4444; /* Red 500 */
}

.priority-default {
	background: #64748b; /* Slate 500 */
}

</style>
