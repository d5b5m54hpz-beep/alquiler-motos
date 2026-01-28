'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginAdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setLoading(false);
      setError('Email o contraseña incorrectos');
      return;
    }

    if (result?.ok) {
      // Login exitoso, forzar navegación a dashboard
      router.push('/dashboard');
      router.refresh();
    } else {
      setLoading(false);
      setError('Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            🔐
          </div>
          <h1 className="text-2xl font-bold mb-2">Panel de Administración</h1>
          <p className="text-gray-600 text-sm">
            Solo para administradores y operadores
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email corporativo
            </label>
            <input
              type="email"
              placeholder="admin@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verificando...' : 'Acceder al panel'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/login" className="text-sm text-indigo-600 hover:underline">
            ¿Eres cliente? Ir al login de clientes
          </a>
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          Acceso restringido. Si no tenés permisos, no podrás ingresar.
        </p>
      </div>
    </div>
  );
}
