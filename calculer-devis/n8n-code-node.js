// ============================================================
// n8n-code-node.js — Version AUTONOME pour le nœud Code n8n
//
// → Copier-coller ce fichier ENTIER dans un nœud "Code" n8n
// → Le nœud précédent doit fournir les champs JSON :
//      distance_km, nb_passagers, mois_depart,
//      code_anticipation, aller_retour, option_guide,
//      option_nuit_chauffeur
//
// Aucune dépendance externe. Fonctionne en "Run once for all items".
// ============================================================

// ── Grille forfaitaire ──────────────────────────────────────
const GRILLE = {
  10:250, 20:250, 30:250, 40:320, 50:350, 60:390,
  70:430, 80:500, 90:540, 100:580, 110:620, 120:660,
  130:700, 140:740, 150:780, 160:820, 170:860, 180:900,
};

// ── Coefficients saisonnalité ────────────────────────────────
const COEF_SAISON = {
  1:0.93, 2:0.93, 3:1.10, 4:1.10,  5:1.15, 6:1.15,
  7:1.10, 8:0.93, 9:1.00, 10:1.00, 11:0.93, 12:1.00,
};

// ── Coefficients anticipation ────────────────────────────────
const COEF_ANTICIP = {
  'DD_PRIORITAIRE': 1.10,
  'DD_URGENT':      1.05,
  'DD_NORMAL':      0.95,
  'DD_3MOISETPLUS': 0.90,
};

// ── Coefficient capacité ─────────────────────────────────────
function coefCapacite(n) {
  if (n <= 19) return 0.95;
  if (n <= 53) return 1.00;
  if (n <= 63) return 1.15;
  if (n <= 67) return 1.20;
  if (n <= 85) return 1.40;
  return null; // escalade
}

function arrondi(v) { return Math.round(v * 100) / 100; }

// ── Lecture des inputs ───────────────────────────────────────
const inp = $input.first().json;
const distance_km           = Number(inp.distance_km);
const nb_passagers          = Number(inp.nb_passagers);
const mois_depart           = Number(inp.mois_depart);
const code_anticipation     = String(inp.code_anticipation);
const aller_retour          = inp.aller_retour === true || inp.aller_retour === 'true';
const option_guide          = inp.option_guide === true || inp.option_guide === 'true';
const option_nuit_chauffeur = inp.option_nuit_chauffeur === true || inp.option_nuit_chauffeur === 'true';

// ── Escalade >85 pax ─────────────────────────────────────────
if (nb_passagers > 85) {
  return [{ json: {
    statut: 'ESCALADE_HUMAINE',
    raison: `${nb_passagers} passagers dépassent le seuil automatisé (max 85)`,
    prix_ht: null, prix_ttc: null, detail: null,
  }}];
}

// ── Prix de base ─────────────────────────────────────────────
let prix_base;
if (distance_km > 180) {
  prix_base = distance_km * 2 * 2.5;
} else {
  const palier = Math.min(180, Math.max(10, Math.ceil(distance_km / 10) * 10));
  prix_base = GRILLE[palier];
}

// ── Coefficients ─────────────────────────────────────────────
const mult_ar      = aller_retour ? 2 : 1;
const coef_saison  = COEF_SAISON[mois_depart];
const coef_anticip = COEF_ANTICIP[code_anticipation];
const coef_capa    = coefCapacite(nb_passagers);

if (!coef_saison || !coef_anticip || coef_capa === null) {
  return [{ json: {
    statut: 'ESCALADE_HUMAINE',
    raison: `Paramètre invalide — mois:${mois_depart}, code:${code_anticipation}, pax:${nb_passagers}`,
    prix_ht: null, prix_ttc: null, detail: null,
  }}];
}

// ── Calcul ───────────────────────────────────────────────────
const base_ajustee = prix_base * mult_ar * coef_saison * coef_anticip * coef_capa;
const supplements  = (option_guide ? 80 : 0) + (option_nuit_chauffeur ? 120 : 0);
const prix_ht      = arrondi((base_ajustee + supplements) * 1.15);
const prix_ttc     = arrondi(prix_ht * 1.10);

return [{ json: {
  statut: 'OK',
  raison: null,
  prix_ht,
  prix_ttc,
  detail: {
    prix_base,
    mult_ar,
    coef_saison,
    coef_anticip,
    coef_capa,
    base_ajustee:   arrondi(base_ajustee),
    supplements,
    marge:          arrondi(prix_ht - base_ajustee - supplements),
    tva:            arrondi(prix_ttc - prix_ht),
  },
}}];
