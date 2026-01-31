<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  width: Number,
  height: Number,
  scale: [Number, String]
});

const emit = defineEmits(['update:width', 'update:height', 'update:scale']);

const localWidth = ref(props.width);
const localHeight = ref(props.height);
const localScale = ref(props.scale);

// Dropdown State
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

const scaleOptions = [
  { label: 'Auto Fit', value: 'auto' },
  { label: '100% Zoom', value: '1.0' },
  { label: '75% Zoom', value: '0.75' },
  { label: '50% Zoom', value: '0.5' }
];

const currentScaleLabel = computed(() => {
  const option = scaleOptions.find(o => o.value === localScale.value);
  return option ? option.label : localScale.value;
});

// Watchers to update local state when props change
watch(() => props.width, (val) => localWidth.value = val);
watch(() => props.height, (val) => localHeight.value = val);
watch(() => props.scale, (val) => localScale.value = val);

const updateWidth = () => emit('update:width', parseInt(localWidth.value) || 0);
const updateHeight = () => emit('update:height', parseInt(localHeight.value) || 0);

const selectScale = (val) => {
  localScale.value = val;
  emit('update:scale', val);
  isDropdownOpen.value = false;
};

const reset = () => {
  localWidth.value = 1200;
  localHeight.value = 800;
  selectScale('auto');
  updateWidth();
  updateHeight();
};

// Click outside detection
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

import { computed } from 'vue';
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-2 py-2 px-4 glass rounded-full border border-white/10 mb-8 animate-fade-in mx-auto w-fit shadow-2xl relative z-50">
    
    <!-- Dimensions Group -->
    <div class="flex items-center gap-1.5 bg-white/5 rounded-full px-1.5 py-1">
      <div class="relative group">
        <input 
          v-model="localWidth" 
          type="number" 
          @input="updateWidth"
          class="w-20 bg-transparent border-none rounded-full pl-3 pr-6 py-1 text-text-primary text-sm font-bold outline-none focus:text-accent-primary transition-all text-center"
        >
        <span class="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] uppercase font-black text-text-tertiary group-focus-within:text-accent-primary pointer-events-none">W</span>
      </div>
      
      <span class="text-text-tertiary font-black text-xs opacity-30 select-none">×</span>
      
      <div class="relative group">
        <input 
          v-model="localHeight" 
          type="number" 
          @input="updateHeight"
          class="w-20 bg-transparent border-none rounded-full pl-3 pr-6 py-1 text-text-primary text-sm font-bold outline-none focus:text-accent-primary transition-all text-center"
        >
        <span class="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] uppercase font-black text-text-tertiary group-focus-within:text-accent-primary pointer-events-none">H</span>
      </div>
    </div>
    
    <!-- Separator -->
    <div class="h-6 w-px bg-white/10 mx-1"></div>
    
    <!-- Custom Dropdown -->
    <div class="relative" ref="dropdownRef">
      <button 
        @click="isDropdownOpen = !isDropdownOpen"
        class="flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-full pl-4 pr-3 py-1.5 text-text-primary text-xs font-bold transition-all border border-transparent focus:border-white/10"
      >
        <span>{{ currentScaleLabel }}</span>
        <svg 
          width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="2.5"
          class="text-text-tertiary transition-transform duration-300"
          :class="{ 'rotate-180': isDropdownOpen }"
        >
          <path d="m1 1 4 4 4-4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Dropdown Menu -->
      <Transition name="dropdown">
        <div 
          v-if="isDropdownOpen"
          class="absolute bottom-full left-0 mb-3 w-48 bg-bg-primary/95 rounded-2xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div class="p-1.5">
            <button 
              v-for="option in scaleOptions" 
              :key="option.value"
              @click="selectScale(option.value)"
              class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between group"
              :class="localScale === option.value ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/20' : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'"
            >
              <span>{{ option.label }}</span>
              <svg 
                v-if="localScale === option.value"
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
              >
                <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Reset Button -->
    <button 
      @click="reset"
      class="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-text-tertiary hover:text-accent-primary hover:bg-white/10 transition-all active:scale-90 border border-transparent hover:border-white/10"
      title="Reset defaults"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M3 3v5h5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}
input[type=number] {
  -webkit-appearance: textfield;
  -moz-appearance: textfield;
  appearance: textfield;
}

/* Dropdown Animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}
</style>
