import React, { type ComponentProps } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils.ts';

function SpaceTitle({
  className,
  asChild = false,
  ...props
}: ComponentProps<'div'> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      data-slot="space-title"
      className={cn('text-lg leading-none font-semibold', className)}
      {...props}
    />
  );
}

export { SpaceTitle };
