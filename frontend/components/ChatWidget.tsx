// components/ChatWidget.tsx — Widget chat connecté au workflow n8n
// Ce composant intègre le chat n8n via iframe ou API webhook
'use client';
import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/neotravel-chat';

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'Bonjour ! Je suis l\'assistant NeoTravel 🚌\n\nPour vous établir un devis, j\'ai besoin de quelques informations :\n\n1. Votre **ville de départ** et **destination** ?\n2. La **date** de votre voyage ?\n3. Le **nombre de passagers** ?',
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
          sessionId,
          message: userMsg.content,
          timestamp: userMsg.timestamp.toISOString(),
        }),
      });

      const data = await res.json();

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.output || 'Je n\'ai pas compris, pouvez-vous reformuler ?',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
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
    <section id="devis" style={{ padding: '64px 0', background: '#EBF3FB' }}>
      <div className="container" style={{ maxWidth: 700 }}>
        <h2 style={{ textAlign: 'center', color: '#1B3A6B', marginBottom: 8, fontSize: 22 }}>
          Obtenir mon devis
        </h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: 32, fontSize: 14 }}>
          Notre conseiller en ligne recueille vos informations et vous génère un devis en temps réel.
        </p>

        {/* Chat window */}
        <div style={{
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          border: '1px solid #e0e8f0',
        }}>
          {/* Header */}
          <div style={{ background: '#1B3A6B', color: '#fff', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 10, height: 10, background: '#4CAF50', borderRadius: '50%' }} />
            <span style={{ fontWeight: 'bold', fontSize: 14 }}>Agent NeoTravel</span>
            <span style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.7 }}>En ligne</span>
          </div>

          {/* Messages */}
          <div style={{ height: 380, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  maxWidth: '78%',
                  padding: '10px 16px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? '#2E75B6' : '#F4F7FB',
                  color: msg.role === 'user' ? '#fff' : '#333',
                  fontSize: 14,
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '10px 16px', borderRadius: '16px 16px 16px 4px', background: '#F4F7FB', fontSize: 14, color: '#888' }}>
                  ⌛ En cours de traitement...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #e8eef4', display: 'flex', gap: 10 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Décrivez votre trajet..."
              disabled={loading}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: 8,
                border: '1px solid #d0dcea',
                fontSize: 14,
                outline: 'none',
                background: loading ? '#f8f8f8' : '#fff',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: 14, opacity: loading || !input.trim() ? 0.5 : 1 }}
            >
              Envoyer
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#999', marginTop: 12, fontSize: 12 }}>
          🔒 Vos données sont transmises de manière sécurisée. Devis envoyé par email sous 2 minutes.
        </p>
      </div>
    </section>
  );
}
