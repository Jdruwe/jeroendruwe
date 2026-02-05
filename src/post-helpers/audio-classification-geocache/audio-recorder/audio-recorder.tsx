import {
  SpaceFooter,
  SpaceHeader,
  SpaceRoot,
  SpaceTitle,
} from '@/components/ui/space';
import { SpaceContent } from '@/components/ui/space/content/space-content.tsx';
import { Button } from '@/components/ui/button.tsx';
import { MicIcon, SquareIcon } from 'lucide-react';
import { useAudioRecorder } from './use-audio-recorder';

const AudioRecorder = () => {
  const { status, audioUrl, startRecording, stopRecording } =
    useAudioRecorder();

  return (
    <SpaceRoot>
      <SpaceHeader>
        <SpaceTitle>Voice recording</SpaceTitle>
        <Button
          variant="ghost"
          render={
            <a
              href="https://github.com/Jdruwe/jeroendruwe/blob/master/src/post-helpers/audio-classification-geocache/audio-recorder/audio-recorder.tsx"
              target="_blank"
            >
              Source
            </a>
          }
        />
      </SpaceHeader>
      <SpaceContent>
        <div className="grid place-items-center">
          {(status === 'idle' || status === 'starting') && (
            <p>No recording active</p>
          )}
          {status === 'error' && (
            <p className="text-red-500">Something went wrong</p>
          )}
          {status === 'running' && (
            <p className="animate-pulse font-medium text-red-500">
              Recording in progress...
            </p>
          )}
          {status === 'finished' && !!audioUrl && (
            <audio src={audioUrl} controls className="w-full" />
          )}
        </div>
      </SpaceContent>
      <SpaceFooter>
        {(status === 'running' || status === 'stopping') && (
          <Button
            onClick={stopRecording}
            variant="destructive"
            className="w-full"
            disabled={status === 'stopping'}
          >
            <SquareIcon /> Stop recording
          </Button>
        )}
        {(status === 'idle' ||
          status === 'starting' ||
          status === 'finished') && (
          <Button
            onClick={startRecording}
            className="w-full"
            disabled={status === 'starting'}
          >
            <MicIcon /> Start recording
          </Button>
        )}
      </SpaceFooter>
    </SpaceRoot>
  );
};

export { AudioRecorder };
