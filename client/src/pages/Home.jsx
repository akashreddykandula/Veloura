import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import SEO from '../lib/seo.jsx';
import ProductGrid from '../components/shared/ProductGrid.jsx';
import SectionHeader from '../components/shared/SectionHeader.jsx';
import NewsletterForm from '../components/shared/NewsletterForm.jsx';

const fallbackHero = 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1800&q=85';

export default function Home() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    api.get('/products', { params: { limit: 16, sort: 'popularity' } }).then((res) => setProducts(res.data.items));
  }, []);
  const collections = [
    ['Women', '/shop?gender=women', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80'],
    ['Men', '/shop?gender=men', 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=900&q=80'],
    ['Limited Edition', '/shop?collection=limited-edition', 'https://images.unsplash.com/photo-1529137607769-1599?auto=format&fit=crop&w=900&q=80']
  ];
  return (
    <>
      <SEO structuredData={{ '@context': 'https://schema.org', '@type': 'Store', name: 'Veloura', url: location.origin }} />
      <section className="relative min-h-[78vh] overflow-hidden">
        <img src={fallbackHero} alt="Veloura editorial campaign" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="container-pad relative flex min-h-[78vh] items-end pb-16 text-white">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em]">New season campaign</p>
            <h1 className="mt-4 font-display text-5xl leading-tight md:text-7xl">The modern wardrobe, edited beautifully.</h1>
            <p className="mt-5 max-w-xl text-white/80">Premium everyday clothing with precise fits, editorial textures, and a quiet luxury point of view.</p>
            <Link to="/shop" className="btn-primary mt-8 bg-white text-ink hover:bg-ivory">Shop the edit</Link>
          </div>
        </div>
      </section>
      <section className="container-pad py-16">
        <SectionHeader eyebrow="Collections" title="Featured collections" />
        <div className="grid gap-5 md:grid-cols-3">
          {collections.map(([title, to, img]) => (
            <Link key={title} to={to} className="group relative overflow-hidden bg-stone">
              <img src={img} alt={title} className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <h3 className="absolute bottom-6 left-6 font-display text-3xl text-white">{title}</h3>
            </Link>
          ))}
        </div>
      </section>
      {['New Arrivals', 'Best Sellers', 'Trending Products', "Men's Collection", "Women's Collection", 'Limited Edition Collection', 'Seasonal Collection'].map((title, index) => (
        <section key={title} className="container-pad py-12">
          <SectionHeader eyebrow={index % 2 ? 'Veloura selected' : 'Fresh edit'} title={title} to="/shop" />
          <ProductGrid products={products.slice(index % 4, (index % 4) + 4)} />
        </section>
      ))}
      <section className="bg-white py-16">
        <div className="container-pad grid gap-8 md:grid-cols-3">
          {['Impeccable quality and quick delivery.', 'The fit recommendations were perfect.', 'Elegant packaging and a genuinely premium feel.'].map((quote, i) => (
            <blockquote key={quote} className="border-l-2 border-gold pl-5 text-xl">“{quote}”<footer className="mt-4 text-sm uppercase tracking-[0.18em] text-neutral-500">Customer {i + 1}</footer></blockquote>
          ))}
        </div>
      </section>
      <section className="container-pad py-16">
        <SectionHeader eyebrow="Social" title="Instagram gallery" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
          {products.slice(0, 6).map((product) => <img key={product._id} src={product.images?.[0]?.url} alt={product.name} className="aspect-square object-cover" loading="lazy" />)}
        </div>
      </section>
      <section className="bg-stone py-16 text-center">
        <div className="container-pad mx-auto max-w-2xl">
          <h2 className="font-display text-4xl">Private sale access</h2>
          <p className="mt-3 text-neutral-600">Join for launch notes, flash sales, and early collection access.</p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
