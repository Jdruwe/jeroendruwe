import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import path from 'path';
import fs from 'fs';

async function postOgImage() {
  const normalFontPath = path.resolve('./src/assets/fonts/og/Roboto-Bold.ttf');
  // const normalFontPath = path.resolve(
  //   './src/assets/fonts/og/geist-mono-latin-400-normal.ttf',
  // );
  const normalFontBugger = fs.readFileSync(normalFontPath);

  console.log(normalFontBugger);

  const svg = await satori(
    <div
      style={{
        color: 'black',
        fontFamily: 'Roboto',
        fontWeight: '700',
        fontSize: 82,
      }}
    >
      hello, world
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Roboto',
          data: normalFontBugger,
          weight: 700,
        },
      ],
    },
  );

  return svg;
}

function svgBufferToPngBuffer(svg: any) {
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
}

export async function generateOgImageForPost() {
  const svg = await postOgImage();
  return svgBufferToPngBuffer(svg);
}
