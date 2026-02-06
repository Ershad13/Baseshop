import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Map } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-indigo-600">
          <Map size={32} />
          <span>ArchMaps</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/shop" className="hover:text-indigo-600">Shop</Link>
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
              <Link to="/dashboard" className="flex items-center gap-1 hover:text-indigo-600">
                <User size={20} />
                <span>{user.name}</span>
              </Link>
              <button onClick={logout} className="text-gray-600 hover:text-red-500">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
