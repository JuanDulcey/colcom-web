import React, { useEffect, useState } from 'react';
import { solicitudesApi } from '../../api/solicitudes.api.js';
import { useCountry } from '../../hooks/useCountry.js';
import { usePaises } from '../../hooks/usePaises.ts';
import { CONTACT_PURPOSES } from '../../utils/constants.js';

const initialForm = {
  pais_id: '',
  nombre: '',
  correo: '',
  telefono: '',
  finalidad: '',
  mensaje: '',
};

export function LatamContactSection() {
  const { activeCountry } = useCountry();
  const primaryColor = activeCountry?.colors?.[0] || '#7A0A83';
  const { paises, loading: loadingPaises, error: paisesError } = usePaises();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (activeCountry?.id) {
      setForm((current) => ({ ...current, pais_id: current.pais_id || activeCountry.id }));
    }
  }, [activeCountry?.id]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const validate = () => {
    const nextErrors = {};
    if (!form.nombre.trim()) nextErrors.nombre = 'El nombre es obligatorio.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) nextErrors.correo = 'Ingresa un correo valido.';
    if (!form.telefono.trim()) nextErrors.telefono = 'El telefono es obligatorio.';
    if (!form.finalidad) nextErrors.finalidad = 'Selecciona una finalidad.';
    if (!form.pais_id) nextErrors.pais_id = 'Selecciona un pais.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    setStatus('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      await solicitudesApi.createPublic({ ...form, pais_id: form.pais_id });
      setStatus('Solicitud enviada correctamente.');
      setForm({ ...initialForm, pais_id: activeCountry?.id || '' });
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-4 bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-900 uppercase tracking-wide">
          CONTÁCTANOS
          <div className="h-1 w-24 mx-auto mt-4 rounded-full" style={{ backgroundColor: primaryColor }} />
        </h2>
        
        <p className="text-center text-gray-600 mb-12 text-lg">
          Pronto uno de nuestros gerentes regionales se pondrá en contacto contigo.
        </p>

        <form onSubmit={submit} className="bg-gray-50 p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nombre *</label>
              <input 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:border-transparent outline-none transition-all"
                style={{ focusRingColor: primaryColor }}
                value={form.nombre} 
                onChange={(e) => update('nombre', e.target.value)} 
              />
              {errors.nombre && <small className="text-red-500 mt-1 block">{errors.nombre}</small>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Teléfono *</label>
              <input 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:border-transparent outline-none transition-all"
                value={form.telefono} 
                onChange={(e) => update('telefono', e.target.value)} 
              />
              {errors.telefono && <small className="text-red-500 mt-1 block">{errors.telefono}</small>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Correo electrónico *</label>
              <input 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:border-transparent outline-none transition-all"
                value={form.correo} 
                onChange={(e) => update('correo', e.target.value)} 
              />
              {errors.correo && <small className="text-red-500 mt-1 block">{errors.correo}</small>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">País *</label>
              <select 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:border-transparent outline-none transition-all bg-white"
                value={form.pais_id} 
                onChange={(e) => update('pais_id', e.target.value)} 
                disabled={loadingPaises}
              >
                <option value="">{loadingPaises ? 'Cargando países...' : 'Seleccionar país'}</option>
                {paises.map((country) => <option key={country.id} value={country.id}>{country.nombre}</option>)}
              </select>
              {errors.pais_id && <small className="text-red-500 mt-1 block">{errors.pais_id}</small>}
              {paisesError && <small className="text-red-500 mt-1 block">{paisesError}</small>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">¿En qué podemos ayudarte? *</label>
              <select 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:border-transparent outline-none transition-all bg-white"
                value={form.finalidad} 
                onChange={(e) => update('finalidad', e.target.value)}
              >
                <option value="">Seleccionar opción</option>
                {CONTACT_PURPOSES.map((purpose) => <option key={purpose} value={purpose}>{purpose}</option>)}
              </select>
              {errors.finalidad && <small className="text-red-500 mt-1 block">{errors.finalidad}</small>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Mensaje</label>
              <textarea 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:border-transparent outline-none transition-all resize-none"
                value={form.mensaje} 
                onChange={(e) => update('mensaje', e.target.value)} 
                rows="4" 
              />
            </div>
          </div>

          {status && (
            <div className={`mt-6 p-4 rounded-lg font-medium text-sm ${status.includes('correctamente') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {status}
            </div>
          )}

          <div className="mt-8 text-center">
            <button 
              type="submit"
              className="px-10 py-4 rounded-full text-white font-bold uppercase tracking-wider text-sm shadow-md hover:shadow-lg transition-all w-full md:w-auto"
              style={{ backgroundColor: primaryColor }}
              disabled={submitting}
            >
              {submitting ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
