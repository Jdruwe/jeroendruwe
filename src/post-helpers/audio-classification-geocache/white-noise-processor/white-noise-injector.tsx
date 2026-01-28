import {
  SpaceFooter,
  SpaceHeader,
  SpaceRoot,
  SpaceTitle,
} from '@/components/ui/space';
import { Button } from '@/components/ui/button.tsx';
import { SpaceContent } from '@/components/ui/space/content/space-content.tsx';
import { useWhiteNoiseInjector } from '@/post-helpers/audio-classification-geocache/white-noise-processor/use-white-noise-injector.ts';
import { MicIcon, SquareIcon } from 'lucide-react';
import { cn } from '@/lib/utils.ts';

// todo: Ik ben niet echt een fan van die namen binnen deze folder, is er een beter manier?
// todo: cn om conditioneel classnames toe te voegen OF beter nog, tailwind-variants gebruiken?

const WhiteNoiseInjector = () => {
  const { isRecording, startRecording, stopRecording, audioUrl, error } =
    useWhiteNoiseInjector();

  return (
    <SpaceRoot className={cn({ 'gap-y-0': !!audioUrl })}>
      <SpaceHeader>
        <SpaceTitle>White Noise Injector</SpaceTitle>
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
      <SpaceContent
        className={cn({ 'animate-noise bg-noise p-5': !!audioUrl })}
      >
        {!isRecording && !audioUrl && (
          <p className="text-muted-foreground mx-auto w-fit">
            Click "Start recording" below to check out the noise injector.
          </p>
        )}
        {isRecording && (
          <p className="mx-auto w-fit animate-pulse font-medium text-red-500">
            Recording in progress...
          </p>
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

export { WhiteNoiseInjector };
