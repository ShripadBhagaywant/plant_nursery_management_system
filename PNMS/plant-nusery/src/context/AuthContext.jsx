import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded.role || decoded.roles?.[0];
        const email = decoded.sub;
        if (Date.now() / 1000 > decoded.exp) throw new Error('Token expired');
        setAuth({ token, email, role , id });
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setAuth(null);
      }
    }
  }, []);

  const login = (token) => {
    const decoded = jwtDecode(token);
    const role = decoded.role || decoded.roles?.[0];
    const email = decoded.sub;
    const id = decoded.id || decoded.userId;
    localStorage.setItem('token', token);
    setAuth({ token, email, role , id });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);