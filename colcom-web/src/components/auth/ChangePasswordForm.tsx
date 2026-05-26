import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.ts';

export function ChangePasswordForm() {
  const { changePassword } = useAuth();
  const [current_password, setCurrent] = useState('');
  const [new_password, setNext] = useState('');
  const [done, setDone] = useState(false);

  return (
    <form className="stack-panel" onSubmit={async (event) => {
      event.preventDefault();
      await changePassword({ current_password, new_password });
      setDone(true);
    }}>
      <h2>Cambiar mi password</h2>
      <label>Password actual<input type="password" value={current_password} onChange={(e) => setCurrent(e.target.value)} /></label>
      <label>Nuevo password<input type="password" value={new_password} onChange={(e) => setNext(e.target.value)} /></label>
      <button className="primary-action">Guardar</button>
      {done && <div className="alert success">Password actualizado</div>}
    </form>
  );
}
