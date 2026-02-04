import {
  SpaceFooter,
  SpaceHeader,
  SpaceRoot,
  SpaceTitle,
} from '@/components/ui/space';
import { Button } from '@/components/ui/button.tsx';
import { SpaceContent } from '@/components/ui/space/content/space-content.tsx';
import { MicIcon, SquareIcon } from 'lucide-react';
import { Slider } from '@/components/ui/slider.tsx';
import { Label } from '@/components/ui/label.tsx';
import { useStereoPanner } from './use-stereo-panner';

const StereoPanner = () => {
  const { pan, setPan, isPanning, startRecording, stopRecording, error } =
    useStereoPanner();

  const handleValueChange = (value: number | readonly number[]) => {
    if (typeof value !== 'number') return;

    setPan(value);
  };

  return (
    <SpaceRoot style={{ transform: `rotate(${pan * 1.5}deg)` }}>
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
        {!!error && <p className="mx-auto w-fit text-red-500">{error}</p>}
        {isPanning && (
          <div className="flex flex-col gap-3">
            <p className="text-muted-foreground">
              For the full panning effect, listen with both left and right
              channels. Using a single earbud or mono speaker may result in
              silent audio at extreme pan values.
            </p>
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="slider-stereo-panner">Panning</Label>
              <span className="text-muted-foreground text-sm">{pan}</span>
            </div>
            <Slider
              id="slider-stereo-panner"
              value={pan}
              onValueChange={handleValueChange}
              min={-1}
              max={1}
              step={0.1}
              className="**:data-[slot='slider-range']:bg-inherit"
            />
          </div>
        )}
        {!isPanning && (
          <p className="text-muted-foreground mx-auto w-fit">
            Click "Start recording" below to check out audio panning.
          </p>
        )}
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
};

export { StereoPanner };
