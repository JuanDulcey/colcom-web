import React, { useState, useEffect } from 'react';
import { authApi } from '../../api/auth.api';

export function SecuritySettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadSecurityQuestion();
  }, []);

  const loadSecurityQuestion = async () => {
    try {
      const res = await authApi.getSecurityQuestionMe();
      if (res.data?.pregunta_seguridad) {
        setCurrentQuestion(res.data.pregunta_seguridad);
        setPregunta(res.data.pregunta_seguridad);
      } else {
        setCurrentQuestion(null);
      }
    } catch (error) {
      console.error('Error loading security question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    if (pregunta.length < 3 || respuesta.length < 2) {
      setMessage({ type: 'error', text: 'La pregunta debe tener al menos 3 caracteres y la respuesta al menos 2.' });
      setSaving(false);
      return;
    }

    try {
      await authApi.updateSecurityQuestion({
        pregunta_seguridad: pregunta,
        respuesta_seguridad: respuesta
      });
      setMessage({ type: 'success', text: 'Pregunta de seguridad actualizada con éxito.' });
      setCurrentQuestion(pregunta);
      setRespuesta(''); // Clear answer field for security
    } catch (err: any) {
      const errMsg = err.errors ? err.errors.join(', ') : (err.message || 'Error al guardar');
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7A0A83]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Seguridad de la Cuenta</h1>
          <p className="mt-2 text-sm text-gray-500">Configura tu pregunta de seguridad para poder recuperar tu contraseña si la olvidas.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8">
          {!currentQuestion ? (
            <div className="mb-8 p-4 bg-amber-50 text-amber-800 rounded-2xl border border-amber-200 flex items-start gap-4">
              <svg className="w-6 h-6 shrink-0 mt-0.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <div>
                <h3 className="font-bold">Aviso importante</h3>
                <p className="text-sm mt-1 opacity-90">Aún no has configurado una pregunta de seguridad. Es indispensable que lo hagas para poder restablecer tu contraseña en el futuro.</p>
              </div>
            </div>
          ) : (
            <div className="mb-8 p-4 bg-green-50 text-green-800 rounded-2xl border border-green-200 flex items-start gap-4">
              <svg className="w-6 h-6 shrink-0 mt-0.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div>
                <h3 className="font-bold">Configuración activa</h3>
                <p className="text-sm mt-1 opacity-90">Ya tienes una pregunta de seguridad guardada. Puedes cambiarla si lo deseas.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pregunta de Seguridad</label>
              <input
                type="text"
                value={pregunta}
                onChange={(e) => setPregunta(e.target.value)}
                placeholder="Ej: ¿Cómo se llama tu primera mascota?"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#7A0A83]/20 focus:border-[#7A0A83] transition-colors outline-none"
                required
                minLength={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Respuesta</label>
              <input
                type="text"
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                placeholder="Ingresa la respuesta secreta"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#7A0A83]/20 focus:border-[#7A0A83] transition-colors outline-none"
                required
                minLength={2}
              />
              <p className="text-xs text-gray-400 mt-2">La respuesta será guardada de forma segura (encriptada) y no importan las mayúsculas o minúsculas.</p>
            </div>

            {message.text && (
              <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {message.text}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-[#7A0A83] text-white rounded-xl font-bold hover:bg-[#610769] transition-all disabled:opacity-50"
              >
                {saving ? 'Guardando...' : (currentQuestion ? 'Actualizar Pregunta' : 'Guardar Pregunta')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
