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
        <div className="flex h-dvh w-screen bg-muted">
          <aside className="w-14 border-r bg-background">
            <nav className="flex flex-col items-center gap-4 py-4">
              <Link
                href="/"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary transition-all hover:scale-110 hover:text-foreground"
              >
                <Binoculars className="h-4 w-4 bg-primary text-primary-foreground" />
              </Link>
            </nav>
          </aside>
          <main className="w-full p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
