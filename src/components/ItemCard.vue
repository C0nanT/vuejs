<script setup lang="ts">
import { Pencil, Trash2 } from "lucide-vue-next";
import type { Item } from "../types";

defineProps<{
	item: Item;
}>();

defineEmits<{
	(e: "edit", item: Item): void;
	(e: "remove", item: Item): void;
}>();
</script>

<template>
	<div class="item-card">
		<div class="item-info">
			<h3 class="item-name">{{ item.name }}</h3>
			<p class="item-desc">{{ item.description }}</p>
			<div v-if="item.tags && item.tags.length > 0" class="item-tags">
				<span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
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

.tag {
	padding: 0.25rem 0.6rem;
	background: var(--primary);
	color: white;
	border-radius: 10px;
	font-size: 0.75rem;
	font-weight: 500;
}
</style>
