import { useState } from 'react';
import { useUsuarios } from '../../hooks/useUsuarios.ts';
import { useAuth } from '../../hooks/useAuth.js';
import { EmptyState, ErrorState, LoadingState } from '../../components/common/AsyncState.jsx';
import { StatusBadge } from '../../components/common/StatusBadge.jsx';
import { ConfirmButton } from '../../components/common/ConfirmButton.jsx';

const initial = {
  nombre: '',
  apellido: '',
  email: '',
  username: '',
  password: '',
  rol: 'editor',
  pais_id: '',
  estado: 'activo',
};

export function UsersPage() {
  const { user } = useAuth();
  const usuarios = useUsuarios();
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState('');

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      await usuarios.create({ ...form, pais_id: form.rol === 'superadmin' ? null : form.pais_id });
      setForm(initial);
      await usuarios.refresh();
      setMessage('Usuario creado.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (user?.rol !== 'superadmin') {
    return <main className="admin-content"><div className="empty-state"><h1>Acceso restringido</h1><p>Solo superadmin administra usuarios.</p></div></main>;
  }

  return (
    <main className="admin-content">
      <div className="admin-heading">
        <div><p className="eyebrow">Seguridad</p><h1>Usuarios</h1></div>
      </div>
      <form className="form-panel wide-form" onSubmit={submit}>
        <div className="detail-grid">
          <label>Nombre<input value={form.nombre} onChange={(e) => update('nombre', e.target.value)} /></label>
          <label>Apellido<input value={form.apellido} onChange={(e) => update('apellido', e.target.value)} /></label>
          <label>Email<input value={form.email} onChange={(e) => update('email', e.target.value)} /></label>
          <label>Username<input value={form.username} onChange={(e) => update('username', e.target.value)} required /></label>
          <label>Password<input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} required /></label>
          <label>Rol<select value={form.rol} onChange={(e) => update('rol', e.target.value)}>
            <option value="editor">editor</option>
            <option value="admin_pais">admin_pais</option>
            <option value="superadmin">superadmin</option>
          </select></label>
          {form.rol !== 'superadmin' && <label>Pais ID<input value={form.pais_id} onChange={(e) => update('pais_id', e.target.value)} placeholder="UUID del pais" /></label>}
        </div>
        <button className="btn btn-primary">Crear usuario</button>
        {message && <div className={message.includes('creado') ? 'alert success' : 'alert error'}>{message}</div>}
      </form>
      <ErrorState message={usuarios.error} />
      {usuarios.loading ? <LoadingState /> : usuarios.items.length === 0 ? <EmptyState /> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Usuario</th><th>Email</th><th>Rol</th><th>Pais</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>
              {usuarios.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.username}</td>
                  <td>{item.email}</td>
                  <td>{item.rol}</td>
                  <td>{item.pais_id || 'Global'}</td>
                  <td><StatusBadge value={item.estado} /></td>
                  <td><ConfirmButton message="Desactivar usuario?" onConfirm={() => usuarios.remove(item.id).then(usuarios.refresh)}>Desactivar</ConfirmButton></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
