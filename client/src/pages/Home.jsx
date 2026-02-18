import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Download, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1600&q=80"
            className="w-full h-full object-cover brightness-50"
            alt="Architecture Background"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            {t('home.hero_title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            {t('home.hero_subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/shop" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center gap-2 transition text-lg">
              {t('home.explore_button')} <ArrowRight size={20} className="rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <MapPin size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">{t('home.feature_1_title')}</h3>
          <p className="text-gray-600">{t('home.feature_1_desc')}</p>
        </div>
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <Download size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">{t('home.feature_2_title')}</h3>
          <p className="text-gray-600">{t('home.feature_2_desc')}</p>
        </div>
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <ShieldCheck size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">{t('home.feature_3_title')}</h3>
          <p className="text-gray-600">{t('home.feature_3_desc')}</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <div className="bg-gray-900 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 text-white">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.cta_title')}</h2>
            <p className="text-gray-400 text-lg">{t('home.cta_desc')}</p>
          </div>
          <Link to="/shop" className="bg-white text-gray-900 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition whitespace-nowrap">
            {t('home.cta_button')}
          </Link>
        </div>
      </section>
    </div>
  );
}
