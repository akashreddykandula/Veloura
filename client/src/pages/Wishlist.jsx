import { useEffect, useState } from 'react';
import ProductGrid from '../components/shared/ProductGrid.jsx';
import { api } from '../lib/api.js';
import SEO from '../lib/seo.jsx';

export default function Wishlist() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get('/users/wishlist').then((res) => setItems(res.data)); }, []);
  return <section className="container-pad py-12"><SEO title="Wishlist" /><h1 className="mb-10 font-display text-5xl">Wishlist</h1><ProductGrid products={items} /></section>;
}
