import { cn } from '@/libs/utils';

export function Section({
  children,
  title,
  className,
}: Readonly<{ children: React.ReactNode; title: string; className?: string }>) {
  return (
    <section className={cn('mb-12 mt-6 flex flex-col gap-6', className)}>
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}
