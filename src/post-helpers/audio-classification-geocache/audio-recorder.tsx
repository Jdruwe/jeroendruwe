import {
  SpaceFooter,
  SpaceHeader,
  SpaceRoot,
  SpaceTitle,
} from '@/components/ui/space';
import { SpaceContent } from '@/components/ui/space/content/space-content.tsx';
import { Button } from '@/components/ui/button.tsx';
import { MicIcon, SquareIcon } from 'lucide-react';
import { useAudioRecorder } from '@/post-helpers/audio-classification-geocache/use-audio-recorder.ts';

const RecordingError = ({ message }: { message: string }) => (
  <div className="text-red-500">{message}</div>
);

const RecordingInProgress = () => (
  <div className="animate-pulse font-medium text-red-500">
    Recording in progress...
  </div>
);

const RecordingPlayer = ({ audioUrl }: { audioUrl: string }) => (
  <audio src={audioUrl} controls className="w-full" />
);

const RecordingUnavailable = () => (
  <div className="text-muted-foreground">No recording available.</div>
);

const RecorderDisplay = ({
  isRecording,
  audioUrl,
  error,
}: {
  isRecording: boolean;
  audioUrl: string | null;
  error: string | null;
}) => {
  if (error) return <RecordingError message={error} />;
  if (isRecording) return <RecordingInProgress />;
  if (audioUrl) return <RecordingPlayer audioUrl={audioUrl} />;
  return <RecordingUnavailable />;
};

// todo: migrate to Base UI, check /Users/jeroendruwe/work/personal/tanstack/start-app and https://ui.shadcn.com/create?base=base to generate proper colors

const AudioRecorder = () => {
  const { isRecording, startRecording, stopRecording, audioUrl, error } =
    useAudioRecorder();

  return (
    <SpaceRoot>
      <SpaceHeader>
        <SpaceTitle>Voice recording</SpaceTitle>
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
        <div className="grid place-items-center">
          <RecorderDisplay
            isRecording={isRecording}
            audioUrl={audioUrl}
            error={error}
          />
        </div>
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

export { AudioRecorder };
