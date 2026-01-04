import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import fs from 'node:fs/promises';
import type { Post } from '@/types.ts';

const svgAsPng = (svg: string) => {
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
};

const getPostOgImage = async ({ data }: Post) => {
  const svg = await satori(
    <div
      style={{
        color: 'black',
        fontFamily: 'GeistMono-Regular',
        fontSize: 60,
        padding: 20,
      }}
    >
      {data.title}
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'GeistMono-Regular',
          data: await fs.readFile(
            './src/assets/fonts/og/GeistMono-Regular.ttf',
          ),
          style: 'normal',
        },
      ],
    },
  );

  return svgAsPng(svg);
};

export { getPostOgImage };
