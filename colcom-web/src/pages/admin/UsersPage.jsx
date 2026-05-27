import { useState } from 'react';
import { useUsuarios } from '../../hooks/useUsuarios.ts';
import { useAuth } from '../../hooks/useAuth.js';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/AsyncState.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { ConfirmButton } from '../../components/common/ConfirmButton.jsx';
import { motion } from 'framer-motion';
import { useCountry } from '../../hooks/useCountry.js';

const initial = {
  nombre: '',
  apellido: '',
  email: '',
  username: '',
  password: '',
  rol: 'editor',
  pais_id: '',
  estado: 'activo',
  pregunta_seguridad: '',
  respuesta_seguridad: '',
};

export function UsersPage() {
  const { user } = useAuth();
  const { countries } = useCountry();
  const usuarios = useUsuarios();
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState('');

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      const { pregunta_seguridad, respuesta_seguridad, ...validPayload } = form;
      await usuarios.create({ ...validPayload, pais_id: form.rol === 'superadmin' ? null : form.pais_id });
      setForm(initial);
      await usuarios.refresh();
      setMessage('Usuario creado.');
    } catch (error) {
      const errorMsg = error.errors ? error.errors.join(', ') : error.message;
      setMessage(errorMsg);
    }
  };

  if (user?.rol !== 'superadmin') {
    return (
      <main className="flex items-center justify-center h-full">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100 text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso restringido</h1>
          <p className="text-gray-500">Solo el superadministrador puede gestionar los usuarios del sistema.</p>
        </div>
      </main>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#7A0A83] tracking-wide uppercase mb-1">Seguridad</p>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Gestión de Usuarios</h1>
        </div>
      </div>

      {/* Formulario de creación */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#7A0A83]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          Crear Nuevo Usuario
        </h2>
        <form onSubmit={submit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
              <input className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#7A0A83]/50 focus:border-[#7A0A83] outline-none transition-all" value={form.nombre} onChange={(e) => update('nombre', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Apellido</label>
              <input className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#7A0A83]/50 focus:border-[#7A0A83] outline-none transition-all" value={form.apellido} onChange={(e) => update('apellido', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input type="email" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#7A0A83]/50 focus:border-[#7A0A83] outline-none transition-all" value={form.email} onChange={(e) => update('email', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username <span className="text-red-500">*</span></label>
              <input className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#7A0A83]/50 focus:border-[#7A0A83] outline-none transition-all" value={form.username} onChange={(e) => update('username', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password <span className="text-red-500">*</span></label>
              <input type="password" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#7A0A83]/50 focus:border-[#7A0A83] outline-none transition-all" value={form.password} onChange={(e) => update('password', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Rol</label>
              <select className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#7A0A83]/50 focus:border-[#7A0A83] outline-none transition-all" value={form.rol} onChange={(e) => update('rol', e.target.value)}>
                <option value="editor">Editor</option>
                <option value="admin_pais">Admin País</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>
            {form.rol !== 'superadmin' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">País asignado</label>
                <select className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#7A0A83]/50 focus:border-[#7A0A83] outline-none transition-all" value={form.pais_id} onChange={(e) => update('pais_id', e.target.value)}>
                  <option value="">Selecciona un país</option>
                  {countries.filter(c => c.slug !== 'latam').map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Pregunta de Seguridad</label>
              <input className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#7A0A83]/50 focus:border-[#7A0A83] outline-none transition-all" value={form.pregunta_seguridad} onChange={(e) => update('pregunta_seguridad', e.target.value)} placeholder="Ej: Nombre de tu primera mascota" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Respuesta de Seguridad</label>
              <input className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#7A0A83]/50 focus:border-[#7A0A83] outline-none transition-all" value={form.respuesta_seguridad} onChange={(e) => update('respuesta_seguridad', e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <button type="submit" className="px-8 py-3 bg-[#7A0A83] text-white font-bold rounded-xl shadow-lg shadow-[#7A0A83]/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
              Crear Usuario
            </button>
            {message && (
              <span className={`text-sm font-semibold px-4 py-2 rounded-lg ${message.includes('creado') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message}
              </span>
            )}
          </div>
        </form>
      </motion.div>

      <ErrorState message={usuarios.error} />
      
      {usuarios.loading ? <LoadingState /> : usuarios.items.length === 0 ? <EmptyState /> : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 font-semibold">
                  <th className="py-4 px-6 whitespace-nowrap">Usuario</th>
                  <th className="py-4 px-6 whitespace-nowrap">Email</th>
                  <th className="py-4 px-6 whitespace-nowrap">Rol</th>
                  <th className="py-4 px-6 whitespace-nowrap">País</th>
                  <th className="py-4 px-6 whitespace-nowrap">Estado</th>
                  <th className="py-4 px-6 whitespace-nowrap text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {usuarios.items.map((item, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={item.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#7A0A83]/10 text-[#7A0A83] flex items-center justify-center font-bold text-xs uppercase">
                          {item.username.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{item.username}</p>
                          <p className="text-xs text-gray-500">{item.nombre} {item.apellido}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{item.email}</td>
                    <td className="py-4 px-6 text-gray-600">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                        item.rol === 'superadmin' ? 'bg-purple-100 text-purple-700' :
                        item.rol === 'admin_pais' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {item.rol}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500 text-sm font-medium">
                      {item.pais_id 
                        ? (countries.find(c => c.id === item.pais_id)?.nombre || item.pais_id)
                        : 'Global'}
                    </td>
                    <td className="py-4 px-6"><StatusBadge value={item.estado} /></td>
                    <td className="py-4 px-6 text-right">
                      <ConfirmButton 
                        message="¿Desactivar usuario?" 
                        onConfirm={() => usuarios.remove(item.id).then(usuarios.refresh)}
                        className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        Desactivar
                      </ConfirmButton>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
