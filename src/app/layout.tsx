import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://michaelcmuniz.com'),
  title: 'Michael Muñiz | Resume',
  description: 'Resume of Michael Muñiz.',
  alternates: { canonical: '/' },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
