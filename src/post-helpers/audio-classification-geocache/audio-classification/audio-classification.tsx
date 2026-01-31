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
  const { status, startClassification, stopClassification, categories } =
    useAudioClassification();

  return (
    <SpaceRoot>
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
        {(status === 'idle' || status === 'starting') && (
          <p className="text-muted-foreground mx-auto w-fit">
            No classification happening right now.
          </p>
        )}
        {(status === 'running' || status === 'stopping') && (
          <div className="flex flex-wrap gap-3">
            <ul className="list-inside list-disc">
              {categories.length === 0 && <li>Detection loading...</li>}
              {categories.map((category) => (
                <li key={category.label}>
                  {category.label}: {(category.score * 100).toFixed(2)}%
                </li>
              ))}
            </ul>
          </div>
        )}
        {status === 'error' && (
          <p className="mx-auto w-fit text-red-500">
            Audio classification failed
          </p>
        )}
      </SpaceContent>
      <SpaceFooter>
        {(status === 'idle' || status === 'starting' || status === 'error') && (
          <Button
            onClick={startClassification}
            className="w-full"
            disabled={status === 'starting'}
          >
            <MicIcon /> Start classification
          </Button>
        )}
        {(status === 'running' || status === 'stopping') && (
          <Button
            onClick={stopClassification}
            variant="destructive"
            className="w-full"
            disabled={status === 'stopping'}
          >
            <SquareIcon /> Stop classification
          </Button>
        )}
      </SpaceFooter>
    </SpaceRoot>
  );
};

export { AudioClassification };
