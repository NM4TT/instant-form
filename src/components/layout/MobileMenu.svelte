<script lang="ts">
  import { fade, fly } from 'svelte/transition';

  let { aboutTitle = "About" }: { aboutTitle: string } = $props();

  let isOpen = $state(false);
  
  let x = $state(24);
  let y = $state(24);
  let isDragging = false;
  let startTimestamp = 0;

  const toggleMenu = () => {
    const duration = Date.now() - startTimestamp;
    if (duration > 200) return;
    isOpen = !isOpen;
  };

  function draggable(node: HTMLElement) {
    let moving = false;

    const handleStart = () => {
      moving = true;
      startTimestamp = Date.now();
    };

    const handleStop = () => {
      moving = false;
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!moving) return;
      if (e.cancelable) e.preventDefault();
      const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0]?.clientX;
      const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0]?.clientY;
      if (clientX !== undefined && clientY !== undefined) {
        x = Math.max(10, window.innerWidth - clientX - 28);
        y = Math.max(10, window.innerHeight - clientY - 28);
      }
    };

    node.addEventListener('mousedown', handleStart);
    node.addEventListener('touchstart', handleStart);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('mouseup', handleStop);
    window.addEventListener('touchend', handleStop);

    return {
      destroy() {
        node.removeEventListener('mousedown', handleStart);
        node.removeEventListener('touchstart', handleStart);
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('touchmove', handleMove);
        window.removeEventListener('mouseup', handleStop);
        window.removeEventListener('touchend', handleStop);
      }
    };
  }

  const links = $derived([
    { name: aboutTitle, href: "/about/" }
  ]);
</script>

<button 
    use:draggable
    class="md:hidden fixed z-110 flex flex-col gap-1.5 justify-center items-center w-14 h-14 rounded-full border border-secondary/20 bg-secondary shadow-2xl transition-transform active:scale-95 touch-none"
    style="right: {x}px; bottom: {y}px;"
    onclick={toggleMenu}
    aria-label="Toggle Menu">

    <span class="h-0.5 w-6 transition-all duration-300 {isOpen ? 'rotate-45 translate-y-2' : ''} bg-white"></span>
    <span class="h-0.5 w-6 transition-all duration-300 {isOpen ? 'opacity-0' : ''} bg-white"></span>
    <span class="h-0.5 w-6 transition-all duration-300 {isOpen ? '-rotate-45 -translate-y-2' : ''} bg-white"></span>
</button>

{#if isOpen}
    <div
      in:fade={{ duration: 200 }}
      out:fade={{ duration: 200 }}
      class="fixed inset-0 z-100 backdrop-blur-xl bg-black/40"
      onclick={() => isOpen = false}
      onkeydown={(e) => e.key === 'Escape' && (isOpen = false)}
      role="presentation">
    </div>

    <div 
        in:fly={{ x: 200, duration: 300 }}
        out:fly={{ x: 200, duration: 300 }}
        class="flex flex-col fixed top-0 right-0 w-[85%] max-w-xs h-full z-101 shadow-2xl p-8 border-l border-secondary/10 bg-white"
        role="navigation"
        aria-label="mobile menu">

        <nav class="flex flex-col gap-6 mt-12">
          {#each links as link}
            <a 
                href={link.href} 
                onclick={() => isOpen = false}
                class="font-display text-2xl font-bold tracking-tighter hover:text-secondary transition-colors duration-200"
            >
                {link.name}
            </a>
          {/each}
        </nav>
    </div>
{/if}
