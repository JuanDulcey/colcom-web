import { useState } from 'react';
import { useArchivos } from '../../hooks/useArchivos';

export function UploadArchivos() {
  const archivos = useArchivos();
  const [file, setFile] = useState<File | null>(null);
  const [modulo, setModulo] = useState('noticias');

  return (
    <section className="stack-panel">
      <h2>Archivos</h2>
      <input type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} />
      <label>Modulo<input value={modulo} onChange={(e) => setModulo(e.target.value)} /></label>
      <button disabled={!file} onClick={() => file && archivos.upload(file, { modulo }).then(archivos.refresh)}>
        Subir archivo
      </button>
      <div className="mini-list">
        {archivos.items.map((item) => <a key={item.id} href={item.url}>{item.nombre_archivo}</a>)}
      </div>
    </section>
  );
}
