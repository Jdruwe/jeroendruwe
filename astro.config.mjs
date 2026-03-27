// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';
import { remarkReadingTime } from './remark-reading-time.mjs';

import expressiveCode from 'astro-expressive-code';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.jeroendruwe.be',
  adapter: cloudflare({
    prerenderEnvironment: 'node',
  }),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    react(),
    expressiveCode({
      themes: ['github-light', 'github-dark'],
      themeCssSelector: (theme) =>
        theme.name === 'github-dark' ? '.dark' : ':root:not(.dark)',
      useDarkModeMediaQuery: false,
      styleOverrides: {
        codeFontFamily: "'Geist Mono Variable', monospace",
        uiFontFamily: "'Geist Mono Variable', monospace",
      },
    }),
    mdx(),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
});
