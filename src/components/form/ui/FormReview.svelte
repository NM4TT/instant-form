<script lang="ts">
  import type { Question, FormConfig } from '#lib/types';
  import { formatResponseValue } from '#lib/utils';

  let { allQuestions, responses, summaryConfig }: { 
    allQuestions: Question[], 
    responses: Record<string, any>, 
    summaryConfig?: FormConfig['pages']['summary'] | undefined
  } = $props();
</script>

<div class="flex flex-col gap-8">
  <div class="border-b border-secondary/10 pb-4">
    <h2 class="text-2xl font-display font-extrabold mb-1">{summaryConfig?.title || 'Review your responses'}</h2>
    {#if summaryConfig?.description}
      <p class="text-sm opacity-60">{summaryConfig.description}</p>
    {/if}
  </div>
  <div class="flex flex-col gap-6">
    {#each allQuestions.filter(q => q.type !== 'hidden') as question}
      <div class="flex flex-col gap-1">
        <span class="text-sm font-bold opacity-60 uppercase tracking-wider">{question.label}</span>
        <span class="text-lg">{formatResponseValue(question, responses[question.id])}</span>
      </div>
    {/each}
  </div>
</div>
