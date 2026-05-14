<script lang="ts">
  import IconArrowLeft from '~icons/mdi/arrow-left';
  import IconArrowRight from '~icons/mdi/arrow-right';
  import IconLoading from '~icons/mdi/loading';
  import IconCheckBold from '~icons/mdi/check-bold';

  let { 
    currentPage, 
    showingSummary, 
    isSubmitting, 
    onPrev, 
    onNext, 
    onSubmit 
  }: { 
    currentPage: number, 
    showingSummary: boolean, 
    isSubmitting: boolean, 
    onPrev: () => void, 
    onNext: () => void, 
    onSubmit: () => void 
  } = $props();
</script>

<div class="mt-12 flex justify-between gap-4">
  <div class="flex-1">
    {#if currentPage > 0 || showingSummary}
      <button 
        class="p-4 rounded-full border-2 border-secondary/20 hover:bg-secondary/10 transition-colors disabled:opacity-30 cursor-pointer"
        onclick={onPrev}
        disabled={isSubmitting}
        aria-label="Previous"
      >
        <IconArrowLeft class="text-2xl" />
      </button>
    {/if}
  </div>
  
  {#if !showingSummary}
    <button 
      class="btn-primary rounded-full! p-4! flex items-center justify-center disabled:opacity-50"
      onclick={onNext}
      disabled={isSubmitting}
      aria-label="Next"
    >
      <IconArrowRight class="text-2xl" />
    </button>
  {:else}
    <button 
      class="btn-primary rounded-full! p-4! flex items-center justify-center disabled:opacity-50"
      onclick={onSubmit}
      disabled={isSubmitting}
      aria-label="Submit"
    >
      {#if isSubmitting}
        <IconLoading class="text-2xl animate-spin" />
      {:else}
        <IconCheckBold class="text-2xl" />
      {/if}
    </button>
  {/if}
</div>
