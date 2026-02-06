import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/login', { email, password });
    setUser(res.data.user);
    setToken(res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    localStorage.setItem('token', res.data.token);
  };

  const signup = async (email, password, name) => {
    const res = await axios.post('http://localhost:5000/api/signup', { email, password, name });
    setUser(res.data.user);
    setToken(res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    localStorage.setItem('token', res.data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const loginWithToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    // User profile will be fetched or set to a placeholder
    const placeholderUser = { email: 'User', name: 'Google User' };
    setUser(placeholderUser);
    localStorage.setItem('user', JSON.stringify(placeholderUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loginWithToken }}>
      {children}
    </AuthContext.Provider>
  );
};
