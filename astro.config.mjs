import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwind from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';
import icon from 'astro-icon';

export default defineConfig({
  integrations: [
    svelte(),
    icon({
      include: {
        mdi: ['*'],
      },
    })
  ],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },
  trailingSlash: 'always',
  vite: {
    plugins: [
      tailwind(),
      Icons({
        compiler: 'svelte',
        autoInstall: true,
      }),
    ],
  },
});
