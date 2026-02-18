import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Download, FileText, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      axios.get('http://localhost:5000/api/my-orders')
        .then(res => {
          setOrders(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  const handleDownload = async (productId, fileName) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/download/${productId}`);
      const link = document.createElement('a');
      link.href = res.data.downloadUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert(t('dashboard.download_error'));
    }
  };

  if (!user) return <div className="text-center py-20">{t('common.login_required')}</div>;
  if (loading) return <div className="text-center py-20">{t('common.loading')}</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t('dashboard.title')}</h1>
      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm text-center border border-gray-100">
          <FileText size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold mb-2">{t('dashboard.no_orders')}</h2>
          <p className="text-gray-600 mb-6">{t('dashboard.no_orders_desc')}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-8 py-4 flex justify-between items-center border-b">
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs uppercase text-gray-400 font-bold">{t('dashboard.date')}</p>
                    <p className="text-sm font-semibold flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(order.created_at).toLocaleDateString(i18n.language)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-400 font-bold">{t('dashboard.total')}</p>
                    <p className="text-sm font-semibold">${order.total_amount.toFixed(2)}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 font-medium">{t('dashboard.order_id')}: #{order.id}</p>
              </div>
              <div className="p-8 space-y-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600">
                        <FileText size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{item.name}</h4>
                        <p className="text-sm text-gray-500">{t('dashboard.ready_download')}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(item.id, item.file_path)}
                      className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-black transition shadow-md"
                    >
                      <Download size={18} />
                      {t('dashboard.download')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
