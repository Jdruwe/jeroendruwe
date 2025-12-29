import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils.ts';

const spaceVariants = cva(
  'text-space-foreground bg-space w-full rounded border p-3 relative',
);

function Space({
  className,
  asChild = false,
  ...props
}: ComponentProps<'div'> &
  VariantProps<typeof spaceVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      data-slot="space"
      className={cn(spaceVariants({ className }))}
      {...props}
    />
  );
}

export { Space };
