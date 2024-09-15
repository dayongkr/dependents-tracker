import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { cn } from '@/libs/utils';
import Link from 'next/link';
import { Binoculars } from 'lucide-react';

const pretendard = localFont({ src: '../fonts/PretendardVariable.woff2', display: 'swap' });

export const metadata: Metadata = {
  title: 'Dependents Tracker - Viewer',
  description: 'Dependents Tracker shows the dependents of a repository that you want to track.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(pretendard.className)}>
        <aside className="w-full border-r bg-background">
          <nav className="flex items-center gap-2 p-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary transition-all hover:scale-110 hover:text-foreground">
                <Binoculars className="h-3 w-3 bg-primary text-primary-foreground" />
              </span>
              <h1>Dependents Tracker</h1>
            </Link>
          </nav>
        </aside>
        <main className="containeroverflow-y-auto p-6">{children}</main>
        <footer>
          <p className="p-6 text-center text-sm text-gray-500">
            If you have any questions or suggestions, please contact me at{' '}
            <a className="underline" href="mailto:dayongkr@gmail.com">
              dayongkr@gmail.com
            </a>
            .
          </p>
        </footer>
      </body>
    </html>
  );
}
