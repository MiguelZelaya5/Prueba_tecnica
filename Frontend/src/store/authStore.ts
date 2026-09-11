import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  token: string | null;
  role: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const initialToken = localStorage.getItem('token');
  let initialRole = null;
  
  if (initialToken) {
    try {
      const decoded: any = jwtDecode(initialToken);
      // La clave del rol en claims de .NET
      initialRole = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    } catch { /* Token inválido */ }
  }

  return {
    token: initialToken,
    role: initialRole,
    login: (token) => {
      localStorage.setItem('token', token);
      const decoded: any = jwtDecode(token);
      const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      set({ token, role });
    },
    logout: () => {
      localStorage.removeItem('token');
      set({ token: null, role: null });
    }
  };
});