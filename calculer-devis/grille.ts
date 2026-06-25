// ============================================================
// grille.ts — Grille tarifaire forfaitaire NeoTravel
// Source : REGLES DE CALCUL COTATION DEVIS NEOTRAVEL
//
// Utilisation :
//   - distance <= 180 km → lookup dans cette table (palier de 10km, arrondi au supérieur)
//   - distance > 180 km  → distance_km × 2 × 2.5 (voir index.ts)
//   - Aller/retour       → × 2 sur le prix aller simple
// ============================================================

export const GRILLE_FORFAITAIRE: Record<number, number> = {
  10:  250,  // Prix minimum de course
  20:  250,
  30:  250,
  40:  320,
  50:  350,
  60:  390,
  70:  430,
  80:  500,
  90:  540,
  100: 580,
  110: 620,
  120: 660,
  130: 700,
  140: 740,
  150: 780,
  160: 820,
  170: 860,
  180: 900,
};
