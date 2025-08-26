import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '../contexts/LanguageContext';
import LanguageLoader from '../components/ui/LanguageLoader';
import InitialLoader from '../components/ui/InitialLoader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VMCloud Platform',
  description: 'Cloud VM rental platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-950 text-white`}>
        <InitialLoader />
        <LanguageProvider>
          {children}
          <LanguageLoader />
        </LanguageProvider>
      </body>
    </html>
  );
}