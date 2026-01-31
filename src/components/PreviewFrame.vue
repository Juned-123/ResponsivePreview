<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { ICONS } from '../config/devices';

const props = defineProps(['device', 'url', 'index', 'manualScale', 'shouldLoad']);
const emit = defineEmits(['loaded', 'error']);

const viewportRef = ref(null);
const availableWidth = ref(0);
const isLoading = ref(true);
const isError = ref(false);

const startTime = ref(0);
const loadTimer = ref(null);

// More sensitive scaling logic
const scale = computed(() => {
  // Manual scale takes absolute priority
  if (props.manualScale && props.manualScale !== 'auto') {
    return parseFloat(props.manualScale);
  }

  if (!availableWidth.value || !props.device.width) return 1.0;
  
  // Use a smaller padding for focused views to maximize space
  const isResponsive = props.device.id === 'responsive';
  const padding = isResponsive ? 16 : 32; 
  const currentSpace = availableWidth.value - padding;
  
  // Only scale down if the device is wider than the available space
  if (props.device.width > currentSpace) {
    return currentSpace / props.device.width;
  }
  
  return 1.0;
});

const containerWidth = computed(() => Math.floor(props.device.width * scale.value));
const containerHeight = computed(() => Math.floor(props.device.height * scale.value));

let observer = null;

onMounted(() => {
  if (viewportRef.value) {
    observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // Debounce or at least ensure we don't cause infinite loops
        if (Math.abs(availableWidth.value - entry.contentRect.width) > 1) {
          availableWidth.value = entry.contentRect.width;
        }
      }
    });
    observer.observe(viewportRef.value);
    availableWidth.value = viewportRef.value.clientWidth;
  }
});

onUnmounted(() => {
  if (observer) observer.disconnect();
  if (loadTimer.value) clearTimeout(loadTimer.value);
});

const startLoadTracking = () => {
  if (!props.url || !props.shouldLoad) return;
  
  isLoading.value = true;
  isError.value = false;
  startTime.value = Date.now();
  
  console.info(`[Preview] 🕒 Loading started: ${props.device.name} -> ${props.url}`);

  if (loadTimer.value) clearTimeout(loadTimer.value);
  
  loadTimer.value = setTimeout(() => {
    if (isLoading.value) {
      console.warn(`[Preview] ⚠️ Timeout: ${props.device.name} is taking more than 10s.`);
    }
  }, 10000);
};

const handleIframeLoad = () => {
  if (!isLoading.value) return; 
  isLoading.value = false;
  const duration = ((Date.now() - startTime.value) / 1000).toFixed(2);
  console.log(`[Preview] ✅ Success: ${props.device.name} loaded in ${duration}s`);
  if (loadTimer.value) clearTimeout(loadTimer.value);
  emit('loaded', props.device.id);
};

const handleIframeError = () => {
  isLoading.value = false;
  isError.value = true;
  console.error(`[Preview] ❌ Error: ${props.device.name} failed to load.`);
  if (loadTimer.value) clearTimeout(loadTimer.value);
  emit('error', props.device.id);
};

onMounted(() => {
  if (props.url && props.shouldLoad) startLoadTracking();
});

watch(() => props.shouldLoad, (newVal) => {
  if (newVal && props.url) startLoadTracking();
});

watch(() => props.url, () => {
  if (props.shouldLoad) startLoadTracking();
});

// Watch for dimension changes to ensure scale is recalculated
watch(() => props.device.width, () => {
  // If we are in responsive mode and already loaded, we don't need to reload the iframe source
  // but we do need the UI to update. The computed properties (scale, containerWidth) handle this.
});

</script>

<template>
  <div 
    class="bg-bg-secondary border border-white/10 rounded-2xl overflow-hidden flex flex-col transition-all hover:border-[rgba(99,102,241,0.3)] hover:shadow-lg animate-fade-in shrink-0"
    :style="{ animationDelay: `${index * 0.1}s` }"
  >
    <!-- Device Header -->
    <div class="flex items-center justify-between p-4 bg-bg-tertiary border-b border-white/10 select-none">
      <div class="flex items-center gap-2">
        <span class="w-5 h-5 text-accent-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path :d="ICONS[device.icon]" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <span class="font-semibold text-[0.875rem] text-text-primary uppercase tracking-tight">{{ device.name }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="!shouldLoad && url" class="text-[0.65rem] text-text-tertiary uppercase tracking-wider animate-pulse font-bold">Queued</span>
        <span class="text-[0.7rem] font-black text-text-tertiary glass px-2 py-1 rounded-md border border-white/5 tabular-nums">
          {{ device.width }} <span class="opacity-30">×</span> {{ device.height }}
        </span>
      </div>
    </div>

    <!-- Viewport Area -->
    <div ref="viewportRef" class="flex-1 flex items-center justify-center p-4 bg-bg-secondary relative overflow-auto checkerboard min-h-[150px]">
      <div 
        class="bg-white rounded-sm overflow-hidden shadow-2xl relative transition-all duration-300 ease-out border border-white/10"
        :style="{ width: `${containerWidth}px`, height: `${containerHeight}px` }"
      >
        <iframe 
          v-if="url && shouldLoad"
          :src="url"
          class="block border-none origin-top-left transition-transform duration-300 ease-out"
          :style="{ 
            width: `${device.width}px`, 
            height: `${device.height}px`,
            transform: `scale(${scale})`
          }"
          @load="handleIframeLoad"
          @error="handleIframeError"
        ></iframe>

        <!-- Loading/Waiting Overlay -->
        <div v-if="url && (!shouldLoad || isLoading)" class="absolute inset-0 flex flex-col items-center justify-center bg-bg-primary text-text-secondary text-sm gap-4 z-10 p-4 text-center">
          <template v-if="!shouldLoad">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-text-tertiary animate-bounce">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            <span class="text-text-tertiary font-bold tracking-widest text-[10px] uppercase">Queued</span>
          </template>
          <template v-else>
            <div class="w-8 h-8 border-3 border-white/10 border-t-accent-primary rounded-full animate-spin"></div>
            <span class="font-bold tracking-widest text-[10px] uppercase">Loading...</span>
          </template>
        </div>

        <!-- Error Overlay -->
        <div v-if="isError" class="absolute inset-0 flex flex-col items-center justify-center bg-bg-secondary text-text-tertiary text-sm text-center p-4 z-20">
          <svg class="w-12 h-12 text-warning mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path :d="ICONS.error" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <p class="font-bold">PREVIEW BLOCKED</p>
          <p class="text-[10px] opacity-50 mt-1">This site prevents iframe embedding</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkerboard {
  background-image: 
    linear-gradient(45deg, #0d0d16 25%, transparent 25%),
    linear-gradient(-45deg, #0d0d16 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #0d0d16 75%),
    linear-gradient(-45deg, transparent 75%, #0d0d16 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

.animate-fade-in {
  animation: fadeIn 0.4s ease forwards;
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Tabular nums for dimension display */
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
</style>
