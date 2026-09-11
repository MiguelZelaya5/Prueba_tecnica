import { useState } from 'react';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { username, password });
      login(data.token);
    } catch (err) {
      setError('Credenciales inválidas o servidor apagado');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Acceso al Sistema</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>}
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Usuario</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full border p-2 rounded" />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border p-2 rounded" />
        </div>
        
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Ingresar</button>
      </form>
    </div>
  );
}