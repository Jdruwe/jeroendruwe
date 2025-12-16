import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

const formatDateLong = (date: Date) => {
  return Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const formatDateISO = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export { cn, formatDateLong, formatDateISO };
