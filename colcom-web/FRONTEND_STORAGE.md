# Imágenes y archivos: cómo cargarlos desde el frontend

> Guía para el frontend sobre cómo funcionan las imágenes/archivos de este backend.

## TL;DR

- Los buckets ya existen y están bien configurados. **No hay nada que crear en Supabase**.
- Las URLs que devuelve el backend para **noticias** y **testimonios** son **públicas y directas** — se pueden meter tal cual en un `<img src="...">`.
- Las URLs del módulo **archivos** son **privadas**: NO se pueden mostrar directo en un `<img>`. Hay que pedir una *signed URL* o descargarlas con `Authorization: Bearer <token>`.
- Si una imagen "no carga", el bucket casi nunca es el culpable — revisa primero el campo correcto del JSON y que la URL no esté vacía.

---

## Cómo está montado

El backend usa **Supabase Storage** (no guarda los archivos localmente). Hay 3 buckets, cada uno para un caso de uso:

| Bucket | Visibilidad | Para qué se usa | Campo donde llega la URL al front |
|---|---|---|---|
| `noticias` | **Pública** | imagen principal de cada noticia | `noticias.imagen_principal_url` |
| `testimonios` | **Pública** | foto del autor del testimonio | `testimonios.foto_url` |
| `archivos` | **Privada** | documentos genéricos subidos en el módulo `archivos` | `archivos.url` (pero no carga directo) |

URL base del proyecto Supabase: `https://pbdwphfortpwlkrzyrpc.supabase.co`

Las URLs públicas tienen la forma:

```
https://pbdwphfortpwlkrzyrpc.supabase.co/storage/v1/object/public/<bucket>/<path>
```

Ejemplo real (imagen de noticia):

```
https://pbdwphfortpwlkrzyrpc.supabase.co/storage/v1/object/public/noticias/argentina/abc-123-id/1712345678-foto_perro.jpg
```

Esa URL la genera el backend y la guarda en BD. **El frontend no construye URLs**, solo las consume.

---

## Caso 1: imágenes de noticias

### Subir imagen al crear/editar una noticia

- **Método y ruta:** `POST /api/noticias/:id/imagen`
- **Headers:** `Authorization: Bearer <accessToken>`
- **Content-Type:** `multipart/form-data`
- **Campo del form:** `file` (tiene que ser una imagen, mimetype `image/*`)

**Respuesta 200:**

```json
{
  "ok": true,
  "data": {
    "id": "noticia-id-uuid",
    "titulo": "...",
    "imagen_principal_url": "https://pbdwphfortpwlkrzyrpc.supabase.co/storage/v1/object/public/noticias/argentina/noticia-id-uuid/1712345678-foto.jpg",
    "...": "..."
  }
}
```

### Mostrarla

```html
<img :src="noticia.imagen_principal_url" alt="..." />
```

Si `imagen_principal_url` viene `null` → esa noticia todavía no tiene imagen subida.

---

## Caso 2: fotos de testimonios

Mismo patrón que noticias.

### Subir

- **Método y ruta:** `POST /api/testimonios/:id/foto`
- **Headers:** `Authorization: Bearer <accessToken>`
- **Content-Type:** `multipart/form-data`
- **Campo del form:** `file`

### Mostrar

```html
<img :src="testimonio.foto_url" alt="..." />
```

---

## Caso 3: archivos privados (módulo `archivos`)

Acá está la trampa común. El bucket `archivos` es **privado a propósito** porque a veces son documentos sensibles (PDFs internos, evidencias, etc).

Cuando subes un archivo, el backend igual devuelve un campo `url`, pero **ese link NO va a cargar** si lo pones en un `<img>` o `<a>` desde el navegador — Supabase responde 400/Unauthorized.

### Cómo subir

- **Método y ruta:** `POST /api/archivos/upload` (o el endpoint correspondiente, consulta `/api`)
- **Headers:** `Authorization: Bearer <accessToken>`
- **Content-Type:** `multipart/form-data`
- **Campo del form:** `file`

### Cómo mostrar / descargar

**Opciones recomendadas (en orden de preferencia):**

1. **Pedir al backend que devuelva una signed URL** (URL firmada con expiración corta, ej. 10 min). Hoy ese endpoint **no existe** — si tu UX necesita mostrar archivos privados, pídele al backend que agregue `GET /api/archivos/:id/signed-url`.

2. **Descargarlo vía fetch con el token** y convertirlo a blob en el navegador:

```ts
const res = await fetch(`/api/archivos/${id}/download`, {
  headers: { Authorization: `Bearer ${token}` },
});
const blob = await res.blob();
const objectUrl = URL.createObjectURL(blob);
// usar objectUrl en <img> o <a download>
```

> Confirma con el backend si el endpoint `/api/archivos/:id/download` ya existe. Si no, también hay que pedirlo.

**NO hagas esto** (no funciona):

```html
<!-- Esto da 400 porque el bucket es privado -->
<img :src="archivo.url" />
```

---

## Troubleshooting

### "La imagen no carga / aparece rota"

Antes de pedirle al backend que toque Storage, verifica en este orden:

1. **¿Estás leyendo el campo correcto del JSON?**
   - Noticias: `imagen_principal_url` (no `imagen_url`).
   - Testimonios: `foto_url`.
   - Archivos: `url` (pero ojo: privado, ver Caso 3).

2. **¿La URL viene `null` o vacía?** → No hay imagen subida todavía. El front debe mostrar un placeholder, no romper.

3. **Pega la URL completa en el navegador en una pestaña incógnita.**
   - Si se ve la imagen → el bucket y el archivo están bien. El bug está en cómo el front la consume (CORS, CSP, atributo mal puesto, etc.).
   - Si te dice "Object not found" → el archivo no existe en el bucket. Puede ser que el upload haya fallado o que se haya borrado a mano. Pídele al backend re-subir.
   - Si te dice "401/400" → ese campo viene de un bucket privado. Sigue el Caso 3.

4. **CORS bloqueando la imagen en consola** → no se ve seguido porque las URLs públicas de Supabase ya permiten CORS, pero si pasa, es un problema de configuración del bucket que el backend puede ajustar.

### "Quiero ver una lista de imágenes de varios países / noticias"

Las URLs ya vienen incluidas en el JSON de listado (`GET /api/noticias`, `GET /api/testimonios`). No hay un endpoint separado para "listar imágenes" — la imagen es un campo del objeto principal.

---

## Resumen de endpoints relacionados

| Método | Ruta | Auth | Devuelve |
|---|---|---|---|
| `POST` | `/api/noticias/:id/imagen` | JWT | noticia con `imagen_principal_url` actualizada |
| `POST` | `/api/testimonios/:id/foto` | JWT | testimonio con `foto_url` actualizada |
| `POST` | `/api/archivos/upload` | JWT | metadata del archivo (URL privada, ver Caso 3) |
| `GET`  | `/api/noticias` | depende | listado con `imagen_principal_url` en cada item |
| `GET`  | `/api/testimonios` | depende | listado con `foto_url` en cada item |
