import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sortBy<T>(array: T[], compareFn: (a: T, b: T) => number): T[] {
  return array.slice().sort(compareFn);
}

export function countBy<T, U>(array: T[], iteratee: (item: T) => U): Map<U, number> {
  const counts = new Map<U, number>();

  for (const item of array) {
    const key = iteratee(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return counts;
}

export function getTopN<T>(array: T[], n: number): T[] {
  return array.slice(0, n);
}
