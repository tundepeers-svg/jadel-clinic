import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import '@/styles/globals.css';
import { APP_CONFIG } from '@/lib/constants';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: `${APP_CONFIG.name} - ${APP_CONFIG.tagline}`,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: `${APP_CONFIG.name} - Modern AI-powered hospital appointment management system in ${APP_CONFIG.location}. Book appointments, consult experienced doctors, manage medical records securely.`,
  keywords: ['hospital', 'healthcare', 'appointments', 'doctors', 'medical', 'clinic', 'Lagos', 'Nigeria', 'AI healthcare'],
  authors: [{ name: APP_CONFIG.name }],
  creator: APP_CONFIG.name,
  publisher: APP_CONFIG.name,
  metadataBase: new URL(APP_CONFIG.url),
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: APP_CONFIG.url,
    title: `${APP_CONFIG.name} - ${APP_CONFIG.tagline}`,
    description: `Modern AI-powered hospital appointment management system in ${APP_CONFIG.location}`,
    siteName: APP_CONFIG.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_CONFIG.name} - ${APP_CONFIG.tagline}`,
    description: `Modern AI-powered hospital appointment management system in ${APP_CONFIG.location}`,
    creator: '@jadelclinic',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
