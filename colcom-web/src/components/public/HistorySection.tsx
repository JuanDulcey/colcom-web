import React from 'react';
import { useCountry } from '../../hooks/useCountry';

export function HistorySection() {
  const { activeCountry } = useCountry();
  const primaryColor = activeCountry?.colors?.[0] || '#7A0A83';
  const secondaryColor = activeCountry?.colors?.[1] || '#4A90E2';

  return (
    <section className="py-24 px-4 bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 uppercase tracking-wide mb-12">
          NUESTRA HISTORIA
          <div className="h-1 w-24 mx-auto mt-4 rounded-full" style={{ backgroundColor: primaryColor }} />
        </h2>

        <div className="space-y-6 text-lg text-gray-700 leading-relaxed font-light">
          <p className="font-medium text-xl text-gray-900">
            Colombia Comparte nació de una historia real.
          </p>
          <p>
            Una historia de pérdida, fe y reconstrucción.
          </p>
          <p>
            Sus cofundadores, Carolina Ruiz Herrera y Eduardo Del Castillo, vivieron en carne propia lo que significa perderlo todo y aún así levantarse.
          </p>
          <p>
            Descubrieron algo poderoso: <span className="font-semibold text-gray-900">cuando una persona vuelve a sentirse productiva, vuelve a vivir.</span>
          </p>
          <p>
            Guiados por Dios y por un profundo deseo de servir, crearon una organización para acompañar a quienes enfrentan la llamada pobreza oculta: personas y familias que, a pesar de su esfuerzo, viven quiebres en su estabilidad emocional, económica y profesional.
          </p>
          <p>
            Durante 10 años, Colombia Comparte ha acompañado a miles de personas a reencontrar su propósito productivo y a reconstruir sus vidas desde el emprendimiento.
          </p>
          
          <div className="py-8 my-8 border-y border-gray-100">
            <p className="mb-4 font-medium text-gray-900">Hoy somos una organización social autosostenible que impulsa:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                Emprendimiento con propósito
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                Bienestar empresarial
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: secondaryColor }} />
                Cultura organizacional
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: secondaryColor }} />
                Liderazgo humano
              </li>
              <li className="flex items-center gap-3 md:col-span-2 md:justify-center">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                Productividad sostenible
              </li>
            </ul>
          </div>

          <div className="pt-4">
            <h3 className="text-2xl font-bold text-gray-900 leading-tight">
              Cuando una persona se transforma, <span style={{ color: primaryColor }}>su familia cambia.</span><br/>
              Y cuando las familias están bien, <span style={{ color: secondaryColor }}>las empresas prosperan.</span>
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
