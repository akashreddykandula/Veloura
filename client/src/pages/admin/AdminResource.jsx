import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../lib/api.js';
import SEO from '../../lib/seo.jsx';

const endpoints = {
  products: '/products?limit=100',
  orders: '/orders/admin',
  customers: '/users/customers',
  coupons: '/admin/coupons',
  banners: '/admin/banners',
  reports: '/orders/inventory-report'
};

export default function AdminResource() {
  const { resource } = useParams();
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({});
  const endpoint = endpoints[resource];
  useEffect(() => {
    if (!endpoint) return;
    api.get(endpoint).then((res) => setRows(res.data.items || res.data));
  }, [endpoint]);
  const fields = useMemo(() => ({
    coupons: ['code', 'type', 'value', 'minOrderValue', 'maxDiscount'],
    banners: ['title', 'subtitle', 'ctaLabel', 'ctaUrl'],
    products: ['name', 'sku', 'price', 'brand']
  }[resource] || []), [resource]);
  const save = async (event) => {
    event.preventDefault();
    const target = resource === 'coupons' ? '/admin/coupons' : resource === 'banners' ? '/admin/banners' : '/products';
    await api.post(target, form);
    setForm({});
    const res = await api.get(endpoint);
    setRows(res.data.items || res.data);
  };
  return (
    <section>
      <SEO title={`Admin ${resource}`} />
      <h1 className="text-3xl font-bold capitalize">{resource}</h1>
      {fields.length > 0 && (
        <form onSubmit={save} className="mt-6 grid gap-3 bg-white p-5 shadow-sm md:grid-cols-3">
          {fields.map((field) => <input key={field} className="input" placeholder={field} value={form[field] || ''} onChange={(event) => setForm({ ...form, [field]: event.target.value })} />)}
          <button className="btn-primary md:col-span-3">Create {resource.slice(0, -1)}</button>
        </form>
      )}
      <div className="mt-6 overflow-auto bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-neutral-50"><tr>{['Name/Number', 'Status', 'Amount/Price', 'Updated'].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody>{rows.map((row) => <tr key={row._id || row.id} className="border-t"><td className="p-3 font-semibold">{row.name || row.orderNumber || row.email || row.code || row.title}</td><td className="p-3 capitalize">{row.status || row.payment?.status || (row.isActive === false ? 'inactive' : 'active')}</td><td className="p-3">{row.price || row.pricing?.total || row.value || row.stock || '-'}</td><td className="p-3">{row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : '-'}</td></tr>)}</tbody>
        </table>
      </div>
      {resource === 'reviews' && <p className="mt-6 bg-white p-5">Review moderation is available through product detail records via the `/admin/products/:productId/reviews/:reviewId` API.</p>}
    </section>
  );
}
