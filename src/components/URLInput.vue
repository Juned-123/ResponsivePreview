<script setup>
import { ref } from 'vue';

const props = defineProps(['initialUrl']);
const emit = defineEmits(['submit']);

const url = ref(props.initialUrl || '');
const error = ref('');

const validateAndNormalizeUrl = (rawUrl) => {
  let normalizedUrl = rawUrl.trim();
  if (!normalizedUrl) return null;
  
  if (!normalizedUrl.match(/^https?:\/\//i)) {
    normalizedUrl = 'https://' + normalizedUrl;
  }
  
  try {
    const urlObj = new URL(normalizedUrl);
    return urlObj.href;
  } catch (e) {
    return null;
  }
};

const handleSubmit = () => {
  const validated = validateAndNormalizeUrl(url.value);
  if (!validated) {
    error.value = 'Please enter a valid URL';
    return;
  }
  error.value = '';
  emit('submit', validated);
};
</script>

<template>
  <section class="max-w-[800px] mx-auto mb-8 w-full">
    <form @submit.prevent="handleSubmit" class="w-full">
      <div class="flex items-center bg-bg-secondary border border-white/10 rounded-2xl p-1 transition-all focus-within:border-accent-primary focus-within:shadow-glow">
        <div class="flex items-center justify-center w-12 h-12 text-text-tertiary shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </div>
        
        <input 
          v-model="url"
          type="text" 
          placeholder="Enter website URL (e.g., https://example.com)" 
          autocomplete="url"
          class="flex-1 bg-transparent border-none outline-none text-text-primary text-base py-3 px-0 placeholder:text-text-tertiary"
          @input="error = ''"
        >
        
        <button 
          type="submit"
          class="flex items-center gap-2 py-3 px-6 bg-linear-to-br from-accent-primary to-accent-secondary border-none rounded-[12px] text-white text-base font-semibold cursor-pointer transition-all  hover:shadow-[0_8px_24px_rgba(99,102,241,0.4)] active:translate-y-0 shrink-0"
        >
          <span>Preview</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </form>
    <div class="text-error text-[0.875rem] mt-2 text-center min-h-[1.5em]">
      {{ error }}
    </div>
  </section>
</template>
