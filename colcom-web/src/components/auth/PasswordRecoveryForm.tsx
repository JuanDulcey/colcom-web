import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.ts';

export function PasswordRecoveryForm() {
  const auth = useAuth();
  const [username, setUsername] = useState('');
  const [question, setQuestion] = useState('');
  const [respuesta_seguridad, setAnswer] = useState('');
  const [new_password, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const askQuestion = async () => {
    const res = await auth.getSecurityQuestion(username);
    setQuestion(res.data.pregunta_seguridad);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    await auth.forgotPassword({ username, respuesta_seguridad, new_password });
    setMessage('Password actualizado. Ya puedes iniciar sesion.');
  };

  return (
    <form className="stack-panel" onSubmit={submit}>
      <h2>Recuperar password</h2>
      <label>Usuario<input value={username} onChange={(e) => setUsername(e.target.value)} /></label>
      <button type="button" onClick={askQuestion}>Consultar pregunta</button>
      {question && <p className="glow-text">{question}</p>}
      <label>Respuesta<input value={respuesta_seguridad} onChange={(e) => setAnswer(e.target.value)} /></label>
      <label>Nuevo password<input type="password" value={new_password} onChange={(e) => setNewPassword(e.target.value)} /></label>
      <button className="primary-action">Cambiar password</button>
      {message && <div className="alert success">{message}</div>}
    </form>
  );
}
