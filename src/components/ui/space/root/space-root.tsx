import { cn } from '@/lib/utils.ts';
import { mergeProps, useRender } from '@base-ui/react';
import { cva, type VariantProps } from 'class-variance-authority';

const spaceRootVariants = cva(
  'ring-foreground/10 bg-space shadow-sm text-space-foreground group/space flex flex-col overflow-hidden rounded-xl py-4 text-sm ring-1 has-data-[slot=space-footer]:pb-0',
  {
    variants: {
      gap: {
        false: null,
        true: 'gap-4',
      },
    },
    defaultVariants: {
      gap: true,
    },
  },
);

interface SpaceRootProps
  extends useRender.ComponentProps<'div'>,
    VariantProps<typeof spaceRootVariants> {}

function SpaceRoot({ render, className, gap, ...props }: SpaceRootProps) {
  // const { render, className, ...otherProps } = props;

  return useRender({
    defaultTagName: 'div',
    render,
    props: {
      ...mergeProps<'div'>(
        {
          className: cn(spaceRootVariants({ gap }), className),
        },
        props,
      ),
      'data-slot': 'space-root',
    },
  });
}

export { SpaceRoot };
