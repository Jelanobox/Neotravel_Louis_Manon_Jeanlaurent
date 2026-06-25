// ============================================================
// types.ts — Interfaces TypeScript de calculer_devis()
// Utilisé dans : calculer-devis/index.ts
// ============================================================

export type CodeAnticipation =
  | 'DD_PRIORITAIRE'    // départ dans moins de 48h
  | 'DD_URGENT'         // départ dans moins de 7 jours
  | 'DD_NORMAL'         // départ entre 7 jours et 3 mois
  | 'DD_3MOISETPLUS';   // départ dans plus de 3 mois

export interface DevisInput {
  distance_km: number;
  nb_passagers: number;
  mois_depart: number;              // 1 (janvier) → 12 (décembre)
  code_anticipation: CodeAnticipation;
  aller_retour?: boolean;           // default: false
  option_guide?: boolean;           // +80€ HT
  option_nuit_chauffeur?: boolean;  // +120€ HT
}

export interface DevisDetail {
  prix_base: number;
  mult_ar: number;
  coef_saison: number;
  coef_anticip: number;
  coef_capa: number;
  base_ajustee: number;
  supplements: number;
  marge: number;
  tva: number;
}

export interface DevisOutput {
  statut: 'OK' | 'ESCALADE_HUMAINE';
  raison: string | null;
  prix_ht: number | null;
  prix_ttc: number | null;
  detail: DevisDetail | null;
}
