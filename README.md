<<<<<<< HEAD
# Neotravel_Louis_Manon_Jeanlaurent

=======
# NeoTravel — Site de réservation de cars avec devis automatisé

Projet Epitech MBA1 · Groupe : Manon, Jean-Laurent, Louis · Soutenance : 1er juillet 2026

---

## Architecture technique

```
Client (navigateur)
    ↓ chat
Frontend Next.js (Vercel)
    ↓ POST webhook
n8n AI Agent (workflow principal)
    ├── Tool : calculer_devis()   → prix HT/TTC
    ├── Tool : rechercher_distance() → km entre villes
    └── Actions automatiques :
         ├── Airtable → enregistrer le devis
         ├── Resend/Brevo → envoyer email + PDF
         └── Workflow relances (J+3, J+7)
```

---

## Structure du projet

```
code/
├── calculer-devis/          # Moteur de pricing
│   ├── types.ts             # Types TypeScript
│   ├── grille.ts            # Grille tarifaire 10-180km
│   ├── coefficients.ts      # Coefs saisonnalité / anticipation / capacité
│   ├── index.ts             # Fonction principale calculer_devis()
│   └── n8n-code-node.js     # Version standalone pour n8n (pas d'import)
│
├── n8n/
│   ├── system-prompt.md     # Prompt système de l'agent IA
│   └── README.md            # Guide de configuration n8n
│
├── templates/               # Templates emails et PDF
│   ├── email-devis.html
│   ├── email-relance-urgence.html
│   ├── email-relance-standard.html
│   └── pdf-devis.html
│
├── frontend/                # Application Next.js 14
│   ├── app/
│   │   ├── layout.tsx       # Layout racine
│   │   ├── page.tsx         # Page d'accueil
│   │   └── globals.css      # Variables CSS et styles globaux
│   └── components/
│       ├── Hero.tsx         # Section héro + navbar
│       ├── ChatWidget.tsx   # Chat connecté à n8n
│       └── Footer.tsx       # Pied de page
│
├── airtable/
│   └── schema.md            # Structure des tables Airtable
│
├── .env.example             # Variables d'environnement (modèle)
├── .gitignore
└── README.md                # Ce fichier
```

---

## Démarrage rapide

### 1. Frontend (Next.js)

```bash
cd code/frontend
npm install
cp ../.env.example .env.local
# Remplir .env.local avec vos clés
npm run dev
# → http://localhost:3000
```

### 2. n8n

- Créer un compte sur [n8n.io](https://n8n.io) ou installer en local
- Importer le workflow depuis `n8n/README.md`
- Ajouter les credentials : Airtable, Resend/Brevo, OpenAI
- Copier le contenu de `calculer-devis/n8n-code-node.js` dans le node **Code**
- Copier le contenu de `n8n/system-prompt.md` dans le node **AI Agent**
- Activer le workflow et copier l'URL du webhook dans `.env.local`

### 3. Airtable

- Créer une base vide
- Créer les tables selon `airtable/schema.md` : `DEVIS`, `CLIENTS`, `PARTENAIRES`
- Renseigner les 5 partenaires dans la table `PARTENAIRES`

---

## Règle d'or du moteur de prix

> **Le LLM ne calcule jamais le prix.**  
> Il collecte les 7 paramètres, puis appelle l'outil `calculer_devis()`.  
> La fonction renvoie le prix HT, TTC et le détail du calcul.  
> Le LLM restitue simplement ce résultat au client.

---

## Formule de calcul

```
Prix base HT = GRILLE_FORFAITAIRE[distance arrondie] 
               OU distance × 2 × 2.5 (si > 180km)

Prix final HT = Prix base
                × coef_saisonnalité  (0.90–1.25 selon le mois)
                × coef_anticipation  (0.95–1.20 selon le délai)
                × coef_capacité      (1.00–1.20 selon les pax)
                × 1.15 (marge NeoTravel)

Prix TTC = Prix HT × 1.10 (TVA 10%)
```

---

## Déploiement

- **Frontend** : déployer sur [Vercel](https://vercel.com) (import GitHub, config automatique Next.js)
- **n8n** : utiliser [n8n Cloud](https://app.n8n.io) ou un VPS
- **Variables** : configurer dans Vercel Dashboard → Settings → Environment Variables

---

## Équipe

| Prénom | Rôle sur le projet |
|--------|-------------------|
| Manon | Product Owner, coordination, docs |
| Jean-Laurent | Backend n8n, moteur de prix |
| Louis | Frontend Next.js, intégration |
>>>>>>> b57638b (Initial commit - frontend Neotravel)
