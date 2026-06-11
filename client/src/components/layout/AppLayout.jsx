import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-ivory">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
