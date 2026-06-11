import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const nav = [
  { label: 'New In', to: '/shop?sort=newest' },
  { label: 'Women', to: '/shop?gender=women' },
  { label: 'Men', to: '/shop?gender=men' },
  { label: 'Limited', to: '/shop?collection=limited-edition' }
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));

  const search = (event) => {
    event.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone/80 bg-ivory/95 backdrop-blur">
      <div className="container-pad flex h-16 items-center justify-between gap-4">
        <button className="lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Open menu"><Menu /></button>
        <Link to="/" className="font-display text-3xl font-bold tracking-tight">Veloura</Link>
        <nav className="hidden items-center gap-8 text-sm font-semibold uppercase tracking-[0.16em] lg:flex">
          {nav.map((item) => <NavLink key={item.to} to={item.to} className="hover:text-gold">{item.label}</NavLink>)}
          <div className="group relative py-6">
            <span className="cursor-default">Collections</span>
            <div className="invisible absolute left-1/2 top-full grid w-[620px] -translate-x-1/2 grid-cols-3 gap-6 bg-white p-8 opacity-0 shadow-soft transition group-hover:visible group-hover:opacity-100">
              {['New Arrivals', 'Best Sellers', 'Trending', 'Seasonal', 'Accessories', 'Denim'].map((item) => (
                <Link key={item} to={`/shop?q=${item}`} className="border-b border-stone pb-3 hover:text-gold">{item}</Link>
              ))}
            </div>
          </div>
        </nav>
        <div className="flex items-center gap-4">
          <form onSubmit={search} className="hidden items-center border-b border-ink md:flex">
            <input value={q} onChange={(event) => setQ(event.target.value)} className="w-44 bg-transparent px-2 py-1 text-sm outline-none" placeholder="Search" />
            <button aria-label="Search"><Search size={18} /></button>
          </form>
          <Link to={user ? '/profile' : '/login'} aria-label="Account"><User size={21} /></Link>
          <Link to="/wishlist" aria-label="Wishlist"><Heart size={21} /></Link>
          <Link to="/cart" aria-label="Cart" className="relative"><ShoppingBag size={21} />{cartCount > 0 && <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-ink text-xs text-white">{cartCount}</span>}</Link>
        </div>
      </div>
      {open && <div className="container-pad grid gap-4 border-t border-stone py-5 lg:hidden">{nav.map((item) => <Link key={item.to} to={item.to} onClick={() => setOpen(false)}>{item.label}</Link>)}</div>}
    </header>
  );
}
