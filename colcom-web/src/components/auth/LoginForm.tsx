import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.ts';

export function LoginForm() {
  const auth = useAuth();
  const [username, setUsername] = useState('admin_argentina');
  const [password, setPassword] = useState('admin123*');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    await auth.login(username, password);
    history.pushState({}, '', '/admin');
    window.dispatchEvent(new Event('colcom:navigate'));
  };

  return (
    <form className="auth-panel" onSubmit={submit}>
      <span className="chip">JWT + Roles</span>
      <h1>Acceso Colcom</h1>
      <label>Usuario<input value={username} onChange={(e) => setUsername(e.target.value)} /></label>
      <label>Contrasena<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      {auth.error && <div className="alert error">{auth.error}</div>}
      <button className="primary-action" disabled={auth.loading}>{auth.loading ? 'Entrando...' : 'Entrar'}</button>
    </form>
  );
}
