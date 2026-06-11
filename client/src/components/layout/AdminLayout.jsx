import { NavLink, Outlet } from 'react-router-dom';

const links = ['products', 'orders', 'customers', 'coupons', 'banners', 'reviews', 'reports'];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-neutral-100">
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-ink p-6 text-white lg:block">
        <h1 className="font-display text-3xl">Veloura</h1>
        <nav className="mt-10 grid gap-2">
          <NavLink to="/admin" end className="rounded px-3 py-2 hover:bg-white/10">Dashboard</NavLink>
          {links.map((link) => <NavLink key={link} to={`/admin/${link}`} className="rounded px-3 py-2 capitalize hover:bg-white/10">{link}</NavLink>)}
        </nav>
      </aside>
      <main className="lg:pl-64">
        <div className="border-b bg-white px-6 py-4 font-semibold">Admin Workspace</div>
        <div className="p-6"><Outlet /></div>
      </main>
    </div>
  );
}
