import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../lib/api.js';
import SEO from '../lib/seo.jsx';
import { fetchCart } from '../store/cartSlice.js';

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [form, setForm] = useState({ fullName: user?.name || '', email: user?.email || '', phone: '', line1: '', city: '', state: '', postalCode: '', country: 'India' });
  useEffect(() => { dispatch(fetchCart()); }, [dispatch]);
  const submit = async (event) => {
    event.preventDefault();
    const order = (await api.post('/orders', { customer: { name: form.fullName, email: form.email, phone: form.phone }, shippingAddress: form, paymentMethod, guestId: localStorage.getItem('veloura_guest_id') })).data;
    if (paymentMethod === 'razorpay' && window.Razorpay) {
      const razorpay = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.pricing.total * 100,
        currency: 'INR',
        order_id: order.payment.razorpayOrderId,
        name: 'Veloura',
        handler: async (response) => {
          await api.post('/orders/verify-payment', response);
          navigate(`/order-success/${order._id}`);
        }
      });
      razorpay.open();
    } else navigate(`/order-success/${order._id}`);
  };
  return (
    <section className="container-pad py-12">
      <SEO title="Checkout" />
      <h1 className="font-display text-5xl">Checkout</h1>
      <form onSubmit={submit} className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          {['fullName', 'email', 'phone', 'line1', 'city', 'state', 'postalCode'].map((name) => <input key={name} required value={form[name]} onChange={(event) => setForm({ ...form, [name]: event.target.value })} placeholder={name.replace(/([A-Z])/g, ' $1')} className="input" />)}
          <div className="grid gap-3 bg-white p-5">
            <label><input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} /> Cash on Delivery</label>
            <label><input type="radio" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} /> Razorpay: UPI, Cards, Net Banking</label>
          </div>
        </div>
        <aside className="bg-white p-6 shadow-soft">
          <h2 className="font-semibold">Order summary</h2>
          {cart.items.map((item) => <p key={item._id} className="mt-3 flex justify-between text-sm"><span>{item.product?.name} x {item.quantity}</span><strong>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong></p>)}
          <button className="btn-primary mt-6 w-full">Place order</button>
        </aside>
      </form>
    </section>
  );
}
