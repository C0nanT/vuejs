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
	overflow-x: hidden;
}

.main-container {
	flex: 1;
	margin-left: 260px; /* Width of sidebar */
	padding: 2rem 3rem;
	transition: margin-left 0.3s ease;
	overflow-x: hidden;
	width: 100%;
	box-sizing: border-box;
}

.page-content {
	max-width: 1400px;
	margin: 0 auto;
	position: relative;
	min-height: 400px;
	width: 100%;
	box-sizing: border-box;
}

@media (max-width: 1024px) {
	.main-container {
		padding: 1rem 1.5rem;
	}
}

@media (max-width: 900px) {
	.main-container {
		margin-left: 80px;
		padding: 1rem;
	}
}

@media (max-width: 640px) {
	#app {
		flex-direction: row;
	}
	
	.main-container {
		margin-left: 80px;
		padding: 0.75rem;
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
	}
	
	.page-content {
		max-width: 100%;
		min-height: auto;
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

