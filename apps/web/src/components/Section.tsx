export function Section({ children, title }: Readonly<{ children: React.ReactNode; title: string }>) {
  return (
    <section className="mb-12 mt-6 flex flex-col gap-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}
