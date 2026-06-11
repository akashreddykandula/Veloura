import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { applyCoupon, fetchCart, removeItem, updateQty } from '../store/cartSlice.js';
import SEO from '../lib/seo.jsx';

export default function Cart() {
  const dispatch = useDispatch();
  const [code, setCode] = useState('');
  const cart = useSelector((state) => state.cart);
  useEffect(() => { dispatch(fetchCart()); }, [dispatch]);
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = cart.coupon?.discount || 0;
  return (
    <section className="container-pad py-12">
      <SEO title="Shopping Cart" />
      <h1 className="font-display text-5xl">Cart</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-5">
          {cart.items.map((item) => (
            <div key={item._id} className="grid grid-cols-[110px_1fr] gap-4 border-b border-stone pb-5">
              <img src={item.product?.images?.[0]?.url} alt={item.product?.name} className="aspect-[4/5] object-cover" />
              <div>
                <div className="flex justify-between gap-4"><h3 className="font-semibold">{item.product?.name}</h3><button onClick={() => dispatch(removeItem(item._id))} className="text-sm underline">Remove</button></div>
                <p className="mt-1 text-sm text-neutral-500">{item.size} / {item.color}</p>
                <div className="mt-4 flex items-center justify-between">
                  <input type="number" min="1" value={item.quantity} onChange={(event) => dispatch(updateQty({ itemId: item._id, quantity: Number(event.target.value) }))} className="input w-20" />
                  <strong>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>
          ))}
          {!cart.items.length && <p>Your cart is ready for a little drama. Add a piece you love.</p>}
        </div>
        <aside className="bg-white p-6 shadow-soft">
          <h2 className="text-xl font-semibold">Order summary</h2>
          <form onSubmit={(event) => { event.preventDefault(); dispatch(applyCoupon(code)); }} className="mt-5 flex">
            <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Promo code" className="input" />
            <button className="btn-primary px-4">Apply</button>
          </form>
          <div className="mt-6 grid gap-3 text-sm">
            <p className="flex justify-between"><span>Subtotal</span><strong>₹{subtotal.toLocaleString('en-IN')}</strong></p>
            <p className="flex justify-between"><span>Discount</span><strong>-₹{discount.toLocaleString('en-IN')}</strong></p>
            <p className="flex justify-between border-t border-stone pt-3 text-lg"><span>Total</span><strong>₹{(subtotal - discount).toLocaleString('en-IN')}</strong></p>
          </div>
          <Link to="/checkout" className="btn-primary mt-6 w-full">Checkout</Link>
        </aside>
      </div>
    </section>
  );
}
