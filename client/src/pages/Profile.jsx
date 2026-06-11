import { useState } from 'react';
import { useSelector } from 'react-redux';
import { api } from '../lib/api.js';
import SEO from '../lib/seo.jsx';

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [address, setAddress] = useState({ fullName: user?.name || '', phone: '', line1: '', city: '', state: '', postalCode: '', country: 'India', isDefault: true });
  const saveProfile = (event) => { event.preventDefault(); api.put('/users/profile', form); };
  const saveAddress = (event) => { event.preventDefault(); api.post('/users/addresses', address); };
  return (
    <section className="container-pad py-12">
      <SEO title="Profile" />
      <h1 className="font-display text-5xl">My account</h1>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <form onSubmit={saveProfile} className="bg-white p-6 shadow-soft">
          <h2 className="text-xl font-semibold">Profile management</h2>
          <input className="input mt-5" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <input className="input mt-4" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Phone" />
          <button className="btn-primary mt-5">Save profile</button>
        </form>
        <form onSubmit={saveAddress} className="bg-white p-6 shadow-soft">
          <h2 className="text-xl font-semibold">Address management</h2>
          {['fullName', 'phone', 'line1', 'city', 'state', 'postalCode'].map((field) => <input key={field} className="input mt-4" value={address[field]} onChange={(event) => setAddress({ ...address, [field]: event.target.value })} placeholder={field} />)}
          <button className="btn-primary mt-5">Add address</button>
        </form>
      </div>
    </section>
  );
}
