// components/Hero.tsx — Section héro NéoTravel Bus
'use client';
import Image from 'next/image';

export default function Hero() {
  return (
    <header style={{ background: 'var(--teal)', color: 'var(--white)' }}>

      {/* ── Navbar ── */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <Image src="/logo.svg" alt="NéoTravel Bus" width={200} height={60} priority />

        <div style={{ display: 'flex', gap: 32, fontSize: 14, fontWeight: 600 }}>
          <a href="#devis" style={{ color: 'rgba(255,255,255,0.8)' }}>Devis gratuit</a>
          <a href="#comment-ca-marche" style={{ color: 'rgba(255,255,255,0.8)' }}>Comment ça marche</a>
          <a href="#contact" style={{ color: 'rgba(255,255,255,0.8)' }}>Contact</a>
        </div>

        <a href="#devis" className="btn-primary" style={{ padding: '10px 22px', fontSize: 14 }}>
          Obtenir un devis →
        </a>
      </nav>

      {/* ── Hero content ── */}
      <div className="container" style={{ padding: '80px 24px 90px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>

        {/* Left — texte */}
        <div>
          <div className="badge" style={{ marginBottom: 20 }}>✦ Réponse immédiate — Devis en 2 minutes</div>

          <h1 style={{ fontSize: 46, fontWeight: 900, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-0.5px' }}>
            Réservez votre car,<br />
            <span style={{ color: 'var(--yellow)' }}>recevez votre devis</span><br />
            en quelques minutes
          </h1>

          <p style={{ fontSize: 17, opacity: 0.8, lineHeight: 1.75, marginBottom: 36, maxWidth: 480 }}>
            Un conseiller disponible à toute heure vous répond instantanément et vous envoie un devis fiable par email.
            Transport de groupe, séminaires, excursions — partout en France.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a href="#devis" className="btn-primary">
              Obtenir mon devis gratuit
            </a>
            <a href="#comment-ca-marche" className="btn-secondary">
              Comment ça marche ?
            </a>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 40, marginTop: 52, flexWrap: 'wrap' }}>
            {[
              { val: '5', label: 'Partenaires certifiés' },
              { val: '< 2 min', label: 'Pour votre devis' },
              { val: '24h/24', label: 'Disponible' },
            ].map(({ val, label }) => (
              <div key={label}>
                <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--yellow)' }}>{val}</div>
                <div style={{ fontSize: 13, opacity: 0.65, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — visual card */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 16,
          border: '1px solid rgba(255,210,48,0.2)',
          padding: 32,
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🚌</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Conseiller NéoTravel</div>
              <div style={{ fontSize: 12, opacity: 0.6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }}/>
                En ligne — réponse immédiate
              </div>
            </div>
          </div>

          {/* Simulated chat preview */}
          {[
            { role: 'bot', text: 'Bonjour ! Pour votre devis, quel est votre trajet et la date prévue ?' },
            { role: 'user', text: 'Lille → Paris, 45 personnes, le 15 juillet' },
            { role: 'bot', text: '✅ Devis calculé : 1 247 € HT / 1 372 € TTC\nVoulez-vous recevoir ce devis par email ?' },
          ].map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 12,
            }}>
              <div style={{
                maxWidth: '82%',
                padding: '10px 14px',
                borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                background: msg.role === 'user' ? 'var(--yellow)' : 'rgba(255,255,255,0.1)',
                color: msg.role === 'user' ? 'var(--teal)' : 'var(--white)',
                fontSize: 13,
                fontWeight: msg.role === 'user' ? 600 : 400,
                lineHeight: 1.5,
                whiteSpace: 'pre-line',
              }}>
                {msg.text}
              </div>
            </div>
          ))}

          <div style={{
            marginTop: 16,
            background: 'rgba(255,255,255,0.07)',
            borderRadius: 8,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 13,
            opacity: 0.5,
          }}>
            <span>Posez votre question…</span>
          </div>
        </div>
      </div>
    </header>
  );
}
