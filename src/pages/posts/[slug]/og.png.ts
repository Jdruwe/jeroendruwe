import { getPostOgImage } from '@/lib/og-utils.tsx';
import { getAllPosts } from '@/lib/collection-utils.ts';
import type { APIRoute } from 'astro';
import type { Post } from '@/types.ts';

export const getStaticPaths = async () => {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    params: { slug: post.id },
    props: post,
  }));
};

export const GET: APIRoute<Post> = async ({ props: post }) => {
  const image = await getPostOgImage(post);

  return new Response(Buffer.from(image), {
    headers: { 'Content-Type': 'image/png' },
  });
};

// Set to true to ensure static generation at build time
export const prerender = true;
