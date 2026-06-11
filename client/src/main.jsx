import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { store } from './store/store.js';
import AppLayout from './components/layout/AppLayout.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';
import ProtectedRoute from './components/routing/ProtectedRoute.jsx';
import './index.css';

const Home = lazy(() => import('./pages/Home.jsx'));
const Shop = lazy(() => import('./pages/Shop.jsx'));
const ProductDetails = lazy(() => import('./pages/ProductDetails.jsx'));
const Category = lazy(() => import('./pages/Category.jsx'));
const SearchResults = lazy(() => import('./pages/SearchResults.jsx'));
const Wishlist = lazy(() => import('./pages/Wishlist.jsx'));
const Cart = lazy(() => import('./pages/Cart.jsx'));
const Checkout = lazy(() => import('./pages/Checkout.jsx'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const OrderHistory = lazy(() => import('./pages/OrderHistory.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const StaticPage = lazy(() => import('./pages/StaticPage.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const AdminResource = lazy(() => import('./pages/admin/AdminResource.jsx'));

const loader = <div className="container-pad py-24 text-center text-sm uppercase tracking-[0.25em]">Loading Veloura</div>;

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/shop', element: <Shop /> },
      { path: '/product/:slug', element: <ProductDetails /> },
      { path: '/category/:slug', element: <Category /> },
      { path: '/search', element: <SearchResults /> },
      { path: '/wishlist', element: <ProtectedRoute><Wishlist /></ProtectedRoute> },
      { path: '/cart', element: <Cart /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/order-success/:id', element: <OrderSuccess /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: '/orders', element: <ProtectedRoute><OrderHistory /></ProtectedRoute> },
      { path: '/contact', element: <Contact /> },
      { path: '/about', element: <StaticPage type="about" /> },
      { path: '/privacy-policy', element: <StaticPage type="privacy" /> },
      { path: '/terms', element: <StaticPage type="terms" /> },
      { path: '/returns-refunds', element: <StaticPage type="returns" /> }
    ]
  },
  {
    path: '/admin',
    element: <ProtectedRoute admin><AdminLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: ':resource', element: <AdminResource /> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <Suspense fallback={loader}>
          <RouterProvider router={router} />
        </Suspense>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);
