import { type CollectionEntry, getCollection } from 'astro:content';

const isProd = import.meta.env.PROD;

const getAllPosts = async (): Promise<CollectionEntry<'blog'>[]> => {
  const posts = await getCollection('blog');
  return posts
    .filter((post) => (isProd ? !post.data.draft : true))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
};

const getRecentPosts = async (
  count = 3,
): Promise<CollectionEntry<'blog'>[]> => {
  const posts = await getAllPosts();
  return posts.slice(0, count);
};

export { getAllPosts, getRecentPosts };
