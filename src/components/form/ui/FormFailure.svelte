<script lang="ts">
  import Icon from '@iconify/svelte';
  import type { FormConfig } from '#lib/types';
  import { resolveImageUrl } from '#lib/utils';

  let { failureConfig, onRetry }: { 
    failureConfig?: FormConfig['pages']['failure'],
    onRetry: () => void
  } = $props();
</script>

<div class="text-center py-12">
  {#if failureConfig?.image_url}
    <img src={resolveImageUrl(failureConfig.image_url)} alt="Error" class="w-24 h-24 mx-auto mb-6 object-contain" />
  {:else}
    <div class="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
      <Icon icon="mdi:alert-circle-outline" />
    </div>
  {/if}
  <h2 class="text-3xl font-display font-extrabold mb-4 text-red-600">{failureConfig?.title || 'Submission Failed'}</h2>
  <p class="opacity-70 mb-8">{failureConfig?.message || 'We encountered an error while processing your request. Please try again later.'}</p>
  
  <div class="flex flex-col sm:flex-row gap-4 justify-center">
    <button class="btn-primary bg-red-600! border-red-600! hover:bg-transparent! hover:text-red-600! rounded-full! p-4!" onclick={onRetry} aria-label="Retry">
      <Icon icon="mdi:refresh" class="text-2xl" />
    </button>
    
    <button class="btn-primary rounded-full! p-4!" onclick={() => window.location.reload()} aria-label="Home">
      <Icon icon="mdi:home" class="text-2xl" />
    </button>
  </div>
</div>
