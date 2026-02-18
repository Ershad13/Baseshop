import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login, signup, loginWithToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      loginWithToken(token);
      navigate(redirect);
    }
  }, [searchParams, navigate, redirect, loginWithToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let data;
      if (isLogin) {
        data = await login(email, password);
      } else {
        data = await signup(email, password, name);
      }

      if (redirect === '/') {
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        navigate(redirect);
      }
    } catch (err) {
      setError(err.response?.data?.message || t('login.auth_failed'));
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8">
          {isLogin ? t('login.title') : t('login.signup_title')}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <UserIcon className="absolute inset-y-0 start-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={t('login.full_name')}
                className="w-full ps-10 pe-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute inset-y-0 start-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              placeholder={t('login.email')}
              className="w-full ps-10 pe-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute inset-y-0 start-3 top-3 text-gray-400" size={20} />
            <input
              type="password"
              placeholder={t('login.password')}
              className="w-full ps-10 pe-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition duration-200"
          >
            {isLogin ? t('login.submit') : t('login.signup_submit')}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-4">
          <button
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition"
            onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            {t('login.google_login')}
          </button>
        </div>

        <div className="mt-8 text-center text-gray-600">
          {isLogin ? (
            <p>
              {t('login.no_account')}{' '}
              <button onClick={() => setIsLogin(false)} className="text-indigo-600 font-bold hover:underline">
                {t('login.signup_link')}
              </button>
            </p>
          ) : (
            <p>
              {t('login.already_account')}{' '}
              <button onClick={() => setIsLogin(true)} className="text-indigo-600 font-bold hover:underline">
                {t('login.login_link')}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
