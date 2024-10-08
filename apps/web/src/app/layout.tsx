import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { GoogleAnalytics } from '@next/third-parties/google';
import Footer from './_internal/layout/Footer';
import { GNB } from './_internal/layout/GNB';
import './globals.css';

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
      <body className={pretendard.className}>
        <GNB />
        {children}
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-ZYC12N99X9" />
    </html>
  );
}
