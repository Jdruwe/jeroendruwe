import satori from 'satori';
import fs from 'node:fs/promises';
import type { Post } from '@/types.ts';
import { formatDateLong } from '@/lib/utils.ts';
import sharp from 'sharp';

const svgAsPng = async (svg: string) => {
  return await sharp(Buffer.from(svg)).png().toBuffer();
};

const getPostOgImage = async ({ data }: Post) => {
  const svg = await satori(
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: 40,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        background:
          'radial-gradient(125% 125% at 50% 90%, #fff 40%, #155dfc 100%);',
      }}
    >
      <p
        style={{
          fontFamily: 'GeistMono-SemiBold',
          fontWeight: 600,
          fontSize: 100,
          margin: 0,
        }}
      >
        Jeroen Druwé
      </p>
      <p
        style={{
          fontFamily: 'GeistMono-Regular',
          fontSize: 50,
          margin: 0,
          color: '#242424',
        }}
      >
        Code, life, and the occasional random thought.
      </p>
      <p
        style={{
          fontFamily: 'GeistMono-Regular',
          fontSize: 30,
          marginTop: 'auto',
          marginBottom: '0',
          alignSelf: 'flex-end',
          color: '#242424',
        }}
      >
        jeroendruwe.be
      </p>
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
        {
          name: 'GeistMono-SemiBold',
          data: await fs.readFile(
            './src/assets/fonts/og/GeistMono-SemiBold.ttf',
          ),
          weight: 600,
        },
      ],
    },
  );

  return svgAsPng(svg);
};

export { getPostOgImage };
