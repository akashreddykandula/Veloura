import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products = [] }) {
  if (!products.length) return <div className="py-16 text-center text-neutral-500">No pieces matched your filters.</div>;
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-7">
      {products.map((product) => <ProductCard key={product._id} product={product} />)}
    </div>
  );
}
