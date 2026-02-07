import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Users, ShoppingBag, DollarSign, LayoutDashboard, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes, ordersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/stats'),
          axios.get('http://localhost:5000/api/admin/users'),
          axios.get('http://localhost:5000/api/admin/orders')
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error('Failed to fetch admin data', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
            <LayoutDashboard />
            {t('common.admin')}
          </h2>
        </div>
        <nav className="mt-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-6 py-4 transition ${activeTab === 'overview' ? 'bg-indigo-50 border-e-4 border-indigo-600 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <BarChart3 size={20} />
            {t('admin.overview')}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-6 py-4 transition ${activeTab === 'users' ? 'bg-indigo-50 border-e-4 border-indigo-600 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Users size={20} />
            {t('admin.users')}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-6 py-4 transition ${activeTab === 'orders' ? 'bg-indigo-50 border-e-4 border-indigo-600 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <ShoppingBag size={20} />
            {t('admin.orders')}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8">
        {activeTab === 'overview' && stats && (
          <div>
            <h1 className="text-3xl font-bold mb-8">{t('admin.overview')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={<Users className="text-blue-600"/>} label={t('admin.total_users')} value={stats.users} bgColor="bg-blue-100" />
              <StatCard icon={<ShoppingBag className="text-purple-600"/>} label={t('admin.total_products')} value={stats.products} bgColor="bg-purple-100" />
              <StatCard icon={<ShoppingBag className="text-orange-600"/>} label={t('admin.total_orders')} value={stats.orders} bgColor="bg-orange-100" />
              <StatCard icon={<DollarSign className="text-green-600"/>} label={t('admin.revenue')} value={`$${stats.revenue.toFixed(2)}`} bgColor="bg-green-100" />
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h1 className="text-3xl font-bold mb-8">{t('admin.users')}</h1>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-start">
                <thead className="bg-gray-50 border-b text-gray-400 text-xs uppercase font-bold">
                  <tr>
                    <th className="px-6 py-4 text-start">{t('admin.email')}</th>
                    <th className="px-6 py-4 text-start">{t('admin.role')}</th>
                    <th className="px-6 py-4 text-start">{t('admin.date')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map(u => (
                    <tr key={u.id}>
                      <td className="px-6 py-4">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(u.created_at).toLocaleDateString(i18n.language)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h1 className="text-3xl font-bold mb-8">{t('admin.orders')}</h1>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-start">
                <thead className="bg-gray-50 border-b text-gray-400 text-xs uppercase font-bold">
                  <tr>
                    <th className="px-6 py-4 text-start">{t('dashboard.order_id')}</th>
                    <th className="px-6 py-4 text-start">{t('admin.email')}</th>
                    <th className="px-6 py-4 text-start">{t('admin.amount')}</th>
                    <th className="px-6 py-4 text-start">{t('admin.status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td className="px-6 py-4 font-semibold">#{o.id}</td>
                      <td className="px-6 py-4">{o.user_email}</td>
                      <td className="px-6 py-4 text-indigo-600 font-bold">${o.total_amount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold uppercase">
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bgColor }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`${bgColor} p-4 rounded-xl`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
