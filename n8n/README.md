# n8n — Guide de configuration des workflows

## Prérequis
- Compte n8n Cloud (n8n.io) — plan Starter suffisant
- Clé API OpenAI (GPT-4o) ou Anthropic (Claude Sonnet)
- Compte Airtable avec les 4 tables configurées (voir airtable/schema.md)
- Compte Resend ou Brevo avec domaine vérifié

---

## Workflow 1 — Principal (lead → devis)

### Architecture du flux
```
[Webhook POST /neo-lead]
        ↓
[Set — Structurer les données d'entrée]
        ↓
[AI Agent — GPT-4o/Claude avec system prompt]
    ↓           ↓
[Tool: calculer_devis()]   [Tool: Airtable — créer/MAJ lead]
        ↓
[If — statut === ESCALADE_HUMAINE ?]
    ↓ OUI                    ↓ NON
[Email commercial]     [Générer HTML devis]
                              ↓
                       [HTML → PDF]
                              ↓
                       [Email devis au prospect]
                              ↓
                       [Airtable — statut "Devis envoyé"]
```

### Étapes de configuration

#### 1. Nœud Webhook
- Method : POST
- Path : `/neo-lead`
- Response Mode : "Respond to Webhook" (mettre un nœud Respond at End)

#### 2. Nœud AI Agent
- Model : GPT-4o ou Claude Sonnet 3.5
- System Message : copier le contenu de `n8n/system-prompt.md`
- Tools à connecter :
  - Le nœud Code `calculer_devis` (voir calculer-devis/n8n-code-node.js)
  - Le nœud Airtable (Create Record sur la table Demandes)

#### 3. Nœud Code — calculer_devis
- Language : JavaScript
- Mode : "Run Once for All Items"
- Code : copier le contenu de `calculer-devis/n8n-code-node.js`

#### 4. Nœuds Airtable
- Credential : Personal Access Token Airtable
- Base ID : récupérer depuis l'URL de votre base Airtable
- **Create Record** (à l'arrivée) → table Demandes
- **Update Record** (à chaque changement de statut) → champ Statut

#### 5. Nœud HTML → PDF
Option A (recommandée pour prototype) : nœud "Convert to File" + service HTML-to-PDF
Option B : nœud HTTP Request vers api.pdfshift.io (gratuit 50 conversions/mois)
```json
{
  "url": "https://api.pdfshift.io/v3/convert/pdf",
  "method": "POST",
  "body": { "source": "{{$json.html_devis}}", "landscape": false }
}
```

#### 6. Nœud Email (Resend)
- From : devis@votre-domaine.fr
- To : {{$json.email_prospect}}
- Subject : Votre devis NeoTravel — {{$json.trajet}}
- HTML Body : copier templates/email-devis.html (remplacer {{VARIABLES}})
- Attachments : le PDF généré à l'étape précédente

---

## Workflow 2 — Relances automatiques

### Architecture
```
[Schedule Trigger — tous les jours à 9h00]
        ↓
[Airtable — Search Records]
  (filtre : Statut = "Devis envoyé" ET Date envoi < aujourd'hui - 2j)
        ↓
[Split In Batches — traiter chaque lead]
        ↓
[If — délai > 7 jours ?]
    ↓ OUI                    ↓ NON
[Email relance standard J+7] [Email relance standard J+3 ou urgence J+2]
        ↓
[Airtable — incrémenter compteur relances]
        ↓
[If — nb_relances >= 2 ?]
        ↓ OUI
[Airtable — statut "Clôturé — sans réponse"]
```

### Configuration Schedule Trigger
- Trigger : Every Day
- Time : 09:00 (fuseau Europe/Paris)

---

## Variables d'environnement à configurer dans n8n

Aller dans Settings → Variables (n8n Cloud) ou dans le fichier .env

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | Clé API OpenAI |
| `AIRTABLE_TOKEN` | Personal Access Token Airtable |
| `AIRTABLE_BASE_ID` | ID de votre base Airtable |
| `RESEND_API_KEY` | Clé API Resend |
| `NEOTRAVEL_EMAIL_FROM` | Email d'envoi (ex: devis@neotravel.fr) |
| `PDFSHIFT_API_KEY` | Clé API PDFShift (optionnel) |
