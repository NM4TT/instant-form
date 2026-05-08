<script lang="ts">
  import { onMount } from 'svelte';
  import QuestionRenderer from './QuestionRenderer.svelte';
  import FormProgressBar from './ui/FormProgressBar.svelte';
  import FormReview from './ui/FormReview.svelte';
  import FormSuccess from './ui/FormSuccess.svelte';
  import FormFailure from './ui/FormFailure.svelte';
  import FormNavigation from './ui/FormNavigation.svelte';
  import { encryptPayload } from '#lib/client/encryption';
  import type { Question, FormConfig, Section } from '#lib/types';

  let { questions = [], settings, summaryConfig, successConfig, failureConfig }: { 
    questions: (Question | Section)[], 
    settings: FormConfig['settings'],
    summaryConfig?: FormConfig['pages']['summary'],
    successConfig?: FormConfig['pages']['success'],
    failureConfig?: FormConfig['pages']['failure']
  } = $props();

  let currentPage = $state(0);
  let isSubmitting = $state(false);
  let submitted = $state(false);
  let failed = $state(false);
  let showingSummary = $state(false);
  let errorMessage = $state("");

  const extractQuestions = (items: (Question | Section)[]): Question[] => {
    let qList: Question[] = [];
    items.forEach(item => {
      if ('type' in item && item.type === 'section') {
        qList = [...qList, ...item.questions];
      } else {
        qList.push(item as Question);
      }
    });
    return qList;
  };

  const allQuestions = $derived(extractQuestions(questions));

  const initializeResponses = () => {
    const initial: Record<string, any> = {};
    allQuestions.forEach(q => {
      if (q.type === 'hidden') initial[q.id] = q.value ?? "";
      else if (q.type === 'star') initial[q.id] = 0;
      else if (q.type === 'ranking') initial[q.id] = [...(q.items || [])];
      else if (q.type === 'matrix') initial[q.id] = {};
      else initial[q.id] = "";
    });
    return initial;
  };

  const initializeInteractions = () => {
    const initial: Record<string, boolean> = {};
    allQuestions.forEach(q => {
      initial[q.id] = false;
    });
    return initial;
  };

  let responses = $state<Record<string, any>>(initializeResponses());
  let interactions = $state<Record<string, any>>(initializeInteractions());

  $effect(() => {
    allQuestions.forEach(q => {
      if (!(q.id in responses)) {
        if (q.type === 'hidden') responses[q.id] = q.value ?? "";
        else if (q.type === 'star') responses[q.id] = 0;
        else if (q.type === 'ranking') responses[q.id] = [...(q.items || [])];
        else if (q.type === 'matrix') responses[q.id] = {};
        else responses[q.id] = "";
      }
      if (!(q.id in interactions)) {
        interactions[q.id] = false;
      }
    });
  });

  // Flatten questions while preserving section metadata for pagination
  type Page = {
    sectionTitle?: string;
    questions: Question[];
  };

  const pageSize = settings.pagination_size || 3;

  const pages = $derived.by(() => {
    const p: Page[] = [];
    questions.forEach(item => {
      if ('type' in item && item.type === 'section') {
        const sectionQuestions = item.questions.filter((q: Question) => q.type !== 'hidden');
        if (sectionQuestions.length === 0) return;
        for (let i = 0; i < sectionQuestions.length; i += pageSize) {
          p.push({
            sectionTitle: item.title,
            questions: sectionQuestions.slice(i, i + pageSize)
          });
        }
      } else {
        const q = item as Question;
        if (q.type === 'hidden') return;
        const lastPage = p[p.length - 1];
        if (lastPage && !lastPage.sectionTitle && lastPage.questions.length < pageSize) {
          lastPage.questions.push(q);
        } else {
          p.push({ questions: [q] });
        }
      }
    });
    return p;
  });

  const currentQuestions = $derived(pages[currentPage]?.questions || []);
  const currentSectionTitle = $derived(pages[currentPage]?.sectionTitle);
  const totalPages = $derived(pages.length);

  const validatePage = () => {
    for (const q of currentQuestions) {
      const val = responses[q.id];
      const interacted = interactions[q.id];

      if (q.required) {
        if (val === undefined || val === null || val === "") return false;
        
        if (q.type === 'star' && val === 0) return false;
        if (q.type === 'ranking' && !interacted) return false;
        if (q.type === 'matrix') {
          const rows = q.rows || [];
          if (rows.some((row: string) => !val[row])) return false;
        }
      }

      if (q.type === 'text' && q.regex && val) {
        const re = new RegExp(q.regex);
        if (!re.test(val)) return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (!validatePage()) {
      errorMessage = "Please fill all required fields correctly.";
      return;
    }
    errorMessage = "";
    if (currentPage < totalPages - 1) {
      currentPage++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showingSummary = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (showingSummary) {
      showingSummary = false;
    } else if (currentPage > 0) {
      currentPage--;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitForm = async () => {
    isSubmitting = true;
    errorMessage = "";
    failed = false;

    try {
      if (settings.mockMode) {
        console.log("Mock Mode Enabled. Form Responses:", responses);
        await new Promise(resolve => setTimeout(resolve, 800));
        submitted = true;
        return;
      }

      if (!settings.submit_url) {
        submitted = true;
        return;
      }

      let payload = JSON.stringify(responses);
      
      if (settings.encryption) {
        payload = await encryptPayload(payload, settings.encryption.public_key);
      }

      const response = await fetch(settings.submit_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: payload })
      });

      if (response.ok) {
        submitted = true;
      } else {
        throw new Error("Submition Error");
      }
    } catch (e: any) {
      failed = true;
      console.error(e);
    } finally {
      isSubmitting = false;
    }
  };

  const retry = () => {
    failed = false;
  };

  onMount(() => {
    // Already initialized in initializeResponses
  });
</script>

<div class="bg-bg-surface p-6 md:p-10 rounded-2xl border border-secondary/10 shadow-xs">
  {#if !submitted && !failed}
    <FormProgressBar 
      {currentPage} 
      {totalPages} 
      {currentSectionTitle} 
      {showingSummary} 
      {summaryConfig} 
    />

    {#if !showingSummary}
      <div class="flex flex-col gap-10">
        {#each currentQuestions as question (question.id)}
          <QuestionRenderer 
            {question} 
            bind:value={responses[question.id]} 
            bind:interacted={interactions[question.id]}
          />
        {/each}
      </div>
    {:else}
      <FormReview 
        {allQuestions} 
        {responses} 
        {summaryConfig} 
      />
    {/if}

    {#if errorMessage}
      <p class="mt-6 text-red-500 text-sm font-bold">{errorMessage}</p>
    {/if}

    <FormNavigation 
      {currentPage} 
      {showingSummary} 
      {isSubmitting} 
      onPrev={prevStep} 
      onNext={nextStep} 
      onSubmit={submitForm} 
    />
  {:else if submitted}
    <FormSuccess {successConfig} />
  {:else if failed}
    <FormFailure {failureConfig} onRetry={retry} />
  {/if}
</div>
