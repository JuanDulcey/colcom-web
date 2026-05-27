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

type FormState = typeof initialForm;
type FormErrors = Partial<Record<keyof FormState, string>>;

export function LatamContactSection() {
  const { activeCountry } = useCountry();
  const { paises, loading: loadingPaises, error: paisesError } = usePaises();

  const colors = {
    coral: '#FF725E',
    pink: '#E83E75',
    purple: '#7B2CBF',
    blue: '#12A8E8',
    dark: '#111827',
  };

  const primaryColor = activeCountry?.colors?.[0] || colors.pink;

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (activeCountry?.id) {
      setForm((current) => ({
        ...current,
        pais_id: current.pais_id || activeCountry.id,
      }));
    }
  }, [activeCountry?.id]);

  const update = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!form.nombre.trim()) nextErrors.nombre = 'El nombre es obligatorio.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
      nextErrors.correo = 'Ingresa un correo válido.';
    }
    if (!form.telefono.trim()) nextErrors.telefono = 'El teléfono es obligatorio.';
    if (!form.finalidad) nextErrors.finalidad = 'Selecciona una finalidad.';
    if (!form.pais_id) nextErrors.pais_id = 'Selecciona un país.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');

    if (!validate()) return;

    setSubmitting(true);

    try {
      await solicitudesApi.createPublic({ ...form, pais_id: form.pais_id });
      setStatus('Solicitud enviada correctamente.');
      setForm({ ...initialForm, pais_id: activeCountry?.id || '' });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'No se pudo enviar la solicitud.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="relative py-24 px-4 overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 8% 18%, ${colors.coral}22 0%, transparent 30%),
          radial-gradient(circle at 90% 20%, ${colors.blue}22 0%, transparent 28%),
          linear-gradient(135deg, #ffffff 0%, #fff8f7 42%, #f7fbff 100%)
        `,
        '--contact-color': primaryColor,
      } as React.CSSProperties}
    >
      <style>
        {`
          .latam-contact-field:focus {
            border-color: var(--contact-color);
            box-shadow: 0 0 0 4px color-mix(in srgb, var(--contact-color) 16%, transparent);
          }
        `}
      </style>

      <div className="absolute -top-28 -left-24 w-80 h-80 rounded-full blur-3xl opacity-20" style={{ backgroundColor: colors.pink }} />
      <div className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ backgroundColor: colors.blue }} />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span
            className="inline-flex items-center px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-[0.18em] text-white mb-5"
            style={{
              background: `linear-gradient(90deg, ${colors.coral}, ${colors.pink}, ${colors.purple}, ${colors.blue})`,
            }}
          >
            Hablemos
          </span>

          <h2 className="text-3xl md:text-4xl font-black text-gray-950 uppercase tracking-wide mb-5">
            Contáctanos
          </h2>

          <div
            className="h-1.5 w-28 mx-auto rounded-full mb-6"
            style={{
              background: `linear-gradient(90deg, ${colors.coral}, ${colors.pink}, ${colors.blue})`,
            }}
          />

          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            Pronto uno de nuestros gerentes regionales se pondrá en contacto contigo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.4fr] gap-8 items-stretch">
          <aside
            className="relative overflow-hidden rounded-[2rem] p-8 md:p-10 text-white shadow-[0_24px_70px_rgba(15,23,42,0.16)]"
            style={{
              background: `linear-gradient(135deg, ${colors.purple} 0%, ${colors.pink} 55%, ${colors.coral} 100%)`,
            }}
          >
            <div className="absolute -top-20 -right-16 w-56 h-56 bg-white/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-16 w-64 h-64 bg-black/15 rounded-full blur-3xl" />

            <div className="relative z-10 h-full flex flex-col justify-between gap-10">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/75 mb-5">
                  Latinoamérica Comparte
                </p>

                <h3 className="text-3xl md:text-4xl font-black leading-tight mb-5">
                  Queremos conocer tu propósito.
                </h3>

                <p className="text-white/82 leading-relaxed">
                  Completa el formulario y cuéntanos cómo podemos acompañarte desde nuestra red de bienestar,
                  productividad y transformación.
                </p>
              </div>

              <div className="grid gap-3">
                <div className="rounded-2xl bg-white/12 border border-white/15 px-5 py-4 backdrop-blur">
                  <p className="text-sm font-bold">Respuesta regional</p>
                  <p className="text-sm text-white/75 mt-1">Tu solicitud será revisada por el equipo correspondiente.</p>
                </div>

                <div className="rounded-2xl bg-white/12 border border-white/15 px-5 py-4 backdrop-blur">
                  <p className="text-sm font-bold">Acompañamiento cercano</p>
                  <p className="text-sm text-white/75 mt-1">Te contactaremos según el país y la finalidad seleccionada.</p>
                </div>
              </div>
            </div>
          </aside>

          <form
            onSubmit={submit}
            className="bg-white/90 backdrop-blur rounded-[2rem] p-6 md:p-9 shadow-[0_24px_70px_rgba(15,23,42,0.10)] border border-white"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-extrabold text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  className="latam-contact-field w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50/80 outline-none transition-all text-gray-800"
                  value={form.nombre}
                  onChange={(e) => update('nombre', e.target.value)}
                  placeholder="Tu nombre"
                />
                {errors.nombre && <small className="text-red-500 mt-1.5 block font-medium">{errors.nombre}</small>}
              </div>

              <div>
                <label className="block text-sm font-extrabold text-gray-700 mb-2">
                  Teléfono *
                </label>
                <input
                  className="latam-contact-field w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50/80 outline-none transition-all text-gray-800"
                  value={form.telefono}
                  onChange={(e) => update('telefono', e.target.value)}
                  placeholder="Tu teléfono"
                />
                {errors.telefono && <small className="text-red-500 mt-1.5 block font-medium">{errors.telefono}</small>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-extrabold text-gray-700 mb-2">
                  Correo electrónico *
                </label>
                <input
                  className="latam-contact-field w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50/80 outline-none transition-all text-gray-800"
                  value={form.correo}
                  onChange={(e) => update('correo', e.target.value)}
                  placeholder="correo@ejemplo.com"
                />
                {errors.correo && <small className="text-red-500 mt-1.5 block font-medium">{errors.correo}</small>}
              </div>

              <div>
                <label className="block text-sm font-extrabold text-gray-700 mb-2">
                  País *
                </label>
                <select
                  className="latam-contact-field w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50/80 outline-none transition-all text-gray-800"
                  value={form.pais_id}
                  onChange={(e) => update('pais_id', e.target.value)}
                  disabled={loadingPaises}
                >
                  <option value="">{loadingPaises ? 'Cargando países...' : 'Seleccionar país'}</option>
                  {paises.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.nombre}
                    </option>
                  ))}
                </select>
                {errors.pais_id && <small className="text-red-500 mt-1.5 block font-medium">{errors.pais_id}</small>}
                {paisesError && <small className="text-red-500 mt-1.5 block font-medium">{paisesError}</small>}
              </div>

              <div>
                <label className="block text-sm font-extrabold text-gray-700 mb-2">
                  ¿En qué podemos ayudarte? *
                </label>
                <select
                  className="latam-contact-field w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50/80 outline-none transition-all text-gray-800"
                  value={form.finalidad}
                  onChange={(e) => update('finalidad', e.target.value)}
                >
                  <option value="">Seleccionar opción</option>
                  {CONTACT_PURPOSES.map((purpose) => (
                    <option key={purpose} value={purpose}>
                      {purpose}
                    </option>
                  ))}
                </select>
                {errors.finalidad && <small className="text-red-500 mt-1.5 block font-medium">{errors.finalidad}</small>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-extrabold text-gray-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  className="latam-contact-field w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50/80 outline-none transition-all resize-none text-gray-800"
                  value={form.mensaje}
                  onChange={(e) => update('mensaje', e.target.value)}
                  rows={4}
                  placeholder="Cuéntanos brevemente cómo podemos ayudarte"
                />
              </div>
            </div>

            {status && (
              <div
                className={`mt-6 p-4 rounded-2xl font-bold text-sm ${
                  status.includes('correctamente')
                    ? 'bg-green-50 text-green-700 border border-green-100'
                    : 'bg-red-50 text-red-700 border border-red-100'
                }`}
              >
                {status}
              </div>
            )}

            <div className="mt-8">
              <button
                type="submit"
                className="w-full md:w-auto px-10 py-4 rounded-full text-white font-black uppercase tracking-wider text-sm shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                style={{
                  background: `linear-gradient(90deg, ${colors.pink}, ${colors.purple}, ${colors.blue})`,
                }}
                disabled={submitting}
              >
                {submitting ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}