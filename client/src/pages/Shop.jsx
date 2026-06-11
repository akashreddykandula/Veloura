import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Filters from '../components/shared/Filters.jsx';
import ProductGrid from '../components/shared/ProductGrid.jsx';
import SEO from '../lib/seo.jsx';
import { fetchFilters, fetchProducts } from '../store/productSlice.js';

export default function Shop() {
  const dispatch = useDispatch();
  const [params, setParams] = useSearchParams();
  const { items, filters, status } = useSelector((state) => state.products);
  useEffect(() => { dispatch(fetchFilters()); }, [dispatch]);
  useEffect(() => { dispatch(fetchProducts(Object.fromEntries(params))); }, [dispatch, params]);
  const setParam = (key, value, multi = false) => {
    const next = new URLSearchParams(params);
    if (!multi) next.set(key, value);
    else {
      const current = next.get(key)?.split(',').filter(Boolean) || [];
      next.set(key, current.includes(value) ? current.filter((item) => item !== value).join(',') : [...current, value].join(','));
    }
    setParams(next);
  };
  return (
    <>
      <SEO title="Shop" description="Browse Veloura clothing by category, size, color, price, rating, and availability." />
      <section className="container-pad py-10">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div><p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">Shop</p><h1 className="font-display text-5xl">All clothing</h1></div>
          <select value={params.get('sort') || 'newest'} onChange={(event) => setParam('sort', event.target.value)} className="input md:w-64">
            <option value="newest">Newest</option><option value="popularity">Popularity</option><option value="price-asc">Price Low to High</option><option value="price-desc">Price High to Low</option><option value="best-rated">Best Rated</option>
          </select>
        </div>
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <Filters filters={filters} params={params} setParam={setParam} />
          <div>{status === 'loading' ? <p>Loading pieces...</p> : <ProductGrid products={items} />}</div>
        </div>
      </section>
    </>
  );
}
