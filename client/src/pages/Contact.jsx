import { useState } from 'react';
import { api } from '../lib/api.js';
import SEO from '../lib/seo.jsx';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const submit = async (event) => { event.preventDefault(); await api.post('/support/tickets', form); setSent(true); };
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999';
  return (
    <section className="container-pad py-12">
      <SEO title="Contact" />
      <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
        <div><h1 className="font-display text-5xl">Customer support</h1><p className="mt-4 text-neutral-600">Questions about fit, orders, returns, or styling? Send a ticket or message us on WhatsApp.</p><a href={`https://wa.me/${whatsapp}`} className="btn-secondary mt-6">WhatsApp support</a></div>
        <form onSubmit={submit} className="bg-white p-6 shadow-soft">
          {['name', 'email', 'subject'].map((field) => <input key={field} className="input mt-4" value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} placeholder={field} />)}
          <textarea className="input mt-4 min-h-36" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="How can we help?" />
          <button className="btn-primary mt-5">{sent ? 'Ticket sent' : 'Create support ticket'}</button>
        </form>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">{['How long does delivery take?', 'How do returns work?', 'Can I change my address?'].map((q) => <details key={q} className="bg-white p-5"><summary className="font-semibold">{q}</summary><p className="mt-3 text-sm text-neutral-600">Our support team will help within 24 hours, and order-specific actions appear in your account.</p></details>)}</div>
    </section>
  );
}
