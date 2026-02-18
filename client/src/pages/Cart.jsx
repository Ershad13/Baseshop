import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ArrowRight, CreditCard, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function Cart() {
  const { t } = useTranslation();
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
      alert(t('cart.checkout_error'));
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">{t('cart.empty')}</h2>
        <Link to="/shop" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
          {t('cart.go_to_shop')}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t('cart.title')}</h1>
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
          <h3 className="text-xl font-bold mb-6">{t('cart.summary')}</h3>
          <div className="flex justify-between mb-4 pb-4 border-b">
            <span className="text-gray-600">{t('cart.subtotal')}</span>
            <span className="font-bold">${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-8">
            <span className="text-xl font-bold">{t('cart.total')}</span>
            <span className="text-xl font-bold text-indigo-600">${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
          >
            <CreditCard size={20} />
            {t('cart.checkout')}
          </button>
          <div className="mt-6 flex items-center gap-2 text-gray-400 text-sm justify-center">
            <ShieldCheck size={16} />
            {t('cart.secure_checkout')}
          </div>
        </div>
      </div>
    </div>
  );
}
