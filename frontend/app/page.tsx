// app/page.tsx — Page principale NéoTravel Bus
import Hero from '@/components/Hero';
import ChatWidget from '@/components/ChatWidget';
import Footer from '@/components/Footer';
import N8nChatWidget from '@/components/N8nChatWidget';
import TrustBanner from '@/components/TrustBanner';

export default function HomePage() {
  return (
    <main>
      <Hero />

      {/* Bandeau "Ils nous font confiance" */}
      <TrustBanner />

      {/* Comment ça marche */}
      <section id="comment-ca-marche" style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="badge" style={{ color: 'var(--teal)', background: 'rgba(4,56,63,0.07)', border: '1px solid rgba(4,56,63,0.15)', marginBottom: 16 }}>
              ✦ Simple et rapide
            </div>
            <h2 style={{ fontSize: 34, fontWeight: 900, color: 'var(--teal)', lineHeight: 1.15 }}>
              Votre devis en 3 étapes
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: 12, fontSize: 16, maxWidth: 480, margin: '12px auto 0' }}>
              Un conseiller virtuel disponible à toute heure prend en charge votre demande, du devis à la confirmation.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {[
              {
                num: '01',
                icon: '💬',
                title: 'Décrivez votre trajet',
                desc: 'Échangez en direct avec notre conseiller : départ, destination, date, nombre de passagers. Réponse immédiate.',
              },
              {
                num: '02',
                icon: '⚡',
                title: 'Recevez votre devis',
                desc: 'En moins de 2 minutes, un devis détaillé et fiable vous est envoyé directement par email.',
              },
              {
                num: '03',
                icon: '✅',
                title: 'Confirmez et voyagez',
                desc: 'Validez votre réservation en ligne. L\'un de nos transporteurs certifiés prend en charge votre groupe.',
              },
            ].map(({ num, icon, title, desc }) => (
              <div key={num} className="step-card">
                <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--gray-200)', letterSpacing: 2, marginBottom: 16 }}>{num}</div>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--teal)', marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section devis */}
      <ChatWidget />

      {/* Partenaires transporteurs */}
      <section id="partenaires" style={{ padding: '72px 0', background: 'var(--gray-50)', borderTop: '1px solid var(--gray-200)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 32 }}>
            Nos transporteurs partenaires
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
            {['VanGo Shuttle', 'TransRegion Bus', 'Prestige Coaches', 'EuroFleet Transport', 'Grand Horizon VIP'].map(name => (
              <div key={name} style={{
                padding: '12px 24px',
                background: '#fff',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--gray-200)',
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--teal)',
                boxShadow: 'var(--shadow-sm)',
              }}>
                🚌 {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <N8nChatWidget />
    </main>
  );
}
