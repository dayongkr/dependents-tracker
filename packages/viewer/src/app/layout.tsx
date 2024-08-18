import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { cn } from '@/libs/utils';
import Link from 'next/link';
import { Binoculars, Home } from 'lucide-react';

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
        <div className="bg-muted flex h-dvh w-screen">
          <aside className="bg-background w-14 border-r">
            <nav className="flex flex-col items-center gap-4 py-4">
              <Link
                href="/"
                className="hover:text-foreground bg-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all hover:scale-110"
              >
                <Binoculars className="bg-primary text-primary-foreground h-4 w-4" />
              </Link>
            </nav>
          </aside>
          <main className="w-full p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
