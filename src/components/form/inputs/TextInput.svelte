<script lang="ts">
  import type { Question } from '#lib/types';
  
  let { question, value = $bindable("") }: { 
    question: Question, 
    value: string 
  } = $props();

  let touched = $state(false);
  
  const isValid = $derived.by(() => {
    if (question.required && !value) return false;
    if (question.regex && value) {
      const re = new RegExp(question.regex);
      return re.test(value);
    }
    return true;
  });

  const showError = $derived(touched && !isValid);

  const handleInput = () => {
    touched = true;
  };
</script>

<input
  id={question.id}
  type="text"
  placeholder={question.placeholder || ""}
  bind:value
  oninput={handleInput}
  required={question.required}
  class="input-base {showError ? 'input-error' : ''}"
/>
