<script lang="ts">
    let { aboutTitle = "About" }: { aboutTitle: string } = $props();
    const links = $derived([
        { name: aboutTitle, href: "/about/" }
    ]);
</script>

<nav id="desktop">
    <ul class="flex justify-between items-center gap-6">
        {#each links as link}
            <li class="relative group">
                <a 
                    href={link.href}
                    class="font-display text-sm font-bold uppercase tracking-widest 
                           hover:text-secondary px-1 cursor-pointer transition-colors duration-200"
                >
                    {link.name}
                </a>
                <span class="absolute -bottom-1 left-0 w-0 h-px bg-secondary transition-[width] duration-300 group-hover:w-full"></span>
            </li>
        {/each}
    </ul>
</nav>
