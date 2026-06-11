import { Instagram, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import NewsletterForm from '../shared/NewsletterForm.jsx';

export default function Footer() {
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999';
  return (
    <footer className="bg-ink text-white">
      <div className="container-pad grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <h2 className="font-display text-4xl">Veloura</h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">Modern clothing with an editorial eye: polished silhouettes, premium materials, and pieces designed for repeat wear.</p>
          <div className="mt-6 flex gap-4"><Instagram /><Mail /><MessageCircle /></div>
        </div>
        <div className="grid gap-3 text-sm text-white/75">
          <h3 className="font-semibold text-white">Shop</h3>
          <Link to="/shop">All Products</Link><Link to="/shop?gender=women">Women</Link><Link to="/shop?gender=men">Men</Link><Link to="/shop?collection=limited-edition">Limited Edition</Link>
        </div>
        <div className="grid gap-3 text-sm text-white/75">
          <h3 className="font-semibold text-white">Care</h3>
          <Link to="/contact">Contact</Link><Link to="/returns-refunds">Returns & Refunds</Link><Link to="/privacy-policy">Privacy Policy</Link><Link to="/terms">Terms & Conditions</Link>
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">WhatsApp Support</a>
        </div>
        <div>
          <h3 className="font-semibold">Join the list</h3>
          <p className="mt-2 text-sm text-white/70">Early access to drops, edits, and private sale moments.</p>
          <NewsletterForm dark />
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs uppercase tracking-[0.22em] text-white/50">Veloura Commerce 2026</div>
    </footer>
  );
}
