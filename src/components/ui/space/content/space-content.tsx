import { cn } from '@/lib/utils.ts';
import { mergeProps, useRender } from '@base-ui/react';

interface SpaceContentProps extends useRender.ComponentProps<'div'> {}

function SpaceContent(props: SpaceContentProps) {
  const { render, className, ...otherProps } = props;

  return useRender({
    defaultTagName: 'div',
    render,
    props: {
      ...mergeProps<'div'>({ className: cn('px-4', className) }, otherProps),
      'data-slot': 'space-content',
    },
  });
}

export { SpaceContent };
