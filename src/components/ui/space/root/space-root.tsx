import React, { type ComponentProps } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils.ts';

function SpaceRoot({
  className,
  asChild = false,
  ...props
}: ComponentProps<'div'> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      data-slot="space-root"
      className={cn(
        'bg-space text-space-foreground flex flex-col gap-6 rounded border py-6 shadow-sm',
        className,
      )}
      {...props}
    />
  );
}

export { SpaceRoot };
