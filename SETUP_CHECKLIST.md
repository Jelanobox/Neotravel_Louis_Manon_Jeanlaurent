# 🚀 Checklist Setup NeoTravel - Chat + n8n + Airtable

## 📋 Phase 1: Configuration des Credentials (n8n)

### ✅ Étape 1: Configurer les Credentials n8n

Suivez [N8N_SETUP_GUIDE.md](./N8N_SETUP_GUIDE.md) sections **"Credentials à Configurer dans n8n"**

Vous devez avoir :
- ✅ OpenAI Credential (avec votre token)
- ✅ Airtable Credential (avec votre PAT)

### ✅ Étape 2: Créer le Webhook n8n

1. Ouvrir n8n: https://manon59118.app.n8n.cloud/
2. Aller au workflow `NeoTravel — Agent Devis`
3. Ajouter un nœud **Webhook**
   - Method: `POST`
   - Path: `/neo-lead`
4. **COPIER l'URL complète du webhook** → ressemblera à:
   ```
   https://manon59118.app.n8n.cloud/webhook/abc123xyz
   ```

### ✅ Étape 3: Mettre à jour .env.local

```bash
# Remplacer YOUR_WEBHOOK_ID par l'ID réel
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://manon59118.app.n8n.cloud/webhook/YOUR_WEBHOOK_ID
```

**Fichier:** `.env.local`

---

## 🎨 Phase 2: Intégrer le Chat dans le Frontend

### ✅ Étape 4: Ajouter le ChatWidget à la page

Modifier `frontend/app/page.tsx`:

```tsx
import ChatWidgetN8n from '@/components/ChatWidgetN8n';

export default function Home() {
  return (
    <div>
      {/* Autres contenu... */}
      <ChatWidgetN8n />
    </div>
  );
}
```

### ✅ Étape 5: Vérifier les imports

S'assurer que le fichier `frontend/components/ChatWidgetN8n.tsx` existe ✅

---

## 🔧 Phase 3: Configuration n8n (Workflow)

### ✅ Étape 6: Connecter Airtable au Webhook

1. Dans n8n, ajouter un nœud **Airtable**
2. Configuration:
   - Credential: `Airtable - NeoTravel`
   - Operation: `Create Record`
   - Base: `apptD8AlV6sQFrIOI`
   - Table: (celle qui contient les leads)

3. Mapper les champs du webhook vers Airtable

### ✅ Étape 7: Ajouter l'AI Agent

1. Ajouter un nœud **AI Agent** (ChatGPT / Claude)
2. Configuration:
   - Model: `gpt-4o`
   - Credential: `OpenAI - NeoTravel`
   - System Prompt: (voir N8N_SETUP_GUIDE.md)

### ✅ Étape 8: Configurer la réponse du webhook

Ajouter un nœud **Respond to Webhook** à la fin du workflow:

```json
{
  "message": "{{ $node['AI Agent'].output.text }}",
  "response": "success"
}
```

---

## 🧪 Phase 4: Tests

### ✅ Étape 9: Tester le Webhook (Curl)

```bash
curl -X POST https://manon59118.app.n8n.cloud/webhook/YOUR_WEBHOOK_ID \
  -H "Content-Type: application/json" \
  -d '{
    "user_message": "Je cherche un car pour 30 personnes",
    "session_id": "test_session_1",
    "timestamp": "2026-06-25T14:00:00Z"
  }'
```

**Résultat attendu:**
```json
{
  "message": "Bonjour! Je vais vous aider à trouver un car...",
  "response": "success"
}
```

### ✅ Étape 10: Tester le Frontend

1. Démarrer le serveur:
   ```bash
   cd frontend && npm run dev
   ```

2. Aller sur: http://localhost:3000

3. Le ChatWidget doit être visible

4. Envoyer un message test

---

## 📊 Vérification Airtable

### ✅ Étape 11: Vérifier les données

Après chaque test, vérifier que:
- ✅ Les leads arrivent dans Airtable
- ✅ Les statuts sont corrects
- ✅ Les timestamps sont présents

Aller sur: https://airtable.com/apptD8AlV6sQFrIOI

---

## ⚠️ Checklist Finale

- [ ] Token OpenAI configuré dans n8n ✅
- [ ] Token Airtable configuré dans n8n ✅
- [ ] Webhook n8n créé et URL copiée
- [ ] .env.local mis à jour avec webhook URL
- [ ] ChatWidget importé dans page.tsx
- [ ] Nœud Airtable connecté au webhook
- [ ] AI Agent configuré dans n8n
- [ ] Test curl réussi
- [ ] Test frontend réussi
- [ ] Données visibles dans Airtable

---

## 🎯 Prochaines Étapes

- [ ] Phase 2: Intégrer calculer_devis()
- [ ] Phase 3: Génération automatique PDF
- [ ] Phase 4: Relances automatiques
- [ ] Phase 5: Dashboard direction

---

## 💬 Questions?

Consultez:
- [N8N_SETUP_GUIDE.md](./N8N_SETUP_GUIDE.md) - Guide complet n8n
- [airtable/schema.md](./airtable/schema.md) - Schéma Airtable
- [n8n/README.md](./n8n/README.md) - Documentation workflows

## 🔐 Sécurité

- ✅ .env.local jamais commité (dans .gitignore)
- ✅ Tokens stockés localement uniquement
- ✅ Webhook n8n public mais sécurisé par validation n8n
