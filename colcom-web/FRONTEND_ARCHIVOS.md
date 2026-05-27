# Guía Frontend — Consumo de `/api/archivos`

> **Estado:** El bucket `archivos` en Supabase sigue siendo **privado**.
> Para que las imágenes/PDFs se puedan abrir desde el frontend, el backend ahora
> reescribe el campo `url` con una **URL firmada (signed URL)** fresca cada vez
> que se consulta el archivo. **No necesitas cambiar nada** en tu código actual:
> sigue usando `archivo.url` en `<img>`, `<a>` o como te convenga.

---

## 1. ¿Qué cambió en backend?

Antes:

```
GET /api/archivos/:id
→ { url: "https://<proyecto>.supabase.co/storage/v1/object/public/archivos/..." }   ❌ 404
```

Ahora:

```
GET /api/archivos/:id
→ { url: "https://<proyecto>.supabase.co/storage/v1/object/sign/archivos/...?token=..." }   ✅ 200
```

Cada vez que el backend te devuelve un archivo (desde `GET /archivos`,
`GET /archivos/:id`, `POST /archivos/upload`, etc.), la propiedad `url` viene
**firmada** y lista para usarse directamente. La firma es válida durante
**3600 segundos (1 hora)** por defecto.

> El TTL es configurable en backend con `SIGNED_URL_TTL_SECONDS`.

---

## 2. Uso recomendado (caso 95%)

No cambies nada. Por ejemplo, si tu card hace:

```tsx
<img src={archivo.url} alt={archivo.nombre_archivo} />
<a href={archivo.url} target="_blank" rel="noopener">Descargar</a>
```

…sigue funcionando. La URL ya viene firmada.

### Refrescar antes de que expire

Si tu UI mantiene la lista cargada **más de 1 hora** sin volver a llamar al
backend (poco común, pero pasa con SPAs muy estáticas), el `?token=...` puede
expirar. Dos opciones:

1. **Refetch periódico** del listado (recomendado): `GET /archivos` cada vez
   que entres a la pantalla. Las URLs vuelven firmadas frescas.
2. **Pedir una URL firmada explícita** justo antes de mostrar el archivo
   (ver sección 3).

---

## 3. Endpoint dedicado: `GET /api/archivos/:id/signed-url`

Útil si necesitas una URL firmada **a demanda** (por ejemplo, justo antes de
abrir un PDF en una pestaña nueva), o si quieres un TTL distinto al default.

### Request

```http
GET /api/archivos/{id}/signed-url
GET /api/archivos/{id}/signed-url?expires_in=600
Authorization: Bearer <JWT>
```

| Query        | Tipo   | Default | Notas                                  |
|--------------|--------|---------|----------------------------------------|
| `expires_in` | number | 3600    | Segundos. Mínimo 1. Solo positivos.    |

### Response 200

```json
{
  "ok": true,
  "data": {
    "url": "https://pbdwphfortpwlkrzyrpc.supabase.co/storage/v1/object/sign/archivos/general/sin-referencia/1716000000-foto.jpg?token=eyJ...",
    "expires_in": 3600,
    "archivo_id": "9c5d...e0",
    "nombre_archivo": "foto.jpg"
  }
}
```

### Errores comunes

| Status | `message`                                                | Causa                                                       |
|--------|----------------------------------------------------------|-------------------------------------------------------------|
| 401    | `Unauthorized`                                           | Falta JWT o expiró.                                         |
| 403    | `Acceso denegado`                                        | Rol distinto a `superadmin`, `admin_pais` o `editor`.       |
| 404    | `Archivo no encontrado`                                  | ID inexistente.                                             |
| 400    | `Este archivo es una URL manual, no tiene path en Storage` | El registro fue creado con `POST /archivos` (URL externa), no con `/upload`. Usa `archivo.url` tal cual. |

---

## 4. Ejemplos prácticos

### React + axios

```tsx
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { Authorization: `Bearer ${token}` },
});

// 4.1 — Listado (URL ya firmada)
const { data } = await api.get('/archivos?page=1&limit=20');
// data.data → ArchivoRow[] con `url` firmado
// data.pagination → { total, page, limit, totalPages }

// 4.2 — Click "Descargar" pidiendo URL fresca
async function descargar(archivoId: string) {
  const { data } = await api.get(`/archivos/${archivoId}/signed-url`);
  window.open(data.data.url, '_blank');
}
```

### Render directo en `<img>`

```tsx
function CardArchivo({ archivo }: { archivo: Archivo }) {
  return (
    <article>
      <img src={archivo.url} alt={archivo.nombre_archivo} loading="lazy" />
      <a href={archivo.url} download={archivo.nombre_archivo}>
        Descargar
      </a>
    </article>
  );
}
```

### Fetch nativo

```ts
const res = await fetch('/api/archivos/abc-123/signed-url', {
  headers: { Authorization: `Bearer ${token}` },
});
const { data } = await res.json();
window.location.href = data.url;
```

---

## 5. Subida (`POST /api/archivos/upload`)

Sin cambios respecto a antes. El response sigue trayendo el archivo recién
creado, ahora con `url` firmado:

```http
POST /api/archivos/upload
Authorization: Bearer <JWT>
Content-Type: multipart/form-data

file=<binario>
modulo=noticias            (opcional, default "general")
referencia_id=abc-123      (opcional)
bucket=archivos            (opcional)
```

Respuesta:

```json
{
  "ok": true,
  "data": {
    "id": "9c5d...e0",
    "nombre_archivo": "foto.jpg",
    "url": "https://...supabase.co/storage/v1/object/sign/archivos/...?token=...",
    "tipo_archivo": "image/jpeg",
    "modulo": "general",
    "referencia_id": null,
    "subido_por": "u-001",
    "bucket": "archivos",
    "storage_path": "general/sin-referencia/1716000000-foto.jpg",
    "created_at": "2026-05-27T12:00:00Z",
    "updated_at": "2026-05-27T12:00:00Z",
    "subido_por_username": "admin_argentina"
  }
}
```

---

## 6. FAQ

**¿Necesito guardar la URL en mi estado / localStorage?**
No conviene. Las URLs firmadas expiran. Guarda el `id` del archivo y vuelve a
pedir `/archivos/:id` o `/archivos/:id/signed-url` cuando la necesites.

**¿Las URLs viejas en BD siguen ahí?**
Sí, pero el backend las **sobrescribe** con una URL firmada antes de
respondertelas. No las veas en BD, ya no representan la realidad runtime.

**¿Qué pasa con archivos registrados con `POST /archivos` (URL manual)?**
Esos tienen `bucket` y `storage_path` en `null`. El backend **no toca su
`url`** — se devuelve tal cual la registraste. `signed-url` no aplica.

**¿Funciona con `<img>` aunque sea un bucket privado?**
Sí: la URL firmada lleva el token en el query string, no requiere headers.
Por eso `<img src>`, `<a href>` y `window.open(...)` funcionan sin más.

**¿El token de la URL firmada incluye autenticación del usuario?**
No es un JWT de la API; es un token de Storage emitido por Supabase. Cualquiera
con esa URL puede acceder mientras no expire — trata las URLs como semi-secretas
(no las pegues en logs públicos, no las compartas en email sin contexto).

---

## 7. Resumen para el equipo

- **Cero cambios** en componentes que ya usan `archivo.url`.
- Si quieres URL fresca a demanda: `GET /api/archivos/:id/signed-url`.
- TTL default: 1 hora. Refresca llamando al endpoint otra vez.
- Bucket sigue privado: la seguridad la garantiza el JWT en backend + el
  token efímero en la URL.
