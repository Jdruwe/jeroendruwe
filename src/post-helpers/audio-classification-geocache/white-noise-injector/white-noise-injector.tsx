import {
  SpaceFooter,
  SpaceHeader,
  SpaceRoot,
  SpaceTitle,
} from '@/components/ui/space';
import { Button } from '@/components/ui/button.tsx';
import { SpaceContent } from '@/components/ui/space/content/space-content.tsx';
import { MicIcon, SquareIcon } from 'lucide-react';
import { cn } from '@/lib/utils.ts';
import { useWhiteNoiseInjector, type Status } from './use-white-noise-injector';

const WhiteNoiseInjector = () => {
  const { status, startInjecting, stopInjecting, audioUrl } =
    useWhiteNoiseInjector();

  const hasStatus = (...statuses: Status[]) => {
    return statuses.includes(status);
  };

  const actionsDisabled = hasStatus('starting', 'stopping');

  return (
    <SpaceRoot gap={!audioUrl}>
      <SpaceHeader>
        <SpaceTitle>White Noise Injector</SpaceTitle>
        <Button
          variant="ghost"
          render={
            <a
              href="https://github.com/Jdruwe/jeroendruwe/blob/master/src/post-helpers/audio-classification-geocache/white-noise-injector/white-noise-injector.tsx"
              target="_blank"
            >
              Source
            </a>
          }
        />
      </SpaceHeader>
      <SpaceContent
        className={cn({ 'animate-noise bg-noise p-5': !!audioUrl })}
      >
        <div className="grid place-items-center">
          {hasStatus('idle', 'starting') && (
            <p>No white noise injection active</p>
          )}
          {hasStatus('error') && (
            <p className="text-red-500">White noise injection failed</p>
          )}
          {hasStatus('running') && (
            <p className="animate-pulse font-medium text-red-500">
              White noise injection in progress...
            </p>
          )}
        </div>
        {/*{!isRecording && !audioUrl && (*/}
        {/*  <p className="text-muted-foreground mx-auto w-fit">*/}
        {/*    Click "Start recording" below to check out the noise injector.*/}
        {/*  </p>*/}
        {/*)}*/}
        {/*{isRecording && (*/}
        {/*  <p className="mx-auto w-fit animate-pulse font-medium text-red-500">*/}
        {/*    Recording in progress...*/}
        {/*  </p>*/}
        {/*)}*/}
        {/*{!!audioUrl && <audio src={audioUrl} controls className="w-full" />}*/}
        {/*{!!error && <p className="mx-auto w-fit text-red-500">{error}</p>}*/}
      </SpaceContent>
      <SpaceFooter>
        {hasStatus('idle', 'starting', 'error', 'finished') && (
          <Button
            onClick={startInjecting}
            className="w-full"
            disabled={actionsDisabled}
          >
            <MicIcon /> Start recording
          </Button>
        )}
        {hasStatus('running', 'stopping') && (
          <Button
            onClick={stopInjecting}
            variant="destructive"
            className="w-full"
            disabled={actionsDisabled}
          >
            <SquareIcon /> Stop recording
          </Button>
        )}
      </SpaceFooter>
    </SpaceRoot>
  );
};

export { WhiteNoiseInjector };
