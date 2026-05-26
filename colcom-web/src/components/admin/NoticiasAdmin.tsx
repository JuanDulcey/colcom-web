import { canDelete } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth.ts';
import { useNoticias } from '../../hooks/useNoticias';
import { ContentCard } from '../ui/Cards';
import { Listados } from '../ui/Listados';

export function NoticiasAdmin() {
  const { role } = useAuth();
  const noticias = useNoticias();

  return (
    <Listados
      {...noticias}
      renderItem={(item) => (
        <ContentCard key={item.id} title={item.titulo} meta={item.estado}>
          <p>{item.resumen || 'Sin resumen'}</p>
          <div className="actions">
            <button onClick={() => noticias.updateEstado(item.id, item.estado === 'publicado' ? 'despublicado' : 'publicado')}>
              {item.estado === 'publicado' ? 'Despublicar' : 'Publicar'}
            </button>
            {canDelete(role) && <button className="danger" onClick={() => noticias.remove(item.id).then(noticias.refresh)}>Borrar</button>}
          </div>
        </ContentCard>
      )}
    />
  );
}
