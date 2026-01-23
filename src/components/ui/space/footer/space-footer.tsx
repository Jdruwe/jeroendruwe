import { cn } from '@/lib/utils.ts';
import { mergeProps, useRender } from '@base-ui/react';

interface SpaceFooterProps extends useRender.ComponentProps<'div'> {}

function SpaceFooter(props: SpaceFooterProps) {
  const { render, className, ...otherProps } = props;

  return useRender({
    defaultTagName: 'div',
    render,
    props: {
      ...mergeProps<'div'>(
        {
          className: cn(
            'bg-muted/50 flex items-center rounded-b-xl border-t p-4',
            className,
          ),
        },
        otherProps,
      ),
      'data-slot': 'space-footer',
    },
  });
}

export { SpaceFooter };
