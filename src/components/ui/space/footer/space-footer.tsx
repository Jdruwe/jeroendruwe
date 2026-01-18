import React, { type ComponentProps } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils.ts';

function SpaceFooter({
  className,
  asChild = false,
  ...props
}: ComponentProps<'div'> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      data-slot="space-footer"
      className={cn('px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  );
}

export { SpaceFooter };
