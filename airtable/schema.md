# Airtable — Schéma de base de données NeoTravel

## Base : `NeoTravel_CRM`

---

## Table 1 : `DEVIS`

Chaque devis généré par l'agent IA.

| Champ | Type | Description |
|-------|------|-------------|
| `devis_id` | Autonumber | Identifiant unique (ex: DEV-0042) |
| `statut` | Single select | `EN_ATTENTE` / `ENVOYÉ` / `ACCEPTÉ` / `REFUSÉ` / `EXPIRÉ` |
| `date_creation` | Date & time | Créé automatiquement par n8n |
| `date_expiration` | Formula | `date_creation + 7 jours` |
| `client_nom` | Single line text | Nom complet du client |
| `client_email` | Email | Pour envoi automatique |
| `client_tel` | Phone | Optionnel |
| `ville_depart` | Single line text | Ville de départ saisie |
| `ville_arrivee` | Single line text | Ville d'arrivée saisie |
| `distance_km` | Number | Distance calculée (API Maps ou saisie) |
| `date_depart` | Date | Date du voyage |
| `mois_depart` | Formula | `MONTH({date_depart})` → pour coef saisonnalité |
| `nb_passagers` | Number | Nombre de passagers |
| `aller_retour` | Checkbox | Vrai = prix × 2 |
| `code_anticipation` | Single select | `DD_PRIORITAIRE` / `DD_URGENT` / `DD_NORMAL` / `DD_3MOISETPLUS` |
| `option_guide` | Checkbox | +150 EUR HT |
| `option_nuit_chauffeur` | Checkbox | +90 EUR HT |
| `prix_base_ht` | Number | Issu de la grille forfaitaire |
| `prix_ht` | Number | Après tous coefficients + marge |
| `prix_ttc` | Number | `prix_ht × 1.10` |
| `partenaire_selectionne` | Single select | VanGo / TransRegion / Prestige / EuroFleet / GrandHorizon |
| `detail_calcul` | Long text | JSON du détail retourné par calculer_devis() |
| `escalade_humaine` | Checkbox | True si l'agent a déclenché ESCALADE_HUMAINE |
| `raison_escalade` | Long text | Motif de l'escalade |
| `nb_relances` | Number | Nombre de relances envoyées (max 2) |
| `date_derniere_relance` | Date | Pour espacer les relances |

---

## Table 2 : `CLIENTS`

Déduplique les clients pour le suivi CRM.

| Champ | Type | Description |
|-------|------|-------------|
| `client_id` | Autonumber | ID interne |
| `nom` | Single line text | |
| `email` | Email | Clé de déduplication |
| `tel` | Phone | |
| `nb_devis_total` | Rollup | COUNT(DEVIS liés) |
| `nb_devis_acceptes` | Rollup | COUNT(DEVIS où statut = "ACCEPTÉ") |
| `devis` | Link to DEVIS | Relation 1-N |
| `date_premier_contact` | Date | |
| `notes` | Long text | Notes commerciales manuelles |

---

## Table 3 : `PARTENAIRES`

Données de référence des transporteurs.

| Champ | Type | Description |
|-------|------|-------------|
| `nom` | Single line text | Nom du partenaire |
| `code` | Single line text | Identifiant court (ex: VANGO) |
| `capacite_min` | Number | Pax minimum accepté |
| `capacite_max` | Number | Pax maximum accepté |
| `remise_pct` | Number | Remise accordée à NeoTravel (ex: 0.20) |
| `zone_geographique` | Single line text | Couverture nationale / régionale |
| `contact_email` | Email | Contact commercial |
| `actif` | Checkbox | Partenaire actif / inactif |
| `nb_devis_assignes` | Rollup | COUNT(DEVIS liés) |

**Données initiales (5 partenaires mock) :**

| Nom | Code | Pax min | Pax max | Remise |
|-----|------|---------|---------|--------|
| VanGo Shuttle | VANGO | 1 | 9 | 20% |
| TransRegion Bus | TRANSREG | 20 | 53 | 22% |
| Prestige Coaches | PRESTIGE | 20 | 53 | 15% |
| EuroFleet Transport | EUROFLEET | 54 | 85 | 18% |
| Grand Horizon VIP | GRANDHORIZON | 54 | 85 | 10% |

---

## Vues utiles à créer dans Airtable

- **DEVIS > Vue "En attente"** : filtre `statut = EN_ATTENTE`, triée par date_creation DESC
- **DEVIS > Vue "À relancer"** : filtre `statut = ENVOYÉ AND date_expiration < TODAY() AND nb_relances < 2`
- **DEVIS > Vue "Escalades"** : filtre `escalade_humaine = true AND statut = EN_ATTENTE`
- **CLIENTS > Vue "Top clients"** : triée par nb_devis_acceptes DESC

---

## Connexion n8n → Airtable

Dans n8n, utiliser le node **Airtable** :
- Base ID : visible dans l'URL Airtable (`appXXXXXXXXXXXXXX`)
- Token : Personal Access Token depuis airtable.com/create/tokens
- Scopes requis : `data.records:read`, `data.records:write`

Opérations utilisées :
- `Create` → enregistrer un nouveau devis
- `Update` → changer le statut (accepté, relancé...)
- `Search` → retrouver un client existant par email
