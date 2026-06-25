'use client';
// components/TrustBanner.tsx — Bandeau "Ils nous font confiance" avec défilement infini
import { useEffect, useRef } from 'react';

const CLIENTS = [
  { name: 'Engie', initial: 'E', color: '#00AAFF' },
  { name: 'EDF', initial: 'EDF', color: '#FF6600' },
  { name: 'Leroy Merlin', initial: 'LM', color: '#78BE20' },
  { name: 'Decathlon', initial: 'D', color: '#0082C3' },
  { name: 'Société Générale', initial: 'SG', color: '#E30613' },
  { name: 'Michelin', initial: 'M', color: '#FFD700' },
  { name: 'Air France', initial: 'AF', color: '#002157' },
  { name: 'Bouygues', initial: 'B', color: '#00AADD' },
  { name: 'Total Énergies', initial: 'TE', color: '#F16E00' },
  { name: 'Capgemini', initial: 'CG', color: '#0070AD' },
];

export default function TrustBanner() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let x = 0;
    let raf: number;
    const speed = 0.5;

    function animate() {
      x -= speed;
      const totalWidth = track!.scrollWidth / 2;
      if (Math.abs(x) >= totalWidth) x = 0;
      track!.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(animate);
    }

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const items = [...CLIENTS, ...CLIENTS]; // double pour boucle infinie

  return (
    <section style={{
      background: 'var(--gray-50)',
      borderTop: '1px solid var(--gray-200)',
      borderBottom: '1px solid var(--gray-200)',
      padding: '28px 0',
      overflow: 'hidden',
    }}>
      <div className="container" style={{ marginBottom: 16, textAlign: 'center' }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Ils nous font confiance
        </p>
      </div>

      {/* Masque de fondu sur les bords */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 80,
          background: 'linear-gradient(to right, var(--gray-50), transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: 80,
          background: 'linear-gradient(to left, var(--gray-50), transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }} />

        <div ref={trackRef} style={{ display: 'flex', gap: 32, width: 'max-content', paddingLeft: 40 }}>
          {items.map((client, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: '#fff',
              border: '1px solid var(--gray-200)',
              borderRadius: 10,
              padding: '10px 20px',
              minWidth: 160,
              boxShadow: 'var(--shadow-sm)',
              whiteSpace: 'nowrap',
            }}>
              {/* Logo placeholder rond avec initiales colorées */}
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: client.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 11,
                fontWeight: 900,
                flexShrink: 0,
                letterSpacing: 0.5,
              }}>
                {client.initial}
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{client.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
