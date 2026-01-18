import React, { type ComponentProps } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils.ts';

function SpaceHeader({
  className,
  asChild = false,
  ...props
}: ComponentProps<'div'> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      data-slot="space-header"
      className={cn('px-6 [.border-b]:pb-6', className)}
      {...props}
    />
  );
}

export { SpaceHeader };
