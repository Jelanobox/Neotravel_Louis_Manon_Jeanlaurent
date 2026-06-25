// ============================================================
// calculer_devis() — Moteur de tarification NeoTravel
//
// RÈGLE D'OR : Le LLM ne calcule JAMAIS le prix.
// Il collecte les paramètres et appelle cette fonction.
// Le prix est déterministe, reproductible et auditable.
//
// Usage :
//   import { calculer_devis } from './calculer-devis';
//   const result = calculer_devis({ distance_km: 470, nb_passagers: 45, ... });
// ============================================================

import { GRILLE_FORFAITAIRE } from './grille';
import { getCoefSaisonnalite, getCoefAnticipation, getCoefCapacite } from './coefficients';
import type { DevisInput, DevisOutput } from './types';

export function calculer_devis(input: DevisInput): DevisOutput {
  const {
    distance_km,
    nb_passagers,
    mois_depart,
    code_anticipation,
    aller_retour           = false,
    option_guide           = false,
    option_nuit_chauffeur  = false,
  } = input;

  // ── Garde-fous ───────────────────────────────────────────
  if (nb_passagers > 85) {
    return escalade(`${nb_passagers} passagers dépassent le seuil automatisé (max 85)`);
  }

  // ── 1. Prix de base ──────────────────────────────────────
  let prix_base: number;
  if (distance_km > 180) {
    prix_base = distance_km * 2 * 2.5;
  } else {
    const palier = Math.min(180, Math.max(10, Math.ceil(distance_km / 10) * 10));
    prix_base = GRILLE_FORFAITAIRE[palier];
    if (prix_base === undefined) {
      return escalade(`Distance ${distance_km}km hors grille`);
    }
  }

  // ── 2. Aller/retour ──────────────────────────────────────
  const mult_ar = aller_retour ? 2 : 1;

  // ── 3. Coefficients ──────────────────────────────────────
  const coef_saison  = getCoefSaisonnalite(mois_depart);
  const coef_anticip = getCoefAnticipation(code_anticipation);
  const coef_capa    = getCoefCapacite(nb_passagers);

  if (coef_capa === null) {
    return escalade(`Capacité ${nb_passagers} pax hors grille automatisée`);
  }

  // ── 4. Calcul ────────────────────────────────────────────
  const base_ajustee = prix_base * mult_ar * coef_saison * coef_anticip * coef_capa;
  const supplements  = (option_guide ? 80 : 0) + (option_nuit_chauffeur ? 120 : 0);
  const prix_ht      = arrondi((base_ajustee + supplements) * 1.15);
  const prix_ttc     = arrondi(prix_ht * 1.10);
  const marge        = arrondi(prix_ht - base_ajustee - supplements);
  const tva          = arrondi(prix_ttc - prix_ht);

  return {
    statut:   'OK',
    raison:   null,
    prix_ht,
    prix_ttc,
    detail: {
      prix_base,
      mult_ar,
      coef_saison,
      coef_anticip,
      coef_capa,
      base_ajustee: arrondi(base_ajustee),
      supplements,
      marge,
      tva,
    },
  };
}

// ── Helpers ──────────────────────────────────────────────────
function arrondi(n: number): number {
  return Math.round(n * 100) / 100;
}

function escalade(raison: string): DevisOutput {
  return { statut: 'ESCALADE_HUMAINE', raison, prix_ht: null, prix_ttc: null, detail: null };
}
