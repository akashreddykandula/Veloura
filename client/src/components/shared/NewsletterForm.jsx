import { useState } from 'react';
import { api } from '../../lib/api.js';

export default function NewsletterForm({ dark = false }) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    await api.post('/newsletter/subscribe', { email });
    setDone(true);
  };
  return (
    <form onSubmit={submit} className="mt-5 flex">
      <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" className={`min-w-0 flex-1 px-4 py-3 text-sm outline-none ${dark ? 'bg-white/10 text-white placeholder:text-white/50' : 'bg-white'}`} />
      <button className={`${dark ? 'bg-white text-ink' : 'bg-ink text-white'} px-4 text-xs font-bold uppercase tracking-[0.18em]`}>{done ? 'Joined' : 'Join'}</button>
    </form>
  );
}
