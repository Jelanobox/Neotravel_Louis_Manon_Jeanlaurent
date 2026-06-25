# 🎯 Guide Pas à Pas n8n - Configuration Complète

## 🔑 Étape 1: Configurer le Credential OpenAI (3 min)

### 1.1 Accéder à Settings → Credentials
1. Sur n8n.cloud, cliquer sur l'**icône Settings** (⚙️) en bas à gauche
2. Cliquer sur **"Credentials"** dans le menu
3. Cliquer sur le bouton **"+ New"** (en haut à droite)

### 1.2 Sélectionner OpenAI
- Dans la barre de recherche, taper: `OpenAI`
- Cliquer sur **"OpenAI"** dans les résultats

### 1.3 Remplir les informations
| Champ | Valeur |
|-------|--------|
| **Name** | `OpenAI - NeoTravel` |
| **API Key** | `sk-proj-XXXXX...` (votre clé OpenAI) |

### 1.4 Tester et Sauvegarder
1. Cliquer sur le bouton **"Test Connection"**
2. Attendre le message **"Connection successful"** ✅
3. Cliquer sur **"Save"**

---

## 🗄️ Étape 2: Configurer le Credential Airtable (3 min)

### 2.1 Ajouter un nouveau credential
1. Dans **Settings → Credentials**, cliquer **"+ New"**
2. Chercher: `Airtable`
3. Cliquer sur **"Airtable"**

### 2.2 Remplir les informations
| Champ | Valeur |
|-------|--------|
| **Name** | `Airtable - NeoTravel` |
| **Authentication** | `Personal Access Token` |
| **Token** | `patXXXXXXXXXXXXXXXXXX...` (votre token Airtable) |

### 2.3 Tester et Sauvegarder
1. Cliquer sur **"Test Connection"** 
2. Attendre **"Connection successful"** ✅
3. Cliquer **"Save"**

---

## 🪝 Étape 3: Créer le Webhook (5 min)

### 3.1 Retourner au Workflow
1. Fermer les Settings
2. Aller au workflow **"NeoTravel — Agent Devis"**
3. Cliquer sur l'onglet **"Editor"**

### 3.2 Ajouter un nœud Webhook
1. Cliquer sur le **"+"** en bas du workflow (ou dans le canvas)
2. Rechercher: `Webhook`
3. Cliquer sur **"Webhook"**

### 3.3 Configurer le Webhook
Un nœud "Webhook" doit apparaître. Configuration :

| Champ | Valeur |
|-------|--------|
| **HTTP Method** | `POST` |
| **Path** | `/neo-chat` |
| **Response Mode** | `Respond to Webhook` |
| **Respond When** | `Last Node Executed` |

### 3.4 Récupérer l'URL du Webhook

**IMPORTANT:** Dans le nœud Webhook, vous verrez une URL en bleu ressemblant à:
```
https://manon59118.app.n8n.cloud/webhook/abc123xyz789
```

**COPIER cette URL complète** → vous l'utiliserez ensuite.

---

## 🤖 Étape 4: Ajouter l'AI Agent (8 min)

### 4.1 Ajouter un nœud OpenAI
1. Cliquer sur le **"+"** du workflow
2. Rechercher: `OpenAI`
3. Cliquer sur **"OpenAI" ou "Chat"** (selon votre version n8n)

### 4.2 Configurer le nœud
| Champ | Valeur |
|-------|--------|
| **Credential** | `OpenAI - NeoTravel` (dropdown) |
| **Model** | `gpt-4o` |
| **Temperature** | `0.3` (plus faible = plus stable) |

### 4.3 Ajouter le System Prompt
Dans le champ **"System Prompt"** ou **"System Message"**, copier ceci :

```
Tu es un assistant de devis pour NéoTravel, une plateforme de transport en groupe.

RÔLE: Qualifier les demandes de transport en collectant les informations essentielles et calculer un devis précis.

INFORMATION À COLLECTER:
1. Nombre de passagers (obligatoire)
2. Date de départ (obligatoire, format YYYY-MM-DD)
3. Ville de départ (obligatoire)
4. Ville d'arrivée (obligatoire)
5. Aller-retour? (oui/non)
6. Options supplémentaires: guide touristique (+150€), nuit chauffeur (+90€)

RÈGLES D'ESCALADE:
- Si nombre de passagers > 85: ESCALADE (trop gros)
- Si trajets multi-stops/circuits: ESCALADE (trop complexe)
- Si données incohérentes (date passée, villes inexistantes): ESCALADE

TONE: Professionnel, chaleureux, pas de copinage.

SORTIE: Une fois les données validées, retourner un JSON structuré contenant les paramètres de devis.
```

### 4.4 Connecter le Webhook au AI Agent
Créer une connection logique :
```
Webhook → AI Agent
```
Glisser la ligne de connexion du Webhook vers le AI Agent.

---

## 💾 Étape 5: Ajouter Airtable (8 min)

### 5.1 Ajouter un nœud Airtable
1. Cliquer **"+"** du workflow
2. Rechercher: `Airtable`
3. Cliquer sur **"Airtable"**

