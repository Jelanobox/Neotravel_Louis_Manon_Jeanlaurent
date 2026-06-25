// components/N8nChatWidget.tsx
// Embed du widget de chat n8n via leur CDN officiel (@n8n/chat)
// Le widget s'affiche en bulle flottante en bas à droite de la page
'use client';
import { useEffect } from 'react';

const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL || '';

export default function N8nChatWidget() {
  useEffect(() => {
    if (!N8N_WEBHOOK_URL) return;

    // Charger le CSS n8n chat
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
    document.head.appendChild(link);

    // Charger le script n8n chat
    const script = document.createElement('script');
    script.type = 'module';
    script.textContent = `
      import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
      createChat({
        webhookUrl: '${N8N_WEBHOOK_URL}',
        mode: 'window',
        showWelcomeScreen: true,
        initialMessages: [
          "Bonjour ! Je suis l'assistant NéoTravel 🚌",
          "Dites-moi votre trajet, la date et le nombre de passagers — je calcule votre devis en quelques secondes !"
        ],
        i18n: {
          en: {
            title: 'NéoTravel — Devis instantané',
            subtitle: 'Répondez à quelques questions et recevez votre prix',
            footer: '',
            getStarted: 'Obtenir mon devis',
            inputPlaceholder: 'Décrivez votre trajet…',
          }
        }
      });
    `;
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  // Si pas de webhook configuré, afficher un message d'attente
  if (!N8N_WEBHOOK_URL) {
    return (
      <div style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        background: 'var(--teal)',
        color: 'var(--white)',
        padding: '14px 20px',
        borderRadius: 50,
        fontSize: 14,
        fontWeight: 700,
        boxShadow: '0 4px 20px rgba(4,56,63,0.4)',
        border: '2px solid var(--yellow)',
        cursor: 'pointer',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <span>🚌</span>
        <span>Obtenir un devis</span>
        <span style={{ background: 'var(--yellow)', color: 'var(--teal)', fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 800 }}>IA</span>
      </div>
    );
  }

  return null; // Le widget n8n s'injecte lui-même dans le DOM
}
