import getReadingTime from 'reading-time';
import { defineMdastPlugin } from 'satteri';

export const mdastReadingTimePlugin = defineMdastPlugin({
  name: 'mdast-reading-time',
  after(root, context) {
    const readingTime = getReadingTime(context.textContent(root));
    if (context.data.astro !== undefined) {
      // readingTime.text will give us minutes read as a friendly string,
      // i.e. "3 min read"
      context.data.astro.frontmatter.minutesRead = readingTime.text;
    }
  },
});
