<script setup lang="ts">
import { RouterView } from "vue-router";
import AppSidebar from "./components/AppSidebar.vue";
</script>

<template>
	<div id="app">
		<AppSidebar />
		
		<div class="main-container">
			<main class="page-content">
				<RouterView v-slot="{ Component }">
					<transition name="fade" mode="out-in">
						<component :is="Component" />
					</transition>
				</RouterView>
			</main>
		</div>
	</div>
</template>

<style scoped>
#app {
	display: flex;
	min-height: 100vh;
	width: 100%;
}

.main-container {
	flex: 1;
	margin-left: 260px; /* Width of sidebar */
	padding: 2rem 3rem;
	transition: margin-left 0.3s ease;
}

.page-content {
	max-width: 1000px;
	margin: 0 auto;
	position: relative;
	min-height: 400px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
	.main-container {
		margin-left: 80px;
		padding: 1.5rem;
	}
}

/* Page Transitions */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
	opacity: 0;
	transform: translateY(10px);
}

.fade-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}
</style>

