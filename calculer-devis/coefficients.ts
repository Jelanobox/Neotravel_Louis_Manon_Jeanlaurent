// ============================================================
// coefficients.ts — Matrices de coefficients NeoTravel
// Source : REGLES DE CALCUL COTATION DEVIS NEOTRAVEL
// ============================================================

import type { CodeAnticipation } from './types';

// ── Coefficient 1 : Saisonnalité ────────────────────────────
// Basse saison  (-7%)  : Jan, Fév, Août, Nov
// Saison moy.   (0%)   : Sep, Oct, Déc
// Haute saison  (+10%) : Mar, Avr, Juil
// Très haute    (+15%) : Mai, Jun
const COEF_SAISONNALITE: Record<number, number> = {
  1:  0.93,
  2:  0.93,
  3:  1.10,
  4:  1.10,
  5:  1.15,
  6:  1.15,
  7:  1.10,
  8:  0.93,
  9:  1.00,
  10: 1.00,
  11: 0.93,
  12: 1.00,
};

// ── Coefficient 2 : Anticipation ────────────────────────────
// Plus on réserve tôt, moins c'est cher pour le transporteur (planification)
// Plus c'est urgent, plus c'est cher (mobilisation last-minute)
const COEF_ANTICIPATION: Record<CodeAnticipation, number> = {
  DD_PRIORITAIRE:  1.10,  // < 48h   → +10%
  DD_URGENT:       1.05,  // < 7j    → +5%
  DD_NORMAL:       0.95,  // 7j-3mois → -5%
  DD_3MOISETPLUS:  0.90,  // > 3mois  → -10%
};

// ── Coefficient 3 : Capacité ─────────────────────────────────
// > 85 pax → ESCALADE_HUMAINE (retourne null)
export function getCoefCapacite(nb_passagers: number): number | null {
  if (nb_passagers <= 0)  throw new Error(`nb_passagers invalide : ${nb_passagers}`);
  if (nb_passagers <= 19) return 0.95;   // minibus          -5%
  if (nb_passagers <= 53) return 1.00;   // car standard      0%
  if (nb_passagers <= 63) return 1.15;   // grand groupe    +15%
  if (nb_passagers <= 67) return 1.20;   // très grand      +20%
  if (nb_passagers <= 85) return 1.40;   // capacité max    +40%
  return null;                           // ESCALADE_HUMAINE
}

export function getCoefSaisonnalite(mois: number): number {
  const coef = COEF_SAISONNALITE[mois];
  if (coef === undefined) throw new Error(`Mois invalide : ${mois} (attendu 1-12)`);
  return coef;
}

export function getCoefAnticipation(code: CodeAnticipation): number {
  const coef = COEF_ANTICIPATION[code];
  if (coef === undefined) throw new Error(`Code anticipation invalide : ${code}`);
  return coef;
}
