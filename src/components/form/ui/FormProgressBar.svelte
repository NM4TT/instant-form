<script lang="ts">
  import Icon from '@iconify/svelte';
  import type { FormConfig } from '#lib/types';

  let { 
    currentPage, 
    totalPages, 
    currentSectionTitle, 
    showingSummary, 
    summaryConfig 
  }: { 
    currentPage: number, 
    totalPages: number, 
    currentSectionTitle?: string, 
    showingSummary: boolean,
    summaryConfig?: FormConfig['pages']['summary']
  } = $props();
</script>

<div class="mb-8">
  <div class="flex justify-between items-center text-sm font-mono opacity-50 mb-2">
    <div class="flex flex-col">
      <div class="flex items-center gap-1.5">
        <Icon icon={showingSummary ? "mdi:playlist-check" : "mdi:layers-outline"} class="text-lg" />
        <span>{showingSummary ? (summaryConfig?.title || 'Review Summary') : `${currentPage + 1} of ${totalPages}`}</span>
      </div>
      {#if !showingSummary && currentSectionTitle}
        <span class="text-xs font-bold text-secondary uppercase tracking-widest mt-1 ml-6">{currentSectionTitle}</span>
      {/if}
    </div>
    <span>{showingSummary ? '99' : Math.round(((currentPage + 1) / (totalPages + 1)) * 100)}%</span>
  </div>
  <div class="h-2 bg-secondary/10 w-full rounded-full overflow-hidden flex gap-1 p-0.5">
    {#each Array(totalPages + 1) as _, i}
      <div 
        class="h-full rounded-full transition-all duration-500 flex-1 {i <= (showingSummary ? totalPages : currentPage) ? 'bg-secondary' : 'bg-gray-200'}"
      ></div>
    {/each}
  </div>
</div>
