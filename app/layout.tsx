import './globals.css';
import { ReactNode } from 'react';
import { HeaderWrapper } from './components/HeaderWrapper';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="../public/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50">
        <HeaderWrapper />
        <main className="flex-1 p-4">{children}</main>
      </body>
    </html>
  );
}
