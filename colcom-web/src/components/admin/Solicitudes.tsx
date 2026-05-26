import { useSolicitudes } from '../../hooks/useSolicitudes';
import { ContentCard } from '../ui/Cards';
import { Listados } from '../ui/Listados';

export function Solicitudes() {
  const solicitudes = useSolicitudes();
  return (
    <Listados
      {...solicitudes}
      renderItem={(item) => (
        <ContentCard key={item.id} title={item.nombre} meta={item.estado}>
          <p>{item.correo}</p>
          <p>{item.mensaje}</p>
          <button onClick={() => solicitudes.updateEstado(item.id, 'respondido').then(solicitudes.refresh)}>
            Marcar respondida
          </button>
        </ContentCard>
      )}
    />
  );
}
