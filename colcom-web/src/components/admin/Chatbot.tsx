import { useState } from 'react';
import { apiRequest } from '../../lib/api';

export function Chatbot() {
  const [message, setMessage] = useState('');
  const [country, setCountry] = useState('argentina');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const consult = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await apiRequest<{ answer?: string; message?: string; respuesta?: string }>('/chatbot/consultar', {
        method: 'POST',
        body: { message, country },
      });
      setAnswer(res.data.answer || res.data.respuesta || res.data.message || 'Respuesta recibida.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="chatbot-panel" onSubmit={consult}>
      <h2>Chatbot Colcom</h2>
      <select value={country} onChange={(e) => setCountry(e.target.value)}>
        <option value="argentina">Argentina</option>
        <option value="chile">Chile</option>
      </select>
      <textarea maxLength={500} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Pregunta al asistente..." />
      <button className="primary-action" disabled={loading || !message}>{loading ? 'Consultando...' : 'Consultar'}</button>
      {answer && <output>{answer}</output>}
    </form>
  );
}
