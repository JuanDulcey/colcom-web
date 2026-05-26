export function Loader({ label = 'Conectando con Colcom...' }: { label?: string }) {
  return (
    <div className="loader-shell" role="status">
      <span className="loader-orbit" />
      <p>{label}</p>
      <small>Render puede tardar 30-60 s en la primera respuesta.</small>
    </div>
  );
}
