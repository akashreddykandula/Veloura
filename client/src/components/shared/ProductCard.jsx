import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice.js';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const firstVariant = product.variants?.[0];
  return (
    <article className="group">
      <Link to={`/product/${product.slug}`} className="block overflow-hidden bg-stone">
        <img src={product.images?.[0]?.url} alt={product.images?.[0]?.alt || product.name} loading="lazy" className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105" />
      </Link>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <Link to={`/product/${product.slug}`} className="font-semibold">{product.name}</Link>
          <p className="mt-1 text-sm text-neutral-500">{product.brand}</p>
          <div className="mt-2 flex items-center gap-1 text-sm"><Star size={15} className="fill-gold text-gold" /> {Number(product.rating || 0).toFixed(1)} ({product.reviewCount || 0})</div>
        </div>
        <button className="rounded-full border border-stone p-2" aria-label="Wishlist"><Heart size={18} /></button>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="font-bold">₹{product.price?.toLocaleString('en-IN')}</div>
        <button onClick={() => dispatch(addToCart({ productId: product._id, variantId: firstVariant?._id, size: firstVariant?.size, color: firstVariant?.color?.name, quantity: 1 }))} className="text-xs font-bold uppercase tracking-[0.18em] underline">Add</button>
      </div>
    </article>
  );
}
