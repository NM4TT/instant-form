<script lang="ts">
  import type { Question } from '#lib/types';
  
  let { question, value = $bindable(""), interacted = $bindable(false) }: { 
    question: Question, 
    value: string,
    interacted: boolean
  } = $props();

  const isValid = $derived.by(() => {
    if (question.required && !value) return false;
    return true;
  });

  const handleChange = () => {
    interacted = true;
  };
</script>

<div class="relative">
  <select 
    bind:value
    onchange={handleChange}
    required={question.required}
    class="input-base pr-10 appearance-none cursor-pointer"
  >
    <option value="" disabled selected>{question.placeholder || 'Select an option...'}</option>
    {#each question.options || [] as option}
      <option value={option}>{option}</option>
    {/each}
  </select>
  <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-50">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
</div>
