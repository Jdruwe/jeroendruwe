import {
  SpaceFooter,
  SpaceHeader,
  SpaceRoot,
  SpaceTitle,
} from '@/components/ui/space';
import { Button } from '@/components/ui/button.tsx';
import { SpaceContent } from '@/components/ui/space/content/space-content.tsx';
import { useWhiteNoiseProcessor } from '@/post-helpers/audio-classification-geocache/white-noise-processor/use-white-noise-processor.ts';
import { MicIcon, SquareIcon } from 'lucide-react';

const WhiteNoiseProcessor = () => {
  const { isRecording, startRecording, stopRecording, audioUrl, error } =
    useWhiteNoiseProcessor();

  return (
    <SpaceRoot>
      <SpaceHeader>
        <SpaceTitle>White Noise Processor</SpaceTitle>
        <Button
          variant="ghost"
          render={
            <a
              href="https://github.com/Jdruwe/jeroendruwe/blob/master/src/post-helpers/audio-classification-geocache/audio-recorder.tsx"
              target="_blank"
            >
              Source
            </a>
          }
        />
      </SpaceHeader>
      <SpaceContent>
        {audioUrl && <audio src={audioUrl} controls className="w-full" />}
      </SpaceContent>
      <SpaceFooter>
        {isRecording ? (
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

export { WhiteNoiseProcessor };
