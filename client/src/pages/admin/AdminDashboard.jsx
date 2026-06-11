import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';
import SEO from '../../lib/seo.jsx';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/admin/dashboard').then((res) => setData(res.data)); }, []);
  const cards = data ? [
    ['Revenue', `₹${data.revenue.toLocaleString('en-IN')}`],
    ['Orders', data.orders],
    ['Products', data.products],
    ['Customers', data.customers],
    ['Pending Orders', data.pendingOrders]
  ] : [];
  return (
    <>
      <SEO title="Admin Dashboard" />
      <h1 className="text-3xl font-bold">Dashboard analytics</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-5">{cards.map(([label, value]) => <div key={label} className="bg-white p-5 shadow-sm"><p className="text-sm text-neutral-500">{label}</p><strong className="mt-2 block text-2xl">{value}</strong></div>)}</div>
      <section className="mt-8 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Sales reports</h2>
        <div className="mt-5 grid gap-3">{data?.salesByDay?.map((day) => <div key={day._id} className="grid grid-cols-3 border-b py-2 text-sm"><span>{day._id}</span><span>{day.orders} orders</span><strong>₹{day.total.toLocaleString('en-IN')}</strong></div>)}</div>
      </section>
    </>
  );
}