### 5.2 Configurer l'opération
| Champ | Valeur |
|-------|--------|
| **Credential** | `Airtable - NeoTravel` |
| **Base** | `apptD8AlV6sQFrIOI` (sélectionner du dropdown) |
| **Table** | `tblYDuwtbuqS9qeuo` (votre table de leads) |
| **Operation** | `Create Record` |

### 5.3 Mapper les champs
Sous "Fields", ajouter les mappages :

| Airtable Field | Valeur n8n |
|---|---|
| `prospect_name` | `{{ $node["AI Agent"].json.extraction.prospect_name }}` |
| `email_address` | `{{ $node["AI Agent"].json.extraction.email }}` |
| `passenger_count` | `{{ $node["AI Agent"].json.extraction.passenger_count }}` |
| `departure_date` | `{{ $node["AI Agent"].json.extraction.departure_date }}` |
| `departure_city` | `{{ $node["AI Agent"].json.extraction.departure_city }}` |
| `destination_city` | `{{ $node["AI Agent"].json.extraction.destination_city }}` |
| `status` | `"Nouveau lead"` |

### 5.4 Connecter AI Agent à Airtable
Glisser une ligne de connexion du **AI Agent** vers le nœud **Airtable**.

---

## 📤 Étape 6: Répondre au Webhook (3 min)

### 6.1 Ajouter un nœud "Respond to Webhook"
1. Cliquer **"+"**
2. Rechercher: `Respond`
3. Cliquer sur **"Respond to Webhook"**

### 6.2 Configurer la réponse
Dans le champ de réponse, ajouter du JSON :

```json
{
  "message": "{{ $node[\"AI Agent\"].json.response }}",
  "status": "success",
  "quote_id": "{{ $node[\"Airtable\"].json[0].id }}"
}
```

### 6.3 Connecter Airtable à Respond
Glisser une ligne du nœud **Airtable** vers **Respond to Webhook**.

---

## ✅ Étape 7: Activer et Publier (2 min)

### 7.1 Activer le workflow
En haut du workflow, cliquer sur l'interrupteur **ON/OFF** → mettre en **ON** (vert).

### 7.2 Publier
Cliquer sur le bouton **"Publish"** (en haut à droite, orange).

### 7.3 Sauvegarder
Cliquer sur **"Save"** si demandé.

---

## 🔗 Étape 8: Mettre à jour .env.local

Une fois l'URL du webhook en poche (étape 3.4), mettre à jour:

**Fichier:** `/Users/manon/Claude/Projects/Neotravel/code/.env.local`

```bash
NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL=https://manon59118.app.n8n.cloud/webhook/YOUR_WEBHOOK_ID
```

**Remplacer `YOUR_WEBHOOK_ID`** par l'ID réel de votre webhook.

---

## 🧪 Étape 9: Tester le Webhook (Curl)

Ouvrir un terminal et exécuter :

```bash
curl -X POST https://manon59118.app.n8n.cloud/webhook/YOUR_WEBHOOK_ID \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Je cherche un car pour 30 personnes de Lyon à Paris le 15 juillet",
    "session_id": "test_123"
  }'
```

**Résultat attendu:**
```json
{
  "message": "Merci! J'ai noté...",
  "status": "success"
}
```

---

## 🚀 Étape 10: Tester le Frontend

Démarrer le serveur Next.js :

```bash
cd /Users/manon/Claude/Projects/Neotravel/code/frontend
npm run dev
```

Accéder à: **http://localhost:3000**

Le widget de chat doit apparaître en bas à droite 💬

Taper un message test → il doit être envoyé à n8n et une réponse revenir.

---

## 📊 Vérifier Airtable

Après le test :
1. Aller sur: https://airtable.com/apptD8AlV6sQFrIOI
2. Vérifier que la ligne a été créée dans la table
3. Les champs doivent être remplis correctement

---

## ⚠️ Troubleshooting

### Le webhook n'apparaît pas ?
- Cliquer sur **"+"** du workflow → chercher "Webhook"
- S'assurer que c'est un nœud, pas une connection

### L'URL du webhook est grise/inactive ?
- Vérifier que le workflow est **publié** (bouton "Publish")
- Vérifier que le workflow est **activé** (interrupteur ON)

### Erreur "Credential not found" ?
- Vérifier que le credential existe dans Settings → Credentials
- Vérifier que le nom du credential dans le nœud correspond exactement

### Le chat ne répond pas ?
- Ouvrir **Executions** dans n8n
- Vérifier les logs pour les erreurs rouges
- S'assurer que l'URL du webhook dans .env.local est correcte

---

## ✅ Checklist Finale

- [ ] Credential OpenAI créé et testé ✅
- [ ] Credential Airtable créé et testé ✅
- [ ] Webhook créé avec URL copiée
- [ ] AI Agent configuré
- [ ] Airtable nœud connecté
- [ ] Respond to Webhook configuré
- [ ] Workflow publié et activé
- [ ] .env.local mis à jour avec webhook URL
- [ ] Test curl réussi
- [ ] Frontend teste avec succès
- [ ] Données visibles dans Airtable

---

**C'est tout! Vous avez terminé la configuration! 🎉**
