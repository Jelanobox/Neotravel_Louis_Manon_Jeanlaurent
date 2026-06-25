# 🎨 Intégration du ChatWidget dans le Frontend

## 📍 Fichier à modifier: `frontend/app/page.tsx`

### Avant (Current)

```tsx
import Hero from '@/components/Hero';
import ChatWidget from '@/components/ChatWidget';
import TrustBanner from '@/components/TrustBanner';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Hero />
      <ChatWidget />
      <TrustBanner />
      <Footer />
    </main>
  );
}
```

### Après (Avec n8n Integration)

**Option A: Remplacer le ChatWidget existant**

```tsx
import Hero from '@/components/Hero';
import ChatWidgetN8n from '@/components/ChatWidgetN8n';  // 👈 Nouveau
import TrustBanner from '@/components/TrustBanner';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Hero />
      <ChatWidgetN8n />  {/* 👈 Remplacé */}
      <TrustBanner />
      <Footer />
    </main>
  );
}
```

**Option B: Page dédiée au Chat (Recommandé)**

1. Créer: `frontend/app/chat/page.tsx`

```tsx
import ChatWidgetN8n from '@/components/ChatWidgetN8n';

export default function ChatPage() {
  return <ChatWidgetN8n />;
}
```

2. Ajouter un lien dans Hero vers `/chat`:

```tsx
<a href="/chat" className="btn btn-primary">
  Demander un Devis Maintenant
</a>
```

---

## 🔗 Architecture du Flux Complet

```
┌─────────────────────────────────────────┐
│   Frontend (Next.js)                    │
│   - ChatWidgetN8n.tsx                   │
│   - Envoie message via webhook          │
└──────────────┬──────────────────────────┘
               │ POST
               ▼
┌─────────────────────────────────────────┐
│   n8n Webhook                           │
│   - Reçoit message utilisateur          │
│   - Valide les données                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   AI Agent (OpenAI GPT-4o)              │
│   - Parse conversation                  │
│   - Extrait paramètres structurés       │
│   - Valide champs obligatoires          │
└──────────────┬──────────────────────────┘
               │
      ┌────────┴─────────┐
      ▼                  ▼
┌──────────────┐  ┌──────────────┐
│ calculer_    │  │   Airtable   │
│ devis()      │  │   - Sauve    │
│ - Calcule    │  │     lead     │
│   tarif      │  │   - Update   │
└────┬─────────┘  │     status   │
     │            └──────────────┘
     │
     └────────────┬─────────────┘
                  │
                  ▼
         ┌──────────────────┐
         │  Respond Webhook │
         │  Retourne JSON   │
         └────────┬─────────┘
                  │
                  ▼
         Frontend reçoit réponse
```

---

## 🧪 Vérifier que Tout Marche

### 1️⃣ Console du Frontend

Ouvrir DevTools (F12) → Console

Vous devriez voir:
```
✅ Webhook URL correctly loaded
✅ Message sent to: https://manon59118.app.n8n.cloud/webhook/...
```

### 2️⃣ Logs n8n

Dans n8n, ouvrir le workflow → **Executions**

Vous devriez voir les webhooks entrants.

### 3️⃣ Vérifier Airtable

Les leads doivent apparaître dans:
https://airtable.com/apptD8AlV6sQFrIOI

---

## 🎨 Personnaliser le Style

Le ChatWidget utilise **Tailwind CSS**. Pour le modifier:

**Fichier:** `frontend/components/ChatWidgetN8n.tsx`

### Changer les couleurs

```tsx
// Actuellement: Bleu
className="bg-blue-600"  // ← Changer en: bg-purple-600, bg-indigo-600, etc

// Exemple: Gradient personnalisé
className="bg-gradient-to-r from-yellow-400 to-orange-500"
```

### Changer la position

Par défaut: Prend tout l'écran (`h-screen`)

Pour un widget flottant (popup):

```tsx
<div className="fixed bottom-4 right-4 w-96 h-96 rounded-lg shadow-2xl">
  {/* Contenu du chat */}
</div>
```

---

## 📱 Mobile Responsive

Le ChatWidget est déjà responsive grâce à Tailwind:

```tsx
className="max-w-xs lg:max-w-md"  // Mobile: petit, Desktop: moyen
```

---

## 🚀 Démarrer le Frontend

```bash
cd frontend
npm install  # Si nécessaire
npm run dev
```

Accéder à: http://localhost:3000

---

## ✅ Checklist Intégration

- [ ] ChatWidgetN8n.tsx existe dans components/
- [ ] page.tsx importe le nouveau component
- [ ] .env.local a NEXT_PUBLIC_N8N_WEBHOOK_URL
- [ ] Frontend démarre sans erreurs (npm run dev)
- [ ] ChatWidget s'affiche correctement
- [ ] Message test envoie au webhook
- [ ] n8n reçoit et traite le message
- [ ] Réponse affichée dans le chat
