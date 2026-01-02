<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { ChevronDown } from "lucide-vue-next";

interface Option {
	label: string | number;
	value: any;
}

const props = defineProps<{
	modelValue: any;
	options: Option[];
	placeholder?: string;
}>();

const emit = defineEmits(["update:modelValue", "toggle"]);

const isOpen = ref(false);
const selectRef = ref<HTMLElement | null>(null);

const toggle = () => {
	isOpen.value = !isOpen.value;
	emit("toggle", isOpen.value);
};

const close = () => {
	isOpen.value = false;
	emit("toggle", false);
};

const selectOption = (value: any) => {
	emit("update:modelValue", value);
	close();
};

const handleClickOutside = (event: MouseEvent) => {
	if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
		close();
	}
};

onMounted(() => {
	document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
	document.removeEventListener("click", handleClickOutside);
});

const selectedLabel = computed(() => {
	const option = props.options.find((opt) => opt.value === props.modelValue);
	return option ? option.label : props.placeholder || "Selecione uma opção";
});
</script>

<template>
	<div class="app-select" ref="selectRef">
		<div 
			class="select-trigger" 
			:class="{ 'is-open': isOpen }"
			@click="toggle"
		>
			<span class="selected-value">{{ selectedLabel }}</span>
			<ChevronDown 
				class="chevron-icon" 
				:class="{ 'rotate': isOpen }" 
				:size="20" 
			/>
		</div>

		<transition name="dropdown">
			<ul v-if="isOpen" class="select-options">
				<li 
					v-for="option in options" 
					:key="option.value"
					class="option-item"
					:class="{ 'is-selected': option.value === modelValue }"
					@click="selectOption(option.value)"
				>
					{{ option.label }}
				</li>
			</ul>
		</transition>
	</div>
</template>

<style scoped>
.app-select {
	position: relative;
	width: 100%;
}

.select-trigger {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.75rem 1rem;
	background: var(--input-bg);
	border: 1px solid var(--glass-border);
	border-radius: 12px;
	color: var(--text-main);
	cursor: pointer;
	transition: all 0.3s ease;
	user-select: none;
}

[data-theme="light"] .select-trigger {
	border-color: var(--glass-border);
}

.select-trigger:hover {
	border-color: var(--primary);
	background: var(--hover-bg);
}

.select-trigger.is-open {
	border-color: var(--primary);
	box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

.chevron-icon {
	color: var(--text-muted);
	transition: transform 0.3s ease;
}

.chevron-icon.rotate {
	transform: rotate(180deg);
}

.select-options {
	position: absolute;
	top: calc(100% + 0.5rem);
	left: 0;
	right: 0;
	background: var(--input-bg);
	border: 1px solid var(--glass-border);
	border-radius: 12px;
	padding: 0.5rem;
	margin: 0;
	list-style: none;
	z-index: 100;
	box-shadow: var(--shadow-lg);
	display: flex;
	flex-direction: column;
	gap: 4px;
}

[data-theme="light"] .select-options {
	border-color: var(--glass-border);
}

.option-item {
	padding: 0.75rem 1rem;
	border-radius: 8px;
	color: var(--text-main);
	cursor: pointer;
	transition: all 0.2s ease;
}

.option-item:hover {
	background: var(--hover-bg);
}

[data-theme="light"] .option-item {
	font-weight: 500;
}


.option-item.is-selected {
	background: var(--primary);
	color: white;
}

:deep(.input-success) .select-trigger,
.app-select.input-success .select-trigger {
	border-color: #10b981 !important;
	box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

/* Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
	transition: opacity 0.2s ease, transform 0.2s ease;
	transform-origin: top center;
}

.dropdown-enter-from,
.dropdown-leave-to {
	opacity: 0;
	transform: translateY(-10px) scaleY(0.95);
}

</style>
