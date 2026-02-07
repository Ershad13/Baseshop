import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Shop() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const { addToCart, cart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const isInCart = (id) => cart.some(item => item.id === id);

  if (loading) return <div className="text-center py-20 text-2xl">{t('common.loading')}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">{t('shop.title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-4 flex-grow">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-indigo-600">${product.price}</span>
                <button
                  onClick={() => addToCart(product)}
                  disabled={isInCart(product.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                    isInCart(product.id)
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isInCart(product.id) ? (
                    <><Check size={20} /> {t('shop.in_cart')}</>
                  ) : (
                    <><ShoppingCart size={20} /> {t('shop.add_to_cart')}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
