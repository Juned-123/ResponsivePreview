<script setup>
import { ICONS } from '../config/devices';

defineProps({
  device: Object,
  isActive: Boolean
});

defineEmits(['toggle']);
</script>

<template>
  <button 
    type="button" 
    class="flex items-center gap-2 py-2 px-4 glass rounded-md text-[0.875rem] font-medium cursor-pointer transition-all hover:glass-hover"
    :class="isActive ? 'bg-[rgba(99,102,241,0.15)]! border-accent-primary! text-text-primary' : 'text-text-secondary'"
    @click="$emit('toggle', device.id)"
    :title="`${device.name} (${device.width}×${device.height})`"
  >
    <span class="w-[18px] h-[18px]" :class="isActive ? 'text-accent-primary opacity-100' : 'opacity-70'">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path :d="ICONS[device.icon]" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
    <span>{{ device.name }}</span>
  </button>
</template>
