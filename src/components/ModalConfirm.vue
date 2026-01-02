<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
	title: string;
	message: string;
}>();

const emit = defineEmits<{
	(e: "close"): void;
	(e: "confirm"): void;
}>();

const handleConfirm = () => {
	emit("confirm");
	emit("close");
};
</script>

<template>
	<div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
		<div class="modal-content">
			<h2 class="modal-title">{{ title }}</h2>
			<p class="modal-message">{{ message }}</p>

			<div class="modal-footer">
				<button class="btn btn-ghost" @click="$emit('close')">
					Cancelar
				</button>
				<button 
					class="btn btn-danger" 
					@click="handleConfirm"
				>
					Confirmar
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
	background: #1e293b;
	border: 1px solid var(--glass-border);
	padding: 2.5rem;
	border-radius: 24px;
	width: 90%;
	max-width: 400px;
	box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
	animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-title {
	font-size: 1.5rem;
	font-weight: 700;
	margin-bottom: 1rem;
	color: var(--text-main);
}

.modal-message {
	font-size: 1rem;
	color: var(--text-muted);
	line-height: 1.5;
	margin-bottom: 2rem;
}

.modal-footer {
	display: flex;
	justify-content: flex-end;
	gap: 1rem;
}

.btn-danger {
	background: #ef4444;
	color: white;
}

.btn-danger:hover {
	background: #dc2626;
}

@keyframes fadeIn {
	from { opacity: 0; }
	to { opacity: 1; }
}

@keyframes zoomIn {
	from { opacity: 0; transform: scale(0.95); }
	to { opacity: 1; transform: scale(1); }
}
</style>

