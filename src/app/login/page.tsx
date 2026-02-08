"use client";

import { useEffect } from 'react';

export default function LoginRedirect() {
  useEffect(() => {
    console.log('🎯 Landing Page: Redirigiendo al dashboard login...');
    
    // Redirigir directamente al login del dashboard usando variable de entorno
    const platformUrl = process.env.NEXT_PUBLIC_PLATFORM_URL || 'http://localhost:3006';
    window.location.href = `${platformUrl}/login`;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Redirigiendo al Dashboard...
        </h2>
        <p className="text-gray-600">
          Serás redirigido al sistema de login principal
        </p>
      </div>
    </div>
  );
}