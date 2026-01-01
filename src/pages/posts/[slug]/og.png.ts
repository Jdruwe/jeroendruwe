import { getCollection } from 'astro:content';
import { generateOgImageForPost } from '@/lib/og-utils.tsx';
import { getAllPosts } from '@/lib/collection-utils.ts';

export async function getStaticPaths() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

export async function GET({ props }) {
  const image = await generateOgImageForPost(props);

  return new Response(image, {
    headers: { 'Content-Type': 'image/png' },
  });
}

// Set to true to ensure static generation at build time
export const prerender = true;
