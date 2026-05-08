<script lang="ts">
  import type { Question } from '#lib/types';
  
  let { question, value = $bindable(""), interacted = $bindable(false) }: { 
    question: Question, 
    value: string,
    interacted: boolean
  } = $props();

  const isValid = $derived.by(() => {
    if (question.required && !value) return false;
    // For mask, if provided, we assume it should match the mask length roughly or just check required
    return true;
  });

  const showError = $derived(interacted && !isValid);

  const handleInput = (e: Event) => {
    interacted = true;
    const target = e.target as HTMLInputElement;
    let val = target.value.replace(/\D/g, "");
    let mask = question.mask || "(999) 999-9999";
    let formatted = "";
    let valIdx = 0;

    for (let i = 0; i < mask.length && valIdx < val.length; i++) {
      if (mask[i] === "9") {
        formatted += val[valIdx++];
      } else {
        formatted += mask[i];
      }
    }
    value = formatted;
    target.value = formatted;
  };
</script>

<input
  id={question.id}
  type="text"
  placeholder={question.mask || "(999) 999-9999"}
  value={value}
  oninput={handleInput}
  required={question.required}
  class="input-base {showError ? 'input-error' : ''}"
/>
