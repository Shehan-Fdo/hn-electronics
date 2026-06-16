import { useState, useEffect } from 'react';

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Only runs on the client
    const storedToken = localStorage.getItem('accessToken');
    const role = localStorage.getItem('userRole');
    
    if (storedToken && role === 'admin') {
      setIsAdmin(true);
      setToken(storedToken);
    }
    
    setIsReady(true);
  }, []);

  return { isAdmin, token, isReady };
}
