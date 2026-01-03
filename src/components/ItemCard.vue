<script setup lang="ts">
import { computed } from "vue";
import { Pencil, Trash2, Calendar, CheckCircle } from "lucide-vue-next";
import type { Item } from "../types";
import { PRIORITY_MAP } from "../data/constants";

const props = defineProps<{
	item: Item;
}>();

const emit = defineEmits<{
	(e: "edit", item: Item): void;
	(e: "remove", item: Item): void;
	(e: "toggleDone", item: Item): void;
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

const getPriorityClass = (priority: number) => {
	switch (priority) {
		case PRIORITY_MAP.Baixa: return 'priority-low';
		case PRIORITY_MAP.Média: return 'priority-medium';
		case PRIORITY_MAP.Alta: return 'priority-high';
		default: return 'priority-default';
	}
};

const getPriorityLabel = (priority: number) => {
	const entry = Object.entries(PRIORITY_MAP).find(([key, value]) => value === priority);
	return entry ? entry[0] : 'Desconhecida';
};

const handleItemClick = (event: Event) => {
	if ((event.target as HTMLElement).closest('.item-actions')) return;
	emit('toggleDone', props.item);
};
</script>

<template>
	<div class="item-card" :class="{ 'item-done': item.done }" @click="handleItemClick">
		<div class="item-info">
			<div class="item-header">
				<span class="item-name">{{ item.name }}</span>
				<CheckCircle v-if="item.done" :size="20" class="check-icon" />
			</div>
			<p class="item-desc">{{ item.description }}</p>
			<div v-if="item.tags && item.tags.length > 0" class="item-tags">
				<span v-for="tag in item.tags" :key="tag" class="item-tag tag-label">{{ tag }}</span>
				<span v-if="item.category" class="item-category tag-label">{{ item.category }}</span>
				<span v-if="item.priority" class="tag-label" :class="getPriorityClass(item.priority)">{{ getPriorityLabel(item.priority) }}</span>
			</div>
			<div v-if="item.dueDate" class="item-due-date" :class="{ 'overdue': isOverdue }">
				<Calendar :size="14" />
				<span>{{ formatDate(item.dueDate) }}</span>
				<span v-if="isOverdue" class="overdue-badge">Atrasado</span>
			</div>
		</div>
		<div class="item-actions">
			<button 
				class="btn btn-ghost btn-icon" 
				@click.stop="emit('edit', item)"
				title="Editar item"
			>
				<Pencil :size="18" />
			</button>
			<button 
				class="btn btn-danger btn-icon" 
				@click.stop="emit('remove', item)"
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
	justify-content: space-between;
	align-items: center;
	gap: 1.5rem;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	box-shadow: var(--shadow-sm);
	animation: slideUp 0.5s ease backwards;
	cursor: pointer;
	width: 100%;
	box-sizing: border-box;
}

@media (max-width: 768px) {
	.item-card {
		padding: 1rem;
		gap: 1rem;
	}
}

@media (max-width: 640px) {
	.item-card {
		flex-direction: column;
		padding: 1rem;
		gap: 0.75rem;
		align-items: flex-start;
	}
}

.item-card:hover {
	border-color: var(--primary);
	transform: translateY(-4px);
	background: var(--hover-bg);
	box-shadow: var(--shadow-md);
}

.item-info {
	flex-grow: 1;
	min-width: 0;
	width: 100%;
}

@media (max-width: 640px) {
	.item-info {
		flex-grow: 1;
		width: 100%;
	}
}

.item-name {
	font-size: 1.25rem;
	font-weight: 600;
	margin-bottom: 0.25rem;
	margin-top: 0.5rem;
	word-break: break-word;
}

@media (max-width: 640px) {
	.item-name {
		font-size: 1.1rem;
		margin: 0;
	}
}

.item-desc {
	color: var(--text-muted);
	font-size: 0.9rem;
}

.item-actions {
	display: flex;
	gap: 0.75rem;
	flex-shrink: 0;
	align-self: flex-start;
}

@media (max-width: 640px) {
	.item-actions {
		align-self: flex-end;
		gap: 0.5rem;
		margin-top: -1.5rem;
	}
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
	margin-top: 1rem;
	font-size: 0.8rem;
	color: var(--text-muted);
	padding: 0.3rem 0.7rem;
	/* background: var(--input-bg); */
	border: 1px solid var(--glass-border);
	border-radius: 10px;
	font-weight: 500;
	width: fit-content;
}

.item-due-date.overdue {
	color: #ff4d4f;
	border-color: #e4515179;
	background: rgba(231, 78, 78, 0.172);
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

.item-card.item-done {
	border-color: #10b981;
	background: rgba(16, 185, 129, 0.1);
}

.item-header {
	display: flex;
	justify-content: flex-start;
	gap: 0.5rem;
	align-items: center;
	margin-bottom: 0.25rem;
}

.check-icon {
	color: #10b981;
	flex-shrink: 0;
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
