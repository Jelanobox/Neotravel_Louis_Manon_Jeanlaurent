/** @type {import('next').NextConfig} */
const nextConfig = {
  // Autorise les images SVG et l'optimisation next/image
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Pas de CSP strict en dev — à durcir en prod si besoin
};

module.exports = nextConfig;
