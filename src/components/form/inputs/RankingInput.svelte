<script lang="ts">
  import { onMount } from 'svelte';
  import type { Question } from '#lib/types';

  let { question, value = $bindable([]) }: { 
    question: Question, 
    value: string[] 
  } = $props();

  onMount(() => {
    if (!value || value.length === 0) {
      value = [...(question.items || [])];
    }
  });

  const move = (index: number, direction: number) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= value.length) return;
    const items = [...value];
    const item = items.splice(index, 1)[0];
    items.splice(newIndex, 0, item);
    value = items;
  };

  // Drag and Drop Logic
  let draggedIndex = $state<number | null>(null);
  let hoveredIndex = $state<number | null>(null);

  const handleDragStart = (e: DragEvent, index: number) => {
    draggedIndex = index;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      // Required for some browsers to trigger drag
      e.dataTransfer.setData("text/plain", index.toString());
    }
  };

  const handleDragOver = (e: DragEvent, index: number) => {
    e.preventDefault();
    hoveredIndex = index;
  };

  const handleDrop = (e: DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      draggedIndex = null;
      hoveredIndex = null;
      return;
    }

    const items = [...value];
    const [movedItem] = items.splice(draggedIndex, 1);
    items.splice(targetIndex, 0, movedItem);
    value = items;

    draggedIndex = null;
    hoveredIndex = null;
  };

  const handleDragEnd = () => {
    draggedIndex = null;
    hoveredIndex = null;
  };
</script>

<div class="flex flex-col gap-2">
  {#each value as item, i (item)}
    <div 
      draggable="true"
      ondragstart={(e) => handleDragStart(e, i)}
      ondragover={(e) => handleDragOver(e, i)}
      ondrop={(e) => handleDrop(e, i)}
      ondragend={handleDragEnd}
      class="flex items-center justify-between p-4 bg-white border rounded-xl shadow-xs transition-all cursor-grab active:cursor-grabbing
             {draggedIndex === i ? 'opacity-40 border-dashed border-secondary' : 'border-secondary/10'}
             {hoveredIndex === i && draggedIndex !== i ? 'border-secondary bg-secondary/5 translate-y-1' : ''}"
    >
      <div class="flex items-center gap-4">
        <span class="text-secondary opacity-40 font-mono text-xs">0{i + 1}</span>
        <span class="font-medium">{item}</span>
      </div>
      
      <div class="flex gap-1">
        <button 
          type="button"
          class="p-2 hover:bg-secondary/10 rounded-lg disabled:opacity-20 cursor-pointer"
          onclick={() => move(i, -1)}
          disabled={i === 0}
          aria-label="Move Up"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button 
          type="button"
          class="p-2 hover:bg-secondary/10 rounded-lg disabled:opacity-20 cursor-pointer"
          onclick={() => move(i, 1)}
          disabled={i === value.length - 1}
          aria-label="Move Down"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  {/each}
</div>
