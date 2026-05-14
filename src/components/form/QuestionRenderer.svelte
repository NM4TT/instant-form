<script lang="ts">
  import TextInput from './inputs/TextInput.svelte';
  import MaskInput from './inputs/MaskInput.svelte';
  import StarRating from './inputs/StarRating.svelte';
  import DropdownSelect from './inputs/DropdownSelect.svelte';
  import RankingInput from './inputs/RankingInput.svelte';
  import MatrixInput from './inputs/MatrixInput.svelte';
  import type { Question } from '#lib/types';
  import { resolveImageUrl } from '#lib/utils';

  let { question, value = $bindable(), interacted = $bindable(false) }: {
    question: Question,
    value: any,
    interacted: any
  } = $props();

  const components: Record<string, any> = {
    text: TextInput,
    mask: MaskInput,
    star: StarRating,
    dropdown: DropdownSelect,
    ranking: RankingInput,
    matrix: MatrixInput,
  };

  const SelectedComponent = $derived(components[question.type]);
</script>

{#if question.type !== 'hidden'}
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-1">
      <label class="font-display font-bold text-lg" for={question.id}>
        {question.label}
        {#if question.required}
          <span class="text-red-500">*</span>
        {/if}
      </label>
      
      {#if question.images && question.images.length > 0}
        <div class="flex gap-4 overflow-x-auto py-2">
          {#each question.images.slice(0, 3) as img}
            <img 
              src={resolveImageUrl(img)} 
              alt="" 
              loading="lazy"
              decoding="async"
              class="h-32 w-auto rounded-lg object-cover border border-secondary/10"
            />
          {/each}
        </div>
      {/if}
    </div>

    {#if SelectedComponent}
      <SelectedComponent
        {question}
        bind:value={value}
        bind:interacted={interacted}
      />
    {:else}
      <p class="text-red-500 text-sm">Unknown question type: {question.type}</p>
    {/if}
  </div>
{/if}
