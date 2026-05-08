<script lang="ts">
  import type { Question } from '#lib/types';
  
  let { question, value = $bindable({}) }: { 
    question: Question, 
    value: Record<string, string> 
  } = $props();

  let touched = $state(false);
  const rows = question.rows || [];
  const cols = question.columns || [];

  const isValid = $derived.by(() => {
    if (!question.required) return true;
    return rows.every(row => value[row]);
  });

  const showError = $derived(touched && !isValid);

  const handleInput = () => {
    touched = true;
  };
</script>

<div class="overflow-x-auto rounded-xl transition-all {showError ? 'border border-red-500 animate-shake bg-red-50' : 'border border-secondary/10'}">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr>
        <th class="p-4 border-b border-secondary/10"></th>
        {#each cols as col}
          <th class="p-4 border-b border-secondary/10 text-center font-display text-sm uppercase tracking-wider opacity-60">
            {col}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row}
        <tr>
          <td class="p-4 border-b border-secondary/10 font-medium">{row}</td>
          {#each cols as col}
            <td class="p-4 border-b border-secondary/10 text-center">
              <input 
                type="radio" 
                name={`${question.id}_${row}`} 
                value={col}
                bind:group={value[row]}
                oninput={handleInput}
                required={question.required}
                class="w-5 h-5 accent-secondary cursor-pointer"
              />
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
