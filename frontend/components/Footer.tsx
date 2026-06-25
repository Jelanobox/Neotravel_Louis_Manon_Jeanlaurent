// components/Footer.tsx — NéoTravel Bus
import Image from 'next/image';

export default function Footer() {
  return (
    <footer id="contact" style={{ background: 'var(--teal-dark)', color: 'rgba(255,255,255,0.75)', padding: '56px 0 28px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 48, marginBottom: 48 }}>

          {/* Brand */}
          <div>
            <Image src="/logo.svg" alt="NéoTravel Bus" width={180} height={54} style={{ marginBottom: 16 }} />
            <p style={{ fontSize: 14, lineHeight: 1.75, maxWidth: 300 }}>
              Spécialiste de la réservation de cars pour groupes en France.
              Transport de séminaires, excursions et événements d'entreprise.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
              {['Devis gratuit', 'Réponse immédiate', '5 transporteurs'].map(tag => (
                <span key={tag} style={{ background: 'rgba(255,210,48,0.1)', border: '1px solid rgba(255,210,48,0.2)', color: 'var(--yellow)', fontSize: 11, padding: '4px 10px', borderRadius: 6, fontWeight: 700 }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ color: 'var(--white)', fontWeight: 700, marginBottom: 16, fontSize: 14 }}>Navigation</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Obtenir un devis', href: '#devis' },
                { label: 'Comment ça marche', href: '#comment-ca-marche' },
                { label: 'Nos transporteurs', href: '#partenaires' },
                { label: 'Contact', href: '#contact' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <a href={href} style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'var(--white)', fontWeight: 700, marginBottom: 16, fontSize: 14 }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              <span>📧 contact@neotravel.fr</span>
              <span>📞 03 20 XX XX XX</span>
              <span>📍 Lille, France</span>
              <span style={{ marginTop: 4, opacity: 0.5 }}>Lun–Ven, 9h–18h</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: 13 }}>
          <span>© 2026 NéoTravel Bus — Tous droits réservés</span>
          <div style={{ display: 'flex', gap: 20, opacity: 0.45 }}>
            <a href="#" style={{ color: 'inherit' }}>Mentions légales</a>
            <a href="#" style={{ color: 'inherit' }}>CGV</a>
            <a href="#" style={{ color: 'inherit' }}>Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
