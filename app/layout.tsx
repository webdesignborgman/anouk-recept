import './globals.css';
import { ReactNode } from 'react';
import { HeaderWrapper } from './components/HeaderWrapper';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <HeaderWrapper />
        <main className="flex-1 p-4">{children}</main>
      </body>
    </html>
  );
}
