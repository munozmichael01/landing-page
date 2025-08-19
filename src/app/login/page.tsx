"use client";

import { signIn, getSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaGoogle, FaChartLine, FaUsers, FaEye, FaEyeSlash, FaEnvelope, FaLock, FaCheckCircle } from 'react-icons/fa';
import { Zap, Shield, TrendingUp } from 'lucide-react';
import Button from '@/components/ui/SimpleButton';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { postJSON } from '@/lib/api';

type LoginBody = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  useEffect(() => {
    console.log('Landing Page: Componente montado, verificando autenticación...');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validaciones básicas
    if (!formData.email.trim()) {
      setError('El email es requerido');
      setLoading(false);
      return;
    }

    if (!formData.password.trim()) {
      setError('La contraseña es requerida');
      setLoading(false);
      return;
    }

    try {
      console.log('🔑 Landing: Iniciando proceso de login...');
      
      // Intentar login con backend propio
      const response = await postJSON('/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      console.log('✅ Landing: Login exitoso:', response);
      setSuccess('¡Autenticación exitosa! Redirigiendo al dashboard...');

      // Pequeña pausa para mostrar el mensaje de éxito
      setTimeout(() => {
        // Redirigir al dashboard principal con token en la URL
        const dashboardUrl = `http://localhost:3006/login?token=${response.token}&redirect=dashboard`;
        console.log('🚀 Landing: Redirigiendo a:', dashboardUrl);
        window.location.href = dashboardUrl;
      }, 1000);
      
    } catch (error: any) {
      console.error('❌ Landing: Error en login:', error);
      setError(error.message || 'Credenciales incorrectas. Verifica tu email y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await signIn('google', {
        callbackUrl: '/onboarding',
        redirect: false,
      });
      
      if (result?.ok) {
        router.push('/dashboard-redirect');
      } else if (result?.error) {
        setError('Error al iniciar sesión con Google. Verifica la configuración OAuth.');
      }
    } catch (error) {
      console.error('Error en Google Sign In:', error);
      setError('Error al conectar con Google. Por favor intenta de nuevo.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Landing Page: Input cambiado:', e.target.name, e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(''); // Limpiar error al escribir
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Main Login Content */}
      <main className="pt-20 lg:pt-24 min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] lg:min-h-[calc(100vh-6rem)] px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Bienvenido de vuelta
              </h2>
              <p className="text-gray-600 mb-4">
                Accede a tu plataforma de <span className="font-bold text-blue-600">Job Distribution</span>
              </p>
            </div>

            <div className="mt-8 space-y-6">
              {/* Google Sign In Button */}
              <Button
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                {googleLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                    Conectando...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <FaGoogle className="h-5 w-5 text-red-500 mr-3" />
                    Continuar con Google
                  </div>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">o iniciar sesión con email</span>
                </div>
              </div>

              {/* Login Form */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Tu contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Success Message */}
                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
                    <div className="flex items-center">
                      <FaCheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <p className="text-green-700 text-sm font-medium">{success}</p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-600 text-sm font-medium">{error}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || googleLoading || success}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    success 
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Autenticando...
                    </div>
                  ) : success ? (
                    <div className="flex items-center justify-center">
                      <FaCheckCircle className="h-5 w-5 mr-2" />
                      ¡Autenticado! Redirigiendo...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Acceder al Dashboard
                    </div>
                  )}
                </Button>
              </form>

              <div className="text-center">
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Benefits */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">Características principales</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                  <span className="text-sm text-green-800 font-medium">ROI optimizado automáticamente</span>
                </div>
                <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <FaUsers className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                  <span className="text-sm text-blue-800 font-medium">4+ canales de distribución</span>
                </div>
                <div className="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <Zap className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0" />
                  <span className="text-sm text-purple-800 font-medium">Setup rápido y sencillo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Signup Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Regístrate gratis aquí
              </Link>
            </p>
          </div>

          {/* Terms */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Al continuar, aceptas nuestros{' '}
              <Link href="/terms" className="font-medium text-blue-600 hover:text-blue-500">
                Términos de Servicio
              </Link>{' '}
              y{' '}
              <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
                Política de Privacidad
              </Link>
            </p>
          </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}