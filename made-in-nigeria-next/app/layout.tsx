import type { Metadata } from 'next';
import { Fraunces, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-plex-mono',
  weight: ['500', '600'],
});

export const metadata: Metadata = {
  title: {
    default: "Made in Nigeria — Africa's Business Growth Ecosystem",
    template: '%s — Made in Nigeria',
  },
  description:
    'Discover, trust, and grow with verified Nigerian businesses. Made in Nigeria is the AI-powered ecosystem where no business builds alone.',
};

// This root layout intentionally has NO Header/Footer — different route groups
// need different chrome (marketing site vs. auth split-screen vs. dashboard
// sidebar shells). See app/(marketing)/layout.tsx for the Header+Footer wrap.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
