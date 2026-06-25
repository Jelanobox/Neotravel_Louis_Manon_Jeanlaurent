# 🔧 Guide de Configuration n8n + Airtable + OpenAI

**Status:** Phase 1 - Configuration des credentials et webhook

---

## 📋 Credentials à Configurer dans n8n

### 1️⃣ Credential OpenAI

1. Aller dans n8n → **Settings → Credentials**
2. Cliquer sur **+ New** → rechercher **OpenAI**
3. Remplir :
   - **Name:** `OpenAI - NeoTravel`
   - **API Key:** `sk-proj-XXXXXXXXXXXXX` (votre clé OpenAI - vérifier dans le mail ou settings)
   - **Model:** `gpt-4o` (ou `gpt-4-turbo`)
4. Cliquer **Test Connection** ✅
5. **Save**

### 2️⃣ Credential Airtable

1. Dans n8n → **Settings → Credentials**
2. Cliquer sur **+ New** → rechercher **Airtable**
3. Remplir :
   - **Name:** `Airtable - NeoTravel`
   - **Authentication:** `Personal Access Token`
   - **Token:** `patXXXXXXXXXXXXXXXXXXXXXXXXXXX` (votre token Airtable PAT)
4. Cliquer **Test Connection** ✅
5. **Save**

---

## 🎯 Configurer le Webhook n8n

### Étape 1 : Ajouter un nœud Webhook

1. Ouvrir votre workflow `NeoTravel — Agent Devis`
2. Cliquer sur le **+** pour ajouter un nœud
3. Rechercher **Webhook** et sélectionner
4. Configurer :
   - **Method:** `POST`
   - **Path:** `/neo-lead` (ou `/chat-message`)
   - **Response Mode:** `Respond to Webhook`
   - **Respond When:** `Last Node Executed`

**Copier l'URL complète du webhook :** elle ressemblera à :
```
https://manon59118.app.n8n.cloud/webhook/uuid-here
```

### Étape 2 : Mettre à jour .env.local

Ajouter dans `/Users/manon/Claude/Projects/Neotravel/code/.env.local` :

```bash
# Webhook n8n
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://manon59118.app.n8n.cloud/webhook/YOUR_WEBHOOK_ID
```

---

## 📊 Configurer la Connexion Airtable

### Étape 1 : Ajouter un nœud Airtable

1. Dans votre workflow n8n, ajouter un nœud **Airtable**
2. Configurer :
   - **Credential:** Sélectionner `Airtable - NeoTravel`
   - **Base ID:** `apptD8AlV6sQFrIOI`
   - **Table:** Sélectionner la table (ex: `tblYDuwtbuqS9qeuo`)
   - **Operation:** `Create Record` (pour ajouter des leads)

### Étape 2 : Mapper les champs

Relier les données du webhook aux champs Airtable :

```
Webhook Input → Airtable Fields
├── prospect_name → nom
├── email_address → email
├── passenger_count → nb_passagers
├── departure_date → date_depart
├── destination_city → ville_arrivee
├── departure_city → ville_depart
└── selected_options → options_supplementaires
```

---

## 🤖 Configurer l'AI Agent (OpenAI)

### Étape 1 : Ajouter le nœud AI Agent

1. Dans n8n, ajouter un nœud **OpenAI** (ou **AI Agent**)
2. Configurer :
   - **Model:** `gpt-4o`
   - **Credential:** `OpenAI - NeoTravel`
   - **System Prompt:** Copier depuis [n8n/system-prompt.md](./n8n/system-prompt.md)
   - **Temperature:** `0.3` (faible pour plus de stabilité)

### Étape 2 : Connecter les Tools

L'agent doit appeler :
- ✅ **calculer_devis()** — pour calculer les tarifs
- ✅ **Airtable Lookup** — pour accéder aux tarifs de base
- ✅ **Email Send** — pour envoyer les propositions

---

## 💾 Vérifier Airtable

### Tables requises

Vérifier que votre base `apptD8AlV6sQFrIOI` contient :

| Table | Fields requis |
|-------|---------------|
| `requests` (Leads) | prospect_name, email, passenger_count, departure_date, departure_city, destination_city, status |
| `quotes` (Devis) | request_id, amount_excl_tax, vat_amount, amount_incl_tax, status |
| `pricing_matrices` | matrix_type, lookup_key, coefficient_value, flat_amount |
| `follow_up_logs` | quote_id, sent_at, delivery_status |

Adapter les noms exactement comme dans votre base Airtable.

---

## 🧪 Tester le Webhook

### Curl Test

```bash
curl -X POST https://manon59118.app.n8n.cloud/webhook/YOUR_WEBHOOK_ID \
  -H "Content-Type: application/json" \
  -d '{
    "prospect_name": "Test User",
    "email_address": "test@example.com",
    "passenger_count": 45,
    "departure_date": "2026-07-14",
    "departure_city": "Lyon",
    "destination_city": "Paris",
    "selected_options": ["peages_inclus"]
  }'
```

### Vérifier la réponse

Le webhook doit retourner :
```json
{
  "status": "success",
  "quote_id": "uuid...",
  "price_ht": 2180,
  "price_ttc": 2398
}
```

---

## 🔗 Frontend Integration

Dans votre fichier `frontend/components/ChatWidget.tsx` :

```typescript
const sendMessage = async (message: string) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_message: message,
        session_id: sessionId,
        timestamp: new Date().toISOString()
      })
    }
  );
  
  const result = await response.json();
  return result;
};
```

---

## ⚠️ Checklist de Vérification

- [ ] Credential OpenAI configurée et testée ✅
- [ ] Credential Airtable configurée et testée ✅
- [ ] Webhook n8n créé avec URL copiée
- [ ] Nœud Airtable connecté au webhook
- [ ] Nœud AI Agent avec system prompt
- [ ] Tables Airtable vérifiées
- [ ] Test curl réussi
- [ ] .env.local mis à jour avec webhook URL
- [ ] Frontend teste la connexion

---

## 🚀 Prochaines Étapes

1. **Phase 2:** Intégrer `calculer_devis()` dans le workflow n8n
2. **Phase 3:** Ajouter la génération automatique de PDF
3. **Phase 4:** Mettre en place les relances automatiques

---

## 📞 Support

Des erreurs ? Vérifier les logs n8n :
- `Settings → Logs` dans le workflow
- Chercher les erreurs de credential
- Vérifier que Airtable Base ID est correct
