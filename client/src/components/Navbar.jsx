import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Map, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fa' ? 'en' : 'fa';
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-indigo-600">
          <Map size={32} />
          <span>ArchMaps</span>
        </Link>
        <div className="flex items-center gap-6">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 hover:text-indigo-600 uppercase font-bold text-sm"
          >
            <Languages size={18} />
            {i18n.language === 'fa' ? 'EN' : 'FA'}
          </button>
          <Link to="/shop" className="hover:text-indigo-600">{t('common.shop')}</Link>
          <Link to="/cart" className="relative hover:text-indigo-600">
            <ShoppingCart />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              {user.role === 'admin' && (
                <Link to="/admin" className="text-indigo-600 font-bold hover:underline">
                  {t('common.admin')}
                </Link>
              )}
              <Link to="/dashboard" className="flex items-center gap-1 hover:text-indigo-600">
                <User size={20} />
                <span>{user.name}</span>
              </Link>
              <button onClick={logout} title={t('common.logout')} className="text-gray-600 hover:text-red-500">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
              {t('common.login')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
