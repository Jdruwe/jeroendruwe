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

const RecordingError = ({ message }: { message: string }) => (
  <p className="text-red-500">{message}</p>
);

const RecordingInProgress = () => (
  <p className="animate-pulse font-medium text-red-500">
    Recording in progress...
  </p>
);

const RecordingPlayer = ({ audioUrl }: { audioUrl: string }) => (
  <audio src={audioUrl} controls className="w-full" />
);

const RecordingUnavailable = () => (
  <p className="text-muted-foreground">No recording available.</p>
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
