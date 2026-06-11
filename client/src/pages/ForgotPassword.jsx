import { useState } from 'react';
import { api } from '../lib/api.js';
import SEO from '../lib/seo.jsx';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    setMessage((await api.post('/auth/forgot-password', { email })).data.message);
  };
  return (
    <section className="container-pad grid min-h-[60vh] place-items-center py-12">
      <SEO title="Forgot Password" />
      <form onSubmit={submit} className="w-full max-w-md bg-white p-8 shadow-soft">
        <h1 className="font-display text-4xl">Reset password</h1>
        <input required type="email" className="input mt-6" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
        <button className="btn-primary mt-6 w-full">Send reset link</button>
        {message && <p className="mt-4 text-sm text-neutral-600">{message}</p>}
      </form>
    </section>
  );
}
