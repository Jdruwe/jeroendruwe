import { cn } from '@/lib/utils.ts';
import { mergeProps, useRender } from '@base-ui/react';

interface SpaceRootProps extends useRender.ComponentProps<'div'> {}

function SpaceRoot(props: SpaceRootProps) {
  const { render, className, ...otherProps } = props;

  return useRender({
    defaultTagName: 'div',
    render,
    props: {
      ...mergeProps<'div'>(
        {
          className: cn(
            'ring-foreground/10 bg-space shadow-sm text-space-foreground group/space flex flex-col gap-4 overflow-hidden rounded-xl py-4 text-sm ring-1 has-data-[slot=space-footer]:pb-0',
            className,
          ),
        },
        otherProps,
      ),
      'data-slot': 'space-root',
    },
  });
}

export { SpaceRoot };
