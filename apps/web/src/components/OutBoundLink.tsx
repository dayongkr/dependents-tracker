export function OutBoundLink({
  href,
  children,
  ...props
}: Readonly<{ href: string; children: React.ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>>) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}
