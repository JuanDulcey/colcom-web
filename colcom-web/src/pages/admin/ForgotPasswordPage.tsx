import React, { useState } from 'react';
import { apiRequest } from '../../api/client.js';
import { navigate } from '../../routes/navigation';
import { useCountry } from '../../hooks/useCountry';
import latLogo from '../../assets/imgs/latComparte.png';

export function ForgotPasswordPage() {
  const { activeCountry } = useCountry();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    setLoading(true);
    setError('');
    try {
      const res = await apiRequest(`/auth/security-question?username=${username}`, { method: 'GET' });
      if (res.data?.pregunta) {
        setSecurityQuestion(res.data.pregunta);
        setStep(2);
      } else {
        setError('El usuario no tiene pregunta de seguridad configurada.');
      }
    } catch (err: any) {
      setError(err.message || 'Usuario no encontrado');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({
          username,
          respuesta_seguridad: securityAnswer,
          new_password: newPassword
        })
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al restablecer contraseña');
    } finally {
      setLoading(false);
    }
  };

  const primaryColor = activeCountry?.colors?.[0] || '#7A0A83';

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: `radial-gradient(circle at center, ${primaryColor} 0%, #2A044A 100%)`
      }}
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 bg-white rounded-xl shadow-2xl p-8 md:p-10 w-full max-w-[400px] flex flex-col items-center">
        <img 
          src={latLogo} 
          alt="Latinoamérica Comparte" 
          className="h-16 w-auto mb-6 cursor-pointer"
          onClick={() => navigate('/')}
        />

        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Recuperar Contraseña
        </h1>

        {success ? (
          <div className="text-center text-green-600 font-medium mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Contraseña restablecida correctamente. Redirigiendo al login...
          </div>
        ) : step === 1 ? (
          <form onSubmit={handleUsernameSubmit} className="w-full space-y-5">
            <p className="text-gray-600 text-sm text-center mb-4">Ingresa tu nombre de usuario para buscar tu pregunta de seguridad.</p>
            <div className="relative">
              <input 
                type="text"
                placeholder="Nombre de usuario"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                style={{ '--color-primary': primaryColor } as any}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <button 
              type="submit" 
              disabled={loading || !username}
              className="w-full py-3 text-white font-bold rounded-full transition-transform hover:scale-105 hover:shadow-lg disabled:opacity-70 disabled:hover:scale-100"
              style={{ background: `linear-gradient(90deg, ${primaryColor} 0%, #A81B85 100%)` }}
            >
              {loading ? 'BUSCANDO...' : 'CONTINUAR'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/login')}
              className="w-full py-2 text-gray-500 text-sm hover:underline"
            >
              Volver al inicio de sesión
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} className="w-full space-y-5">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Pregunta de Seguridad</p>
              <p className="font-semibold text-gray-800">{securityQuestion}</p>
            </div>
            
            <div className="relative">
              <input 
                type="text"
                placeholder="Respuesta secreta"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                style={{ '--color-primary': primaryColor } as any}
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <input 
                type="password"
                placeholder="Nueva contraseña"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                style={{ '--color-primary': primaryColor } as any}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <button 
              type="submit" 
              disabled={loading || !securityAnswer || !newPassword}
              className="w-full py-3 text-white font-bold rounded-full transition-transform hover:scale-105 hover:shadow-lg disabled:opacity-70 disabled:hover:scale-100"
              style={{ background: `linear-gradient(90deg, ${primaryColor} 0%, #A81B85 100%)` }}
            >
              {loading ? 'PROCESANDO...' : 'RESTABLECER CONTRASEÑA'}
            </button>
            <button 
              type="button" 
              onClick={() => setStep(1)}
              className="w-full py-2 text-gray-500 text-sm hover:underline"
            >
              Intentar con otro usuario
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
