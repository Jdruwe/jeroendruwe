import { cn } from '@/lib/utils.ts';
import { mergeProps, useRender } from '@base-ui/react';

interface SpaceHeaderProps extends useRender.ComponentProps<'div'> {}

function SpaceHeader(props: SpaceHeaderProps) {
  const { render, className, ...otherProps } = props;

  return useRender({
    defaultTagName: 'div',
    render,
    props: {
      ...mergeProps<'div'>(
        {
          className: cn(
            'group/card-header flex justify-between rounded-t-xl px-4 border-b pb-4',
            className,
          ),
        },
        otherProps,
      ),
      'data-slot': 'space-header',
    },
  });
}

export { SpaceHeader };
