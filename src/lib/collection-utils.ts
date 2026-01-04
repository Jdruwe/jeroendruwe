import { getCollection } from 'astro:content';
import type { Post } from '@/types.ts';

const isProd = import.meta.env.PROD;

const getAllPosts = async (): Promise<Post[]> => {
  const posts = await getCollection('posts');
  return posts
    .filter((post) => (isProd ? !post.data.draft : true))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
};

const getRecentPosts = async (count = 3): Promise<Post[]> => {
  const posts = await getAllPosts();
  return posts.slice(0, count);
};

export { getAllPosts, getRecentPosts };
