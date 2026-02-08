"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Zap } from 'lucide-react';

export default function DashboardRedirectPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      // Redirigir al dashboard principal de la plataforma
      window.location.href = `${process.env.NEXT_PUBLIC_PLATFORM_URL}`;
    } else if (status === 'unauthenticated') {
      // Si no está autenticado, redirigir al login del platform
      const platformUrl = process.env.NEXT_PUBLIC_PLATFORM_URL || 'http://localhost:3006';
      window.location.href = `${platformUrl}/login`;
    }
  }, [status, session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mb-6 animate-bounce">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Verificando sesión...
          </h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mb-6 animate-pulse">
          <Zap className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          ¡Bienvenido a Job<span className="font-bold text-blue-600">Optimizer</span>!
        </h2>
        <p className="text-gray-600 mb-6">
          Redirigiendo al dashboard principal...
        </p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>
  );
}