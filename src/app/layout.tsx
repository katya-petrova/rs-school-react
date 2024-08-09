import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Pokemon App',
  description: 'My App is a...',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
        <script type="module" src="/src/main.tsx"></script>
      </body>
    </html>
  );
}
