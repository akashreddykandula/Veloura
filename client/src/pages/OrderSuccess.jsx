import { Link, useParams } from 'react-router-dom';
import SEO from '../lib/seo.jsx';

export default function OrderSuccess() {
  const { id } = useParams();
  return (
    <section className="container-pad grid min-h-[60vh] place-items-center py-16 text-center">
      <SEO title="Order Success" />
      <div className="max-w-xl">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">Order placed</p>
        <h1 className="mt-3 font-display text-5xl">Your Veloura order is confirmed.</h1>
        <p className="mt-4 text-neutral-600">Order reference: {id}. Tracking updates and invoice access are available in your order history.</p>
        <Link to="/orders" className="btn-primary mt-8">View orders</Link>
      </div>
    </section>
  );
}
