<script lang="ts">
  import Icon from '@iconify/svelte';
  import type { FormConfig } from '#lib/types';
  import { resolveImageUrl } from '#lib/utils';

  let { successConfig }: { 
    successConfig?: FormConfig['pages']['success'] 
  } = $props();
</script>

<div class="text-center py-12">
  {#if successConfig?.image_url}
    <img src={resolveImageUrl(successConfig.image_url)} alt="Success" class="w-24 h-24 mx-auto mb-6 object-contain" />
  {:else}
    <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
      <Icon icon="mdi:check-circle-outline" />
    </div>
  {/if}
  <h2 class="text-3xl font-display font-extrabold mb-4">{successConfig?.title || 'Thank You!'}</h2>
  <p class="opacity-70 mb-8">{successConfig?.message || 'Your response has been securely encrypted and submitted.'}</p>
  <button class="btn-primary rounded-full! p-4!" onclick={() => window.location.reload()}>
    <Icon icon="mdi:home" class="text-2xl" />
  </button>
</div>
