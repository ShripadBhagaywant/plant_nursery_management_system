import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export const useAuth = () => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      const { sub: email, role, roles, userId, exp } = decoded;

      if (Date.now() / 1000 > exp) throw new Error('Token expired');

      // Ensure userId is also saved on first load
      if (userId) {
        localStorage.setItem('userId', userId.toString());
      }

      return { token, email, role: role || roles?.[0], userId };
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      return null;
    }
  });

  const login = (token) => {
    try {
      const decoded = jwtDecode(token);
      const { sub: email, role, roles, userId } = decoded;

      localStorage.setItem('token', token);
      if (userId) {
        localStorage.setItem('userId', userId.toString());
      }

      setAuth({ token, email, role: role || roles?.[0], userId });
    } catch (err) {
      console.error("Invalid token during login", err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setAuth(null);
  };

  return { auth, login, logout };
};
