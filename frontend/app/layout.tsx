// app/layout.tsx — Layout racine Next.js App Router
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NéoTravel Bus — Devis de car instantané pour groupes',
  description:
    'Obtenez un devis pour votre transport de groupe en quelques minutes. Cars, séminaires, excursions partout en France. Réponse immédiate, 5 transporteurs certifiés.',
  keywords: ['location car', 'transport groupe', 'devis car', 'réservation autocar', 'NéoTravel'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
