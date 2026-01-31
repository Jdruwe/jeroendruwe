import {
  SpaceFooter,
  SpaceHeader,
  SpaceRoot,
  SpaceTitle,
} from '@/components/ui/space';
import { Button } from '@/components/ui/button.tsx';
import { SpaceContent } from '@/components/ui/space/content/space-content.tsx';
import { MicIcon, SquareIcon } from 'lucide-react';
import { useAudioClassification } from '@/post-helpers/audio-classification-geocache/audio-classification/use-audio-classification.ts';

const AudioClassification = () => {
  const {
    isRecording,
    startRecording,
    stopRecording,
    audioUrl,
    error,
    categories,
  } = useAudioClassification();

  return (
    <SpaceRoot gap={!audioUrl}>
      <SpaceHeader>
        <SpaceTitle>Audio Classification</SpaceTitle>
        <Button
          variant="ghost"
          render={
            <a
              href="https://github.com/Jdruwe/jeroendruwe/blob/master/src/post-helpers/audio-classification-geocache/audio-classification/audio-classification.tsx"
              target="_blank"
            >
              Source
            </a>
          }
        />
      </SpaceHeader>
      <SpaceContent>
        {!isRecording && !audioUrl && (
          <p className="text-muted-foreground mx-auto w-fit">
            Click "Start recording" below to check out audio classification.
          </p>
        )}
        {isRecording && (
          <ul>
            {categories.map((category) => (
              <li key={category.label}>
                {category.label}: {(category.score * 100).toFixed(2)}%
              </li>
            ))}
          </ul>
        )}
        {!!audioUrl && <audio src={audioUrl} controls className="w-full" />}
        {!!error && <p className="mx-auto w-fit text-red-500">{error}</p>}
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

export { AudioClassification };
