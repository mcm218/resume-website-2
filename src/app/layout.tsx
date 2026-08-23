import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { montserrat, montserratBody } from './fonts';
import { resume } from '@/data/resume';
import './globals.css';

const { name, title, location } = resume.contact;

export const metadata: Metadata = {
  metadataBase: new URL('https://michaelcmuniz.com'),
  title: `${name} | Resume`,
  description: `${name}, ${title} in ${location}. Experience, projects and skills.`,
  alternates: { canonical: '/' },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${montserratBody.variable} h-full`}>
      <body className="min-h-full">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
