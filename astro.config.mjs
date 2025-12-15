// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';
import { remarkReadingTime } from './remark-reading-time.mjs';

import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['use-sound'],
    },
  },
  integrations: [
    react(),
    expressiveCode({
      themes: ['github-light', 'github-dark'],
      themeCssSelector: (theme) =>
        theme.name === 'github-dark' ? '.dark' : ':root:not(.dark)',
      useDarkModeMediaQuery: false,
    }),
    mdx(),
  ],
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
});
