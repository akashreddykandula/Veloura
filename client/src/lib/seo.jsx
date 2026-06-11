import { Helmet } from 'react-helmet-async';

export default function SEO({ title = 'Veloura | Modern Fashion Commerce', description = 'Shop refined clothing, accessories, and seasonal collections from Veloura.', image = '/og-image.jpg', structuredData }) {
  const fullTitle = title.includes('Veloura') ? title : `${title} | Veloura`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      {structuredData && <script type="application/ld+json">{JSON.stringify(structuredData)}</script>}
    </Helmet>
  );
}
