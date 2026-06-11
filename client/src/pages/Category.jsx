import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductGrid from '../components/shared/ProductGrid.jsx';
import SEO from '../lib/seo.jsx';
import { api } from '../lib/api.js';

export default function Category() {
  const { slug } = useParams();
  const [data, setData] = useState({ products: [] });
  useEffect(() => { api.get(`/categories/${slug}`).then((res) => setData(res.data)); }, [slug]);
  return (
    <section className="container-pad py-12">
      <SEO title={data.category?.name || 'Category'} />
      <h1 className="font-display text-5xl">{data.category?.name}</h1>
      <p className="mb-10 mt-3 text-neutral-600">{data.category?.description}</p>
      <ProductGrid products={data.products} />
    </section>
  );
}
