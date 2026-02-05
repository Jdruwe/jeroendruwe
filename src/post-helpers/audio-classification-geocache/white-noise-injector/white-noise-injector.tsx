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
            <p>White noise injection inactive</p>
          )}
          {hasStatus('error') && (
            <p className="text-red-500">White noise injection failed</p>
          )}
          {hasStatus('running') && (
            <p className="animate-pulse font-medium text-red-500">
              White noise injection active...
            </p>
          )}
          {hasStatus('finished') && !!audioUrl && (
            <audio src={audioUrl} controls className="w-full" />
          )}
        </div>
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
