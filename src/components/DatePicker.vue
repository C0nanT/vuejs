<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-vue-next";

const props = defineProps<{
  modelValue?: string; // Expects YYYY-MM-DD
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | undefined): void;
}>();

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);

// Date Helpers
const displayDate = computed(() => {
  if (!props.modelValue) return "";
  const parts = props.modelValue.split("-").map(Number);
  if (parts.length < 3) return "";
  const year = parts[0]!;
  const month = parts[1]!;
  const day = parts[2]!;
  
  // Create date object
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
});

// Calendar State
const currentMonthDate = ref(new Date());

const currentMonthLabel = computed(() => {
  return currentMonthDate.value.toLocaleString("pt-BR", {
    month: "long",
    year: "numeric",
  });
});

const daysInMonth = computed(() => {
  const year = currentMonthDate.value.getFullYear();
  const month = currentMonthDate.value.getMonth();
  const date = new Date(year, month + 1, 0);
  return date.getDate();
});

const firstDayOfMonth = computed(() => {
  const year = currentMonthDate.value.getFullYear();
  const month = currentMonthDate.value.getMonth();
  return new Date(year, month, 1).getDay();
});

// Generate calendar grid
const calendarDays = computed(() => {
  const days: (number | null)[] = [];
  
  // Padding for stats
  for (let i = 0; i < firstDayOfMonth.value; i++) {
    days.push(null);
  }
  
  // Real days
  for (let i = 1; i <= daysInMonth.value; i++) {
    days.push(i);
  }
  
  return days;
});

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

// Actions
const toggleCalendar = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value && props.modelValue) {
    const parts = props.modelValue.split("-").map(Number);
    if (parts.length === 3) {
      const year = parts[0]!;
      const month = parts[1]!;
      currentMonthDate.value = new Date(year, month - 1, 1);
    }
  }
};

const closeCalendar = (e: MouseEvent) => {
  // Close if clicked outside
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeCalendar);
});

onUnmounted(() => {
  document.removeEventListener("click", closeCalendar);
});

const prevMonth = () => {
  currentMonthDate.value = new Date(
    currentMonthDate.value.getFullYear(),
    currentMonthDate.value.getMonth() - 1,
    1
  );
};

const nextMonth = () => {
  currentMonthDate.value = new Date(
    currentMonthDate.value.getFullYear(),
    currentMonthDate.value.getMonth() + 1,
    1
  );
};

const selectDate = (day: number) => {
  const year = currentMonthDate.value.getFullYear();
  const month = currentMonthDate.value.getMonth() + 1; // 1-idx
  
  // Format YYYY-MM-DD
  const formattedDates = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  
  emit("update:modelValue", formattedDates);
  isOpen.value = false;
};

const isSelected = (day: number) => {
  if (!props.modelValue) return false;
  const parts = props.modelValue.split("-").map(Number);
  if (parts.length < 3) return false;
  const year = parts[0];
  const month = parts[1];
  const dayFromVal = parts[2];
  
  return (
    year === currentMonthDate.value.getFullYear() &&
    month === currentMonthDate.value.getMonth() + 1 &&
    dayFromVal === day
  );
};

const isToday = (day: number) => {
  const today = new Date();
  return (
    today.getDate() === day &&
    today.getMonth() === currentMonthDate.value.getMonth() &&
    today.getFullYear() === currentMonthDate.value.getFullYear()
  );
};
</script>

<template>
  <div class="datepicker-container" ref="containerRef">
    <!-- Input Trigger -->
    <div 
      class="form-input date-trigger" 
      :class="{ 'is-open': isOpen }"
      @click="toggleCalendar"
    >
      <span v-if="displayDate" class="date-value">{{ displayDate }}</span>
      <span v-else class="placeholder">{{ placeholder || 'Selecione uma data' }}</span>
      <CalendarIcon class="icon" :size="18" />
    </div>

    <!-- Calendar Dropdown -->
    <transition name="fade-zoom">
      <div v-if="isOpen" class="calendar-dropdown">
        <div class="calendar-header">
          <button type="button" class="nav-btn" @click.stop="prevMonth">
            <ChevronLeft :size="20" />
          </button>
          <span class="month-label">{{ currentMonthLabel }}</span>
          <button type="button" class="nav-btn" @click.stop="nextMonth">
            <ChevronRight :size="20" />
          </button>
        </div>

        <div class="calendar-grid">
          <div v-for="wd in weekDays" :key="wd" class="weekday-label">
            {{ wd }}
          </div>
          
          <button
            v-for="(day, index) in calendarDays"
            :key="index"
            type="button"
            class="day-btn"
            :class="{
              'empty': !day,
              'selected': day && isSelected(day),
              'today': day && isToday(day)
            }"
            :disabled="!day"
            @click.stop="day && selectDate(day)"
          >
            {{ day }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.datepicker-container {
  position: relative;
  width: 100%;
}

.date-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
}

.date-value {
  color: var(--text-main);
}

.placeholder {
  color: #64748b; /* text-muted fallback */
}

.icon {
  color: var(--text-muted);
  transition: color 0.2s;
}

.date-trigger:hover .icon {
  color: var(--primary);
}

.is-open {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

/* Dropdown */
.calendar-dropdown {
  position: absolute;
  bottom: calc(100% + 8px); /* Open upwards */
  top: auto;
  left: 0;
  width: 280px;
  background: var(--input-bg);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow: var(--shadow-lg);
  padding: 1rem;
  z-index: 50;
  backdrop-filter: blur(12px);
}

/* ... existing code ... */

/* Animation */
.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95); /* Start slightly lower (closer to input) and move up */
}

/* Header */
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.month-label {
  font-weight: 600;
  text-transform: capitalize;
  color: var(--text-main);
}

.nav-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.nav-btn:hover {
  background: var(--hover-bg);
  color: var(--text-main);
}

/* Grid */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.weekday-label {
  text-align: center;
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 500;
  padding-bottom: 4px;
}

.day-btn {
  aspect-ratio: 1;
  border: none;
  background: transparent;
  color: var(--text-main);
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.day-btn:hover:not(:disabled) {
  background: var(--hover-bg);
}

.day-btn.empty {
  cursor: default;
  pointer-events: none;
}

.day-btn.today {
  color: var(--primary);
  font-weight: 700;
  border: 1px solid var(--primary);
  background: rgba(139, 92, 246, 0.1); /* Subtle highlight for today */
}

.day-btn.selected {
  background: var(--primary);
  color: white;
  border: none; /* Override today border if selected */
}

.day-btn.selected:hover {
  background: var(--primary-hover);
}


</style>
