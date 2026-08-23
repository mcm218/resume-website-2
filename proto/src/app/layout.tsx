import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { montserrat, montserratBody } from './fonts';
import { resume } from '@/data/resume';
import './globals.css';

const SITE = 'https://michaelcmuniz.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: `${resume.contact.name} | Resume`,
  description: `${resume.contact.name}, ${resume.contact.title} in ${resume.contact.location}. Experience, projects and skills.`,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE,
    title: `${resume.contact.name} - ${resume.contact.title}`,
    description: `Explore the professional journey of ${resume.contact.name}, a ${resume.contact.title}.`,
  },
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
