// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';
import { satteri } from '@astrojs/markdown-satteri';
import { mdastReadingTimePlugin } from './src/mdast/mdast-reading-time';

import expressiveCode from 'astro-expressive-code';

import sitemap from '@astrojs/sitemap';

import d2 from 'astro-d2';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.jeroendruwe.be',
  adapter: cloudflare({
    prerenderEnvironment: 'node',
  }),
  vite: {
    plugins: [tailwindcss()],
    build: {
      // lightningcss (Vite 8's default CSS minifier) merges animation-timeline
      // into the `animation` shorthand during build, e.g.
      //   animation: linear both loading-tip-fill view()
      // Browsers reject that since animation-timeline is not part of the
      // shorthand grammar, so the scroll-driven loading bar in
      // src/post-helpers/catching-offensive-wow-names-with-jev/loading-tip.astro
      // silently breaks in production while working in dev. esbuild's minifier
      // leaves these declarations as written.
      // Tracked upstream, with the workaround blessed by Astro's maintainers:
      // https://github.com/parcel-bundler/lightningcss/issues/1342
      // https://github.com/withastro/astro/issues/17940
      // Remove once the lightningcss issue is fixed.
      cssMinify: 'esbuild',
    },
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
    d2({
      experimental: {
        useD2js: true,
      },
    }),
  ],
  markdown: {
    processor: satteri({
      mdastPlugins: [mdastReadingTimePlugin],
    }),
  },
});
