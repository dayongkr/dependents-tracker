export function Section({ children, title }: Readonly<{ children: React.ReactNode; title: string }>) {
  return (
    <section className="my-12">
      <h2 className="mb-6 text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}
