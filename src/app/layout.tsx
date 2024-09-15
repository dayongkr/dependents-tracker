import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { cn } from '@/libs/utils';
import Link from 'next/link';
import { Binoculars } from 'lucide-react';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

const pretendard = localFont({ src: '../fonts/PretendardVariable.subset.woff2', display: 'swap', weight: '45 920' });

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
        <aside className="sticky top-0 z-50 bg-background px-6 py-4">
          <nav className="flex items-center justify-between gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary transition-all hover:scale-110 hover:text-foreground">
                <Binoculars className="h-3 w-3 bg-primary text-primary-foreground" />
              </span>
              <h1>Dependents Tracker</h1>
            </Link>
            <Link href="https://github.com/dayongkr/dependents-tracker" target="_blank" title="GitHub Repository">
              <GitHubLogoIcon className="h-6 w-6 text-muted-foreground hover:text-foreground" />
            </Link>
          </nav>
        </aside>
        <main className="container max-w-5xl overflow-y-auto p-6">{children}</main>
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
