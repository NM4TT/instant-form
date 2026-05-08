<script lang="ts">
  import type { Question } from '#lib/types';
  
  let { question, value = $bindable(0) }: { 
    question: Question, 
    value: number 
  } = $props();

  let touched = $state(false);
  const max = question.max_stars || 5;

  const isValid = $derived.by(() => {
    if (question.required && value === 0) return false;
    return true;
  });

  const showError = $derived(touched && !isValid);

  const handleClick = (v: number) => {
    touched = true;
    value = v;
  };
</script>

<div class="flex flex-col gap-2">
  <div class="flex gap-2 p-2 rounded-xl transition-all {showError ? 'border border-red-500 animate-shake bg-red-50' : ''}">
    {#each Array(max) as _, i}
      <button
        type="button"
        class="text-4xl transition-all hover:scale-110 cursor-pointer {i < value ? 'text-yellow-400' : 'text-gray-300'}"
        onclick={() => handleClick(i + 1)}
      >
        ★
      </button>
    {/each}
  </div>
</div>
