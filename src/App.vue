<script setup>
import { ref, watch, computed, reactive, onMounted } from 'vue';
import { DEVICES } from './config/devices';
import URLInput from './components/URLInput.vue';
import DeviceToggle from './components/DeviceToggle.vue';
import PreviewFrame from './components/PreviewFrame.vue';
import ResponsiveControls from './components/ResponsiveControls.vue';

const currentUrl = ref('');
const selectedDeviceId = ref('all');

// Reactive object for the "Responsive" pseudo-device
const responsiveData = reactive({
  id: 'responsive',
  name: 'Responsive',
  width: 1200,
  height: 800,
  icon: 'responsive',
  scale: 'auto'
});

// Queue Management
const CONCURRENCY_LIMIT = 3;
const loadStatuses = reactive({}); // { deviceId: 'waiting' | 'loading' | 'done' }

const resetLoadStatuses = () => {
  DEVICES.forEach(d => {
    if (d.id !== 'all' && d.id !== 'responsive') {
      loadStatuses[d.id] = 'waiting';
    }
  });
  loadStatuses['responsive'] = 'waiting';
};

const handleUrlSubmit = (url) => {
  currentUrl.value = url;
  resetLoadStatuses();
  processQueue();
};

const selectDevice = (deviceId) => {
  selectedDeviceId.value = deviceId;
  // If the device isn't loaded yet, make sure it's at least 'waiting'
  if (deviceId !== 'all' && !loadStatuses[deviceId]) {
    loadStatuses[deviceId] = 'waiting';
  }
  processQueue();
};

const processQueue = () => {
  if (!currentUrl.value) return;

  const devices = devicesToDisplay.value;
  const loadingCount = Object.values(loadStatuses).filter(s => s === 'loading').length;
  
  if (loadingCount < CONCURRENCY_LIMIT) {
    const slotsAvailable = CONCURRENCY_LIMIT - loadingCount;
    const waitingInView = devices.filter(d => loadStatuses[d.id] === 'waiting');
    
    waitingInView.slice(0, slotsAvailable).forEach(device => {
      loadStatuses[device.id] = 'loading';
    });
  }
};

const handleDeviceLoaded = (deviceId) => {
  loadStatuses[deviceId] = 'done';
  processQueue();
};

const handleDeviceError = (deviceId) => {
  loadStatuses[deviceId] = 'done';
  processQueue();
};

const devicesToDisplay = computed(() => {
  if (selectedDeviceId.value === 'all') {
    return DEVICES.filter(d => d.showInAll === true);
  }
  if (selectedDeviceId.value === 'responsive') {
     return [responsiveData];
  }
  const device = DEVICES.find(d => d.id === selectedDeviceId.value);
  return device ? [device] : [];
});

const isSingleView = computed(() => selectedDeviceId.value !== 'all');

const isLargeDevice = (device) => {
  return device.width >= 1024;
};

// Listen for dimension changes in responsive mode to immediate trigger load if needed
watch([() => responsiveData.width, () => responsiveData.height], () => {
  if (selectedDeviceId.value === 'responsive') {
    // We don't necessarily reset status to 'waiting' unless the component needs a full reload
    // But we should ensure it's at least 'done' or 'loading' so it shows up
    if (loadStatuses['responsive'] === 'waiting') {
      processQueue();
    }
  }
});

// Initial state
resetLoadStatuses();

watch(selectedDeviceId, processQueue);
</script>

<template>
  <div class="max-w-[1800px] mx-auto p-4 md:p-8 min-h-screen flex flex-col">
    <!-- Header -->
    <header class="text-center py-6 md:py-8">
      <div class="flex items-center justify-center gap-4 mb-2">
        <div class="flex items-center justify-center w-12 h-12 glass rounded-xl border border-white/10">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="6" width="12" height="20" rx="2" stroke="url(#gradient1)" stroke-width="2"/>
            <rect x="18" y="4" width="12" height="16" rx="2" stroke="url(#gradient1)" stroke-width="2"/>
            <rect x="18" y="22" width="12" height="6" rx="1" stroke="url(#gradient1)" stroke-width="2"/>
            <defs>
              <linearGradient id="gradient1" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stop-color="#6366f1"/>
                <stop offset="100%" stop-color="#a855f7"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold tracking-tight">
          Responsive<span class="bg-linear-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">Preview</span>
        </h1>
      </div>
      <p class="text-text-secondary text-sm md:text-lg">Test your website across multiple devices instantly</p>
    </header>

    <!-- URL Input Section -->
    <URLInput :initialUrl="currentUrl" @submit="handleUrlSubmit" />

    <!-- Device Selection -->
    <section class="mb-4">
      <div class="flex flex-wrap justify-center gap-2">
        <DeviceToggle 
          v-for="device in DEVICES" 
          :key="device.id"
          :device="device"
          :isActive="selectedDeviceId === device.id"
          @toggle="selectDevice"
        />
      </div>
    </section>

    <!-- Responsive Controls -->
    <ResponsiveControls 
      v-if="selectedDeviceId === 'responsive'"
      v-model:width="responsiveData.width"
      v-model:height="responsiveData.height"
      v-model:scale="responsiveData.scale"
    />

    <!-- Preview Grid Area -->
    <section class="flex-1 flex flex-col mt-4">
      <div 
        v-if="currentUrl"
        class="flex flex-row flex-wrap items-start justify-center gap-6 md:gap-8 w-full pb-12 overflow-x-hidden"
      >
        <PreviewFrame 
          v-for="(device, index) in devicesToDisplay"
          :key="device.id"
          :device="device"
          :url="currentUrl"
          :index="index"
          :manualScale="selectedDeviceId === 'responsive' ? responsiveData.scale : 'auto'"
          :shouldLoad="loadStatuses[device.id] === 'loading' || loadStatuses[device.id] === 'done'"
          :class="[
            isSingleView ? 'w-full max-w-full' : (isLargeDevice(device) ? 'w-full' : 'w-auto')
          ]"
          :style="!isSingleView && !isLargeDevice(device) ? { minWidth: `${device.width}px` } : {}"
          @loaded="handleDeviceLoaded"
          @error="handleDeviceError"
        />
      </div>
      
      <div v-else class="flex flex-col items-center justify-center p-12 md:p-24 text-center text-text-tertiary">
        <div class="mb-6 opacity-30">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <path d="M8 21h8M12 17v4"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-text-secondary mb-2">Enter a URL to preview</h3>
        <p class="text-sm">See how your website looks across different devices</p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="text-center py-6 border-t border-white/5 mt-auto">
      <p class="text-text-tertiary text-[0.75rem]">
        Note: Some websites may block iframe embedding due to security policies
      </p>
    </footer>
  </div>
</template>
