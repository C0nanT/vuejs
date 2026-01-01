<script setup>
import { Plus } from "lucide-vue-next";

defineProps({
	title: {
		type: String,
		default: "Vue Mastery",
	},
	subtitle: {
		type: String,
		default: "Explorando o poder da reatividade e templates",
	},
});

defineEmits(["add"]);
</script>

<template>
	<header>
		<h1>{{ title }}</h1>
		<p class="subtitle">{{ subtitle }}</p>

		<div class="header-actions">
			<button class="btn btn-primary" @click="$emit('add')">
				<Plus :size="20" /> Adicionar
			</button>
		</div>
	</header>
</template>

<style scoped>
.header-actions {
	display: flex;
	justify-content: flex-end;
	margin-bottom: 2rem;
}
</style>
