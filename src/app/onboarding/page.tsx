"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaCheck, FaRocket, FaKey, FaCog, FaPlay } from 'react-icons/fa';
import Button from '@/components/ui/SimpleButton';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [joobleCredentials, setJoobleCredentials] = useState({
    apiKey: '',
    countryCode: 'es',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 1,
      title: "Configurar Credenciales Jooble",
      description: "Conecta tu cuenta de Jooble para comenzar a distribuir ofertas",
      icon: <FaKey className="h-6 w-6" />,
      completed: false
    },
    {
      id: 2,
      title: "Crear Primera Campaña",
      description: "Lanza tu primera campaña de reclutamiento",
      icon: <FaRocket className="h-6 w-6" />,
      completed: false
    },
    {
      id: 3,
      title: "Configuración Completa",
      description: "¡Todo listo! Accede al dashboard completo",
      icon: <FaCheck className="h-6 w-6" />,
      completed: false
    }
  ]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleSaveJoobleCredentials = async () => {
    if (!joobleCredentials.apiKey.trim()) {
      setError('La API Key de Jooble es requerida');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Guardar credenciales en la plataforma principal
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${session?.user?.id}/credentials/jooble`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentials: {
            apiKey: joobleCredentials.apiKey,
            countryCode: joobleCredentials.countryCode,
          },
          limits: {
            dailyBudgetLimit: 100, // Límite conservador para inicio
            monthlyBudgetLimit: 2000,
            maxCPA: 25,
          },
          configuration: {
            timezone: 'Europe/Madrid',
            notifications: true,
          }
        }),
      });

      if (response.ok) {
        // Marcar paso como completado
        setSteps(prev => prev.map(step => 
          step.id === 1 ? { ...step, completed: true } : step
        ));
        setCurrentStep(2);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al guardar credenciales');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFirstCampaign = () => {
    // Redirigir a la plataforma principal para crear campaña
    window.location.href = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/campanas/nueva?onboarding=true`;
  };

  const handleCompleteDashboard = () => {
    // Redirigir al dashboard principal
    window.location.href = `${process.env.NEXT_PUBLIC_FRONTEND_URL}`;
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null; // Se redirigirá en useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <FaRocket className="h-8 w-8 text-blue-600 mr-3" />
              <span className="text-2xl font-bold text-gray-900">JobPlatform</span>
            </div>
            <div className="flex items-center space-x-4">
              <img 
                src={session.user?.image || ''} 
                alt="Avatar" 
                className="h-8 w-8 rounded-full"
              />
              <span className="text-sm text-gray-700">{session.user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ¡Bienvenido a JobPlatform! 👋
          </h1>
          <p className="text-xl text-gray-600">
            Vamos a configurar tu cuenta en menos de 5 minutos
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                  ${step.completed 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : currentStep === step.id 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-400'
                  }
                `}>
                  {step.completed ? <FaCheck /> : step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-24 h-1 mx-4 transition-all duration-300
                    ${step.completed ? 'bg-green-500' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🔑 Configurar Credenciales de Jooble
              </h2>
              <p className="text-gray-600 mb-6">
                Para comenzar a distribuir ofertas, necesitamos conectar tu cuenta de Jooble.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Key de Jooble *
                  </label>
                  <input
                    type="password"
                    value={joobleCredentials.apiKey}
                    onChange={(e) => setJoobleCredentials(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder="Introduce tu API Key de Jooble"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Proporcionada por tu manager de Jooble
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    País de Publicación
                  </label>
                  <select
                    value={joobleCredentials.countryCode}
                    onChange={(e) => setJoobleCredentials(prev => ({ ...prev, countryCode: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="es">España (ES)</option>
                    <option value="fr">Francia (FR)</option>
                    <option value="de">Alemania (DE)</option>
                    <option value="uk">Reino Unido (UK)</option>
                    <option value="us">Estados Unidos (US)</option>
                    <option value="mx">México (MX)</option>
                  </select>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handleSaveJoobleCredentials}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Validando credenciales...
                    </div>
                  ) : (
                    'Guardar y Continuar'
                  )}
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🚀 Crear Tu Primera Campaña
              </h2>
              <p className="text-gray-600 mb-8">
                ¡Perfecto! Tus credenciales están configuradas. Ahora vamos a crear tu primera campaña.
              </p>

              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-blue-900 mb-2">¿Qué incluye tu primera campaña?</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Distribución automática en Jooble</li>
                  <li>• Presupuesto inicial conservador (€50/día)</li>
                  <li>• Segmentación inteligente de ofertas</li>
                  <li>• Tracking completo de ROI</li>
                </ul>
              </div>

              <Button
                onClick={handleCreateFirstCampaign}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-medium transition-colors"
              >
                <FaPlay className="mr-2" />
                Crear Primera Campaña
              </Button>
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🎉 ¡Configuración Completa!
              </h2>
              <p className="text-gray-600 mb-8">
                ¡Excelente! Tu cuenta está lista. Ahora puedes acceder al dashboard completo para gestionar todas tus campañas.
              </p>

              <div className="bg-green-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-green-900 mb-2">Ya tienes acceso a:</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Dashboard de métricas en tiempo real</li>
                  <li>• Gestión completa de campañas</li>
                  <li>• Sistema de optimización automática</li>
                  <li>• Reportes detallados de performance</li>
                </ul>
              </div>

              <Button
                onClick={handleCompleteDashboard}
                className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-lg font-medium transition-colors"
              >
                <FaCog className="mr-2" />
                Acceder al Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}