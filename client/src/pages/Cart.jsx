import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ArrowRight, CreditCard } from 'lucide-react';
import axios from 'axios';

export default function Cart() {
  const { cart, removeFromCart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login?redirect=cart');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/orders', {
        items: cart,
        total: total
      });
      clearCart();
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to place order. Please try again.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Browse our collection to find the perfect plan for your project.</p>
        <Link to="/shop" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-6">
              <img src={item.image_url} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
              <div className="flex-grow">
                <h3 className="text-xl font-bold">{item.name}</h3>
                <p className="text-indigo-600 font-bold">${item.price}</p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <Trash2 />
              </button>
            </div>
          ))}
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 h-fit">
          <h3 className="text-xl font-bold mb-6">Order Summary</h3>
          <div className="flex justify-between mb-4 pb-4 border-b">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-bold">${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-8">
            <span className="text-xl font-bold">Total</span>
            <span className="text-xl font-bold text-indigo-600">${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
          >
            <CreditCard size={20} />
            Checkout Now
          </button>
          <div className="mt-6 flex items-center gap-2 text-gray-400 text-sm justify-center">
            <ShieldCheck size={16} />
            Secure checkout powered by Stripe (Mocked)
          </div>
        </div>
      </div>
    </div>
  );
}

function ShieldCheck({ size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
