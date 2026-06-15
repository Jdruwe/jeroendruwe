// Import the glob loader
import { glob } from 'astro/loaders';
// Import utilities from `astro:content`
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
// Define a `loader` and `schema` for each collection
const posts = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDate: z.date(),
      description: z.string(),
      image: image().optional(),
      tags: z.array(z.string()),
      draft: z.boolean().optional(),
    }),
});
export const collections = { posts };
