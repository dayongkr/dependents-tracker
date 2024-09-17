import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { cn } from '@/libs/utils';
import Footer from './_internal/layout/Footer';
import { GNB } from './_internal/layout/GNB';

const pretendard = localFont({ src: '../fonts/PretendardVariable.subset.woff2', display: 'swap', weight: '45 920' });

export const metadata: Metadata = {
  title: 'Dependents Tracker',
  description: 'Dependents Tracker shows the dependents of a repository that you want to track.',
  metadataBase: new URL('https://dependents-tracker.vercel.app'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(pretendard.className)}>
        <GNB />
        {children}
        <Footer />
      </body>
    </html>
  );
}
