import { useEffect, useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import ProductGrid from '../components/shared/ProductGrid.jsx';
import SEO from '../lib/seo.jsx';
import { api } from '../lib/api.js';
import { addToCart } from '../store/cartSlice.js';

export default function ProductDetails() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [data, setData] = useState({ related: [] });
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  useEffect(() => {
    api.get(`/products/${slug}`).then((res) => {
      setData(res.data);
      setImage(res.data.product.images?.[0]?.url);
      setSize(res.data.product.variants?.[0]?.size || '');
      setColor(res.data.product.variants?.[0]?.color?.name || '');
    });
  }, [slug]);
  const product = data.product;
  const sizes = useMemo(() => [...new Set(product?.variants?.map((variant) => variant.size) || [])], [product]);
  const colors = useMemo(() => [...new Set(product?.variants?.map((variant) => variant.color?.name) || [])], [product]);
  const selectedVariant = product?.variants?.find((variant) => variant.size === size && variant.color?.name === color) || product?.variants?.[0];
  if (!product) return <div className="container-pad py-20">Loading product...</div>;
  return (
    <>
      <SEO title={product.seo?.title || product.name} description={product.seo?.description || product.description} structuredData={{ '@context': 'https://schema.org', '@type': 'Product', name: product.name, sku: product.sku, image: product.images?.map((item) => item.url), offers: { '@type': 'Offer', price: product.price, priceCurrency: 'INR' } }} />
      <section className="container-pad grid gap-10 py-10 lg:grid-cols-[1.1fr_.9fr]">
        <div className="grid gap-4 md:grid-cols-[110px_1fr]">
          <div className="order-2 grid grid-cols-4 gap-3 md:order-1 md:grid-cols-1">{product.images.map((item) => <button key={item.url} onClick={() => setImage(item.url)}><img src={item.url} alt={item.alt || product.name} className="aspect-square object-cover" /></button>)}</div>
          <div className="order-1 overflow-hidden bg-stone md:order-2"><img src={image} alt={product.name} className="aspect-[4/5] w-full object-cover transition hover:scale-110" /></div>
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">{product.brand}</p>
          <h1 className="mt-3 font-display text-5xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-2"><Star className="fill-gold text-gold" size={18} /> {product.rating?.toFixed?.(1) || product.rating} ({product.reviewCount} reviews)</div>
          <div className="mt-5 text-2xl font-bold">₹{product.price.toLocaleString('en-IN')}</div>
          <p className="mt-6 leading-7 text-neutral-600">{product.description}</p>
          <div className="mt-8"><h3 className="font-semibold">Size</h3><div className="mt-3 flex flex-wrap gap-2">{sizes.map((item) => <button key={item} onClick={() => setSize(item)} className={`border px-4 py-2 ${size === item ? 'border-ink bg-ink text-white' : 'border-stone bg-white'}`}>{item}</button>)}</div></div>
          <div className="mt-6"><h3 className="font-semibold">Color</h3><div className="mt-3 flex flex-wrap gap-2">{colors.map((item) => <button key={item} onClick={() => setColor(item)} className={`border px-4 py-2 ${color === item ? 'border-ink bg-ink text-white' : 'border-stone bg-white'}`}>{item}</button>)}</div></div>
          <p className="mt-5 text-sm">SKU: {selectedVariant?.sku || product.sku} · {selectedVariant?.stock > 0 ? 'In stock' : 'Out of stock'}</p>
          <button disabled={!selectedVariant?.stock} onClick={() => dispatch(addToCart({ productId: product._id, variantId: selectedVariant?._id, size, color, quantity: 1 }))} className="btn-primary mt-8 w-full">Add to cart</button>
          <div className="mt-8 grid gap-3 border-t border-stone pt-6 text-sm text-neutral-600">
            {Object.entries(product.specifications || {}).map(([key, value]) => <p key={key}><strong className="capitalize text-ink">{key}:</strong> {value}</p>)}
          </div>
        </div>
      </section>
      <section className="container-pad py-12"><h2 className="mb-6 font-display text-4xl">Related products</h2><ProductGrid products={data.related} /></section>
      <section className="container-pad pb-16"><h2 className="mb-4 font-display text-4xl">Reviews</h2>{product.reviews?.length ? product.reviews.map((review) => <div key={review._id} className="border-t border-stone py-4"><strong>{review.title}</strong><p>{review.comment}</p></div>) : <p className="text-neutral-500">Reviews are collected after verified purchases.</p>}</section>
    </>
  );
}
