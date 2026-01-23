import React, { useState, useRef } from 'react';
import {
  SpaceFooter,
  SpaceHeader,
  SpaceRoot,
  SpaceTitle,
} from '@/components/ui/space';
import { Button } from '@/components/ui/button.tsx';
import { SpaceContent } from '@/components/ui/space/content/space-content.tsx';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MicIcon,
  SquareIcon,
} from 'lucide-react';
import { useStereoPanner } from '@/post-helpers/audio-classification-geocache/stereo-panner/use-stereo-panner.ts';

const StereoPanner = () => {
  const { isPanning, updatePanning, startRecording, stopRecording, error } =
    useStereoPanner();

  // I want to know how people handle naming this methos!
  const handleLeftClick = () => {
    updatePanning(-1); // Pan fully to the left
  };

  const handleRightClick = () => {
    updatePanning(1); // Pan fully to the right
  };

  return (
    <SpaceRoot>
      <SpaceHeader>
        <SpaceTitle>Stereo Panner</SpaceTitle>
        <Button
          variant="ghost"
          render={
            <a
              href="https://github.com/Jdruwe/jeroendruwe/blob/master/src/post-helpers/audio-classification-geocache/stereo-panner/stereo-panner.tsx"
              target="_blank"
            >
              Source
            </a>
          }
        />
      </SpaceHeader>
      <SpaceContent>
        <div>
          <div className="flex gap-2">
            <Button className="flex-1" size="lg" onClick={handleLeftClick}>
              <ArrowLeftIcon /> LEFT
            </Button>
            <Button className="flex-1" size="lg" onClick={handleRightClick}>
              RIGHT <ArrowRightIcon />
            </Button>
          </div>
          <div className="text-muted-foreground">Not recording audio.</div>
        </div>
      </SpaceContent>
      <SpaceFooter>
        {isPanning ? (
          <Button
            onClick={stopRecording}
            variant="destructive"
            className="w-full"
          >
            <SquareIcon /> Stop recording
          </Button>
        ) : (
          <Button onClick={startRecording} className="w-full">
            <MicIcon /> Start recording
          </Button>
        )}
      </SpaceFooter>
    </SpaceRoot>
  );

  // return (
  //   <div
  //     style={{
  //       padding: '30px',
  //       textAlign: 'center',
  //       border: '2px solid #61dafb',
  //       borderRadius: '15px',
  //     }}
  //   >
  //     <h3>Spatial Audio Demo</h3>
  //     <p>This node "moves" your voice in 3D space.</p>
  //
  //     {!isActive ? (
  //       <button
  //         onClick={startAudio}
  //         style={{ padding: '10px 20px', cursor: 'pointer' }}
  //       >
  //         Enable Spatial Mic
  //       </button>
  //     ) : (
  //       <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
  //         <div
  //           style={{
  //             display: 'flex',
  //             justifyContent: 'space-between',
  //             marginBottom: '10px',
  //           }}
  //         >
  //           <span>LEFT</span>
  //           <span>CENTER</span>
  //           <span>RIGHT</span>
  //         </div>
  //
  //         <input
  //           type="range"
  //           min="-1"
  //           max="1"
  //           step="0.1"
  //           value={panValue}
  //           onChange={handlePanChange}
  //           style={{ width: '100%', cursor: 'pointer' }}
  //         />
  //
  //         <div style={{ marginTop: '20px', fontSize: '2rem' }}>
  //           {panValue < -0.2 ? '⬅️' : panValue > 0.2 ? '➡️' : '⏺️'}
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );
};

export { StereoPanner };
