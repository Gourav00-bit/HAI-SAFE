import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'HAI-SAFE — Human-AI Intelligence for Safer Clinical Decisions',
  description:
    'HAI-SAFE is an explainable clinical decision-support platform that transforms fragmented patient information into structured clinical intelligence, grounded in evidence and designed for doctor-led decisions.',
  keywords: 'clinical decision support, AI-assisted diagnosis, breast cancer, oncology, explainable AI, evidence-based medicine',
  authors: [{ name: 'HAI-SAFE Clinical Intelligence' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0D1B2E',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#0D1B2E" />
      </head>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
