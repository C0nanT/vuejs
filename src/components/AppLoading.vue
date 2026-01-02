<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";

defineProps({
	message: {
		type: String,
		default: "Carregando"
	}
});
</script>

<template>
	<div class="app-loading">
		<div class="loading-content">
			<div class="loader-wrapper">
				<Loader2 class="loader-icon" :size="48" />
				<div class="pulse-ring"></div>
			</div>
			<p class="loading-text">{{ message }}<span>.</span><span>.</span><span>.</span></p>
		</div>
	</div>
</template>

<style scoped>
.app-loading {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 3rem;
	width: 100%;
}

.loading-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.5rem;
}

.loader-wrapper {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
}

.loader-icon {
	color: var(--primary);
	animation: spin 2s linear infinite;
	z-index: 1;
}

.pulse-ring {
	position: absolute;
	width: 60px;
	height: 60px;
	border-radius: 50%;
	background: var(--primary);
	opacity: 0.15;
	animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.loading-text {
	font-size: 1.1rem;
	font-weight: 500;
	color: var(--text-muted);
	letter-spacing: 0.05em;
	display: flex;
	align-items: center;
}

.loading-text span {
	animation: dot-blink 1.4s infinite both;
}

.loading-text span:nth-child(2) {
	animation-delay: 0.2s;
}

.loading-text span:nth-child(3) {
	animation-delay: 0.4s;
}

@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

@keyframes pulse {
	0%, 100% {
		transform: scale(1);
		opacity: 0.1;
	}
	50% {
		transform: scale(1.4);
		opacity: 0.2;
	}
}

@keyframes dot-blink {
	0% { opacity: .2; }
	20% { opacity: 1; }
	100% { opacity: .2; }
}
</style>
