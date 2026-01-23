import { cn } from '@/lib/utils.ts';
import { mergeProps, useRender } from '@base-ui/react';

interface SpaceTitleProps extends useRender.ComponentProps<'div'> {}

function SpaceTitle(props: SpaceTitleProps) {
  const { render, className, ...otherProps } = props;

  return useRender({
    defaultTagName: 'div',
    render,
    props: {
      ...mergeProps<'div'>(
        {
          className: cn('text-base leading-snug font-medium', className),
        },
        otherProps,
      ),
      'data-slot': 'space-title',
    },
  });
}

export { SpaceTitle };
