import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import SEO from '../lib/seo.jsx';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { api.get('/orders/mine').then((res) => setOrders(res.data)); }, []);
  return (
    <section className="container-pad py-12">
      <SEO title="Order History" />
      <h1 className="font-display text-5xl">Order history</h1>
      <div className="mt-8 grid gap-4">
        {orders.map((order) => <article key={order._id} className="bg-white p-5 shadow-soft"><div className="flex justify-between"><strong>{order.orderNumber}</strong><span className="capitalize">{order.status}</span></div><p className="mt-2">₹{order.pricing.total.toLocaleString('en-IN')} · {order.payment.status}</p><a href={`${import.meta.env.VITE_API_URL}/orders/${order._id}/invoice`} className="mt-3 inline-block underline">Download invoice PDF</a></article>)}
      </div>
    </section>
  );
}
