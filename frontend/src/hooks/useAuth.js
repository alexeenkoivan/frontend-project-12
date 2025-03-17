import { useState, useEffect } from 'react';

const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return token;
};

export default useAuth;
