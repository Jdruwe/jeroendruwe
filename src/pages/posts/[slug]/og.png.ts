import { getPostOgImage } from '@/lib/og-utils.tsx';
import { getAllPosts } from '@/lib/collection-utils.ts';
import type {
  APIRoute,
  GetStaticPaths,
  InferGetStaticParamsType,
  InferGetStaticPropsType,
} from 'astro';

export const getStaticPaths = (async () => {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    params: { slug: post.id },
    props: post,
  }));
}) satisfies GetStaticPaths;

type Params = InferGetStaticParamsType<typeof getStaticPaths>;
type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props, Params> = async ({ props }) => {
  const image = await getPostOgImage(props);

  return new Response(Buffer.from(image), {
    headers: { 'Content-Type': 'image/png' },
  });
};

// Set to true to ensure static generation at build time
export const prerender = true;
