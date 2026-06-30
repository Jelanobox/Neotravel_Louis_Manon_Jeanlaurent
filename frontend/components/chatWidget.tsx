// components/chatWidget.tsx — Widget de chat centré avec style NéoTravel
'use client';
import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

//const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || process.env.NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL || 'https://manon59118.app.n8n.cloud/webhook/255dd347-8ed8-4646-bf10-72116af566e0/chat';
const N8N_WEBHOOK_URL = "https://manon59118.app.n8n.cloud/webhook/neotravel-chat";

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'Bonjour ! Je suis l’assistant NéoTravel 🚌\n\nDites-moi votre trajet, la date et le nombre de passagers pour recevoir un devis rapide.',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          sessionId: sessionId,
        }),
      });

      if (!res.ok) {
        throw new Error(`Erreur HTTP ${res.status}`);
      }

      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await res.json() : await res.text();
      console.log('Voici ce que n8n m\'envoie :', data);

      const messageTexte = typeof data === 'string'
        ? data
        : ( data.reply );

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: messageTexte,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Erreur réseau :', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ Connexion impossible. Vérifiez que le workflow n8n est actif.',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="devis" style={{ padding: '72px 0', background: 'var(--teal)', color: 'var(--white)' }}>
      <div className="container" style={{ maxWidth: 1100 }}>
        <div style={{ textAlign: 'center', marginBottom: 28, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="badge" style={{ marginBottom: 16, color: 'var(--teal)', background: 'rgba(255,210,48,0.2)', border: '1px solid rgba(255,210,48,0.35)' }}>
            ✦ Assistant instantané
          </div>
          <h2 style={{ fontSize: 34, fontWeight: 900, lineHeight: 1.2, marginBottom: 10 }}>
            Demandez votre devis en quelques mots
          </h2>
          <p style={{ fontSize: 16, maxWidth: 660, margin: '0 auto', opacity: 0.85, lineHeight: 1.7 }}>
            Notre conseiller virtuel vous accompagne pas à pas et vous aide à obtenir un devis fiable en quelques secondes.
          </p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 24,
          border: '1px solid rgba(255,210,48,0.24)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <div style={{ width: 10, height: 10, background: '#4ade80', borderRadius: '50%' }} />
            <span style={{ fontWeight: 700 }}>Conseiller NéoTravel</span>
            <span style={{ fontSize: 12, opacity: 0.7 }}>• Réponse immédiate</span>
          </div>

          <div style={{ height: 390, overflowY: 'auto', padding: '24px 24px 12px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  maxWidth: '82%',
                  padding: '12px 16px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? 'var(--yellow)' : 'rgba(255,255,255,0.12)',
                  color: msg.role === 'user' ? 'var(--teal)' : 'var(--white)',
                  fontSize: 14,
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  fontWeight: msg.role === 'user' ? 700 : 400,
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '10px 16px', borderRadius: '16px 16px 16px 4px', background: 'rgba(255,255,255,0.12)', fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>
                  ⌛ En cours de traitement...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Décrivez votre trajet..."
              disabled={loading}
              style={{
                width: '100%',
                maxWidth: 720,
                padding: '12px 16px',
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.18)',
                fontSize: 14,
                outline: 'none',
                background: loading ? 'rgba(248,250,252,0.8)' : 'rgba(255,255,255,0.94)',
                color: 'var(--teal)',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="btn-primary"
              style={{ minWidth: 180, justifyContent: 'center', padding: '12px 24px', opacity: loading || !input.trim() ? 0.6 : 1 }}
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
