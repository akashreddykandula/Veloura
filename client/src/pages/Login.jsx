import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice.js';
import SEO from '../lib/seo.jsx';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);
  const submit = async (event) => {
    event.preventDefault();
    const result = await dispatch(login(form));
    if (!result.error) navigate(result.payload.user.role === 'admin' ? '/admin' : '/profile');
  };
  return (
    <section className="container-pad grid min-h-[70vh] place-items-center py-12">
      <SEO title="Login" />
      <form onSubmit={submit} className="w-full max-w-md bg-white p-8 shadow-soft">
        <h1 className="font-display text-4xl">Login</h1>
        <input className="input mt-6" type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <input className="input mt-4" type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button className="btn-primary mt-6 w-full">Login</button>
        <p className="mt-4 text-sm"><Link className="underline" to="/forgot-password">Forgot password?</Link> · <Link className="underline" to="/register">Create account</Link></p>
      </form>
    </section>
  );
}
