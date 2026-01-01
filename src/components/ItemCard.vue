<script setup>
import { Pencil, Trash2 } from "lucide-vue-next";

defineProps({
	item: {
		type: Object,
		required: true,
	},
});

defineEmits(["edit", "remove"]);
</script>

<template>
	<div class="item-card">
		<div class="item-info">
			<h3 class="item-name">{{ item.name }}</h3>
			<p class="item-desc">{{ item.description }}</p>
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
				@click="$emit('remove', item.id)"
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
	transition: all 0.3s ease;
	animation: slideUp 0.5s ease backwards;
}

.item-card:hover {
	border-color: var(--primary);
	transform: scale(1.02);
	background: rgba(30, 41, 59, 0.9);
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
</style>
