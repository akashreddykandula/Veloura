import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../store/authSlice.js';
import SEO from '../lib/seo.jsx';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const submit = async (event) => {
    event.preventDefault();
    const result = await dispatch(register(form));
    if (!result.error) navigate('/profile');
  };
  return (
    <section className="container-pad grid min-h-[70vh] place-items-center py-12">
      <SEO title="Register" />
      <form onSubmit={submit} className="w-full max-w-md bg-white p-8 shadow-soft">
        <h1 className="font-display text-4xl">Create account</h1>
        {['name', 'email', 'password'].map((field) => <input key={field} required className="input mt-4" type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'} placeholder={field} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} />)}
        <button className="btn-primary mt-6 w-full">Register</button>
        <p className="mt-4 text-sm">Already have an account? <Link className="underline" to="/login">Login</Link></p>
      </form>
    </section>
  );
}
