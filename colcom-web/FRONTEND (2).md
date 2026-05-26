# Guía Frontend — Colcom API

Documentación para consumir la API de Colcom desde un cliente frontend (React + fetch/axios). Cubre los 49 endpoints, el flujo de autenticación, el contrato de respuesta y ejemplos copy-paste.

---

## 1. Conexión

| Dato | Valor |
|---|---|
| Base URL (producción) | `https://colcom-api-web.onrender.com` |
| Prefijo global | `/api` |
| Health check | `GET https://colcom-api-web.onrender.com/api/health` |
| Swagger UI (si está habilitado) | `https://colcom-api-web.onrender.com/api/docs` |
| Auth | JWT (Bearer) — header `Authorization: Bearer <token>` |
| Content-Type para JSON | `application/json` |
| Content-Type para uploads | `multipart/form-data` (lo setea el browser automáticamente al usar `FormData`) |
| CORS | **Abierto** — cualquier origen puede consumir la API en este momento |

> **Cold start de Render (free tier)**: si la API estuvo inactiva la primera request puede tardar 30–60 s. Después responde normal. Maneja un timeout amplio en el primer fetch o muestra un loader inicial.

---

## 2. Envelope estándar

**Todas** las respuestas (éxito o error) llegan con el mismo envelope.

### Éxito (sin paginación)
```json
{ "ok": true, "data": { ... } }
```

### Éxito (con paginación, listados)
```json
{
  "ok": true,
  "data": [ { ... }, { ... } ],
  "pagination": { "page": 1, "limit": 20, "total": 35, "totalPages": 2 }
}
```

### Error
```json
{
  "ok": false,
  "statusCode": 401,
  "message": "Credenciales inválidas",
  "path": "/api/auth/login",
  "timestamp": "2026-05-14T10:00:00.000Z",
  "errors": ["password must be longer than 6 characters"]
}
```

- `errors[]` solo aparece en errores de validación (400) del DTO.
- `statusCode` sigue el estándar HTTP: 400, 401, 403, 404, 409, 500.

---

## 3. Roles disponibles

| Rol | Alcance |
|---|---|
| `público` (sin token) | crea solicitudes de contacto, lee portales públicos |
| `editor` | scope a su país; gestiona noticias/testimonios sin eliminar |
| `admin_pais` | scope a su país; CRUD completo de noticias/testimonios/solicitudes/archivos |
| `superadmin` | acceso global; único que administra usuarios |

El JWT contiene: `{ sub, username, rol, pais_id }`. `pais_id` es `null` para superadmin.

---

## 4. Credenciales de prueba (entorno desplegado)

| Username | Password | Rol | País |
|---|---|---|---|
| `superadmin` | `superadmin123*` | superadmin | – |
| `admin_argentina` | `admin123*` | admin_pais | Argentina |
| `editor_argentina` | `editor123*` | editor | Argentina |

---

## 5. Cliente axios listo para usar

```ts
// src/lib/api.ts
import axios, { AxiosError } from 'axios';

export const API_BASE = 'https://colcom-api-web.onrender.com/api';
const TOKEN_KEY = 'colcom_access_token';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ ok: false; message: string; statusCode: number }>) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export const saveToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
```

### Versión con `fetch` nativo

```ts
const API_BASE = 'https://colcom-api-web.onrender.com/api';

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem('colcom_access_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (init.body instanceof FormData) delete headers['Content-Type'];

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  const json = await res.json();
  if (!json.ok) throw new Error(json.message ?? `HTTP ${res.status}`);
  return json as T;
}
```

---

## 6. Flujo de autenticación

### Login
```ts
const res = await api.post('/auth/login', {
  username: 'admin_argentina',
  password: 'admin123*',
});
// res.data = { ok: true, data: { accessToken, user: { id, username, rol, pais_id, ... } } }
saveToken(res.data.data.accessToken);
```

### Recuperar contraseña (3 pasos)

```ts
// 1) Consulta la pregunta de seguridad
const { data: { data: q } } = await api.post('/auth/security-question', {
  username: 'admin_argentina',
});
// q = { pregunta_seguridad: "Nombre de tu mascota" }

// 2) Muestra la pregunta al usuario y envía respuesta + new_password
await api.post('/auth/forgot-password', {
  username: 'admin_argentina',
  respuesta_seguridad: 'firulais',
  new_password: 'nuevo_password_seguro',
});
```

### Cambiar mi password (autenticado)
```ts
await api.patch('/auth/change-my-password', {
  current_password: 'admin123*',
  new_password: 'nuevo_password_seguro',
});
```

### Setear / actualizar pregunta de seguridad (autenticado)
```ts
await api.patch('/auth/security-question', {
  pregunta_seguridad: '¿Nombre de tu mascota?',
  respuesta_seguridad: 'firulais',
});
```

### Actualizar mi perfil
```ts
await api.patch('/auth/me', {
  nombre: 'Juan',
  apellido: 'Pérez',
  email: 'juan@example.com',
});
```

### Mi pregunta de seguridad (autenticado)
```ts
const { data: { data } } = await api.get('/auth/security-question/me');
```

---

## 7. Endpoints completos

### 7.1 Portal público (sin JWT)

#### Listar noticias publicadas por país
```http
GET /api/public/paises/:paisSlug/noticias?page=1&limit=20
```
`paisSlug` ∈ `argentina | chile`. Devuelve solo noticias con `estado='publicado'`.

#### Detalle de noticia pública
```http
GET /api/public/paises/:paisSlug/noticias/:noticiaSlug
```

#### Listar testimonios publicados
```http
GET /api/public/paises/:paisSlug/testimonios?page=1&limit=20
```

#### Detalle de testimonio
```http
GET /api/public/paises/:paisSlug/testimonios/:id
```

#### Crear solicitud de contacto (público)
```http
POST /api/solicitudes/public
```
```json
{
  "nombre": "Cliente Demo",
  "correo": "cliente@example.com",
  "telefono": "+54 11 1234 5678",
  "finalidad": "Cotización",
  "mensaje": "Quisiera más información",
  "pais_slug": "argentina"
}
```
Campos requeridos: `nombre`, `correo`. Alternativa: `pais_id` en vez de `pais_slug`.

---

### 7.2 Auth (algunos públicos, otros con JWT)

| Método | Ruta | Auth | Body |
|---|---|---|---|
| POST | `/api/auth/login` | – | `{ username, password }` |
| POST | `/api/auth/security-question` | – | `{ username }` |
| POST | `/api/auth/forgot-password` | – | `{ username, respuesta_seguridad, new_password }` |
| PATCH | `/api/auth/me` | JWT | `{ nombre?, apellido?, email? }` |
| PATCH | `/api/auth/change-my-password` | JWT | `{ current_password, new_password }` |
| PATCH | `/api/auth/security-question` | JWT | `{ pregunta_seguridad, respuesta_seguridad }` |
| GET | `/api/auth/security-question/me` | JWT | – |

---

### 7.3 Usuarios (solo `superadmin`)

| Método | Ruta | Notas |
|---|---|---|
| GET | `/api/users?page=1&limit=20` | paginado |
| POST | `/api/users` | crear usuario |
| PUT | `/api/users/:id` | full update |
| PATCH | `/api/users/:id` | partial update |
| PATCH | `/api/users/:id/password` | reset password por admin |
| DELETE | `/api/users/:id` | soft delete (estado = inactivo) |
| DELETE | `/api/users/:id/permanent` | hard delete |

Body para crear usuario:
```json
{
  "nombre": "Ana",
  "apellido": "García",
  "email": "ana@example.com",
  "username": "ana_admin",
  "password": "password_seguro_8+",
  "rol": "admin_pais",
  "pais_id": "<uuid>",
  "estado": "activo"
}
```
`rol` ∈ `superadmin | admin_pais | editor`. `pais_id` requerido si rol ≠ superadmin.

---

### 7.4 Países

```http
GET /api/paises
```
Superadmin ve todos; admin/editor solo su país.

---

### 7.5 Noticias (scope por país; editor NO puede DELETE)

| Método | Ruta | Roles |
|---|---|---|
| GET | `/api/noticias?page=1&limit=20` | super, admin, editor |
| GET | `/api/noticias/:id` | super, admin, editor |
| POST | `/api/noticias` | super, admin, editor |
| PUT | `/api/noticias/:id` | super, admin, editor |
| PATCH | `/api/noticias/:id` | super, admin, editor |
| PATCH | `/api/noticias/:id/estado` | super, admin, editor |
| PATCH | `/api/noticias/:id/imagen` | super, admin, editor (multipart, ≤ 5 MB) |
| DELETE | `/api/noticias/:id` | super, admin |

Body de creación:
```json
{
  "titulo": "Mi noticia",
  "slug": "mi-noticia",
  "resumen": "Resumen corto",
  "contenido": "Contenido completo en HTML/Markdown",
  "pais_id": "<uuid>",
  "estado": "borrador"
}
```
`estado` ∈ `borrador | publicado | despublicado`. Para superadmin `pais_id` es obligatorio; editor/admin usa el suyo automáticamente.

Cambio de estado:
```json
PATCH /api/noticias/:id/estado
{ "estado": "publicado" }
```

Upload de imagen:
```ts
const form = new FormData();
form.append('file', fileInput.files[0]);
await api.patch(`/noticias/${id}/imagen`, form);
```

---

### 7.6 Testimonios (mismo patrón que noticias)

| Método | Ruta | Roles |
|---|---|---|
| GET / GET :id | listar / detalle | super, admin, editor |
| POST | crear | super, admin, editor |
| PUT / PATCH | update | super, admin, editor |
| PATCH `/:id/estado` | publicar/despublicar | super, admin, editor |
| PATCH `/:id/foto` | subir foto (≤ 5 MB) | super, admin, editor |
| DELETE | borrar | super, admin |

Body de creación:
```json
{
  "nombre": "Juan Pérez",
  "cargo": "Director",
  "empresa": "ACME",
  "contenido": "El servicio fue excelente...",
  "instagram_url": "https://instagram.com/juan",
  "facebook_url": "https://facebook.com/juan",
  "destacado": true,
  "pais_id": "<uuid>",
  "estado": "borrador"
}
```

---

### 7.7 Solicitudes (panel — sin editor)

| Método | Ruta | Roles |
|---|---|---|
| POST | `/api/solicitudes/public` | público (ya documentado arriba) |
| GET | `/api/solicitudes` | super, admin |
| GET | `/api/solicitudes/:id` | super, admin |
| PUT | `/api/solicitudes/:id` | super, admin |
| PATCH | `/api/solicitudes/:id` | super, admin |
| PATCH | `/api/solicitudes/:id/estado` | super, admin |
| DELETE | `/api/solicitudes/:id` | super, admin |

`estado` ∈ `pendiente | leido | respondido`.

---

### 7.8 Archivos

| Método | Ruta | Roles |
|---|---|---|
| GET | `/api/archivos?page=1&limit=20` | super, admin, editor |
| GET | `/api/archivos/:id` | super, admin, editor |
| POST | `/api/archivos` | super, admin, editor (registra URL manual) |
| POST | `/api/archivos/upload` | super, admin, editor (multipart, ≤ 20 MB) |
| PUT | `/api/archivos/:id` | super, admin, editor |
| PATCH | `/api/archivos/:id` | super, admin, editor |
| DELETE | `/api/archivos/:id` | super, admin (borra storage físico + BD) |

Registrar URL manual:
```json
POST /api/archivos
{
  "nombre_archivo": "Manual de usuario.pdf",
  "url": "https://midominio.com/manual.pdf",
  "tipo_archivo": "pdf",
  "modulo": "noticias",
  "referencia_id": "<uuid de la noticia>"
}
```

Upload físico:
```ts
const form = new FormData();
form.append('file', file);
form.append('nombre_archivo', file.name);
form.append('modulo', 'noticias');
form.append('referencia_id', noticiaId);
await api.post('/archivos/upload', form);
```

---

### 7.9 Auditoría (readonly)

| Método | Ruta | Roles |
|---|---|---|
| GET | `/api/auditoria?modulo=&accion=&usuario_id=&registro_id=&page=&limit=` | super, admin |
| GET | `/api/auditoria/:id` | super, admin |

`admin_pais` solo ve entradas de usuarios de su país.

---

### 7.10 Chatbot

| Método | Ruta | Auth | Body |
|---|---|---|---|
| GET | `/api/chatbot/health` | público | – |
| POST | `/api/chatbot/consultar` | JWT (cualquier rol) | `{ message, country }` |

```json
POST /api/chatbot/consultar
{ "message": "¿Cómo agendo una cita?", "country": "argentina" }
```
`message` máx 500 caracteres.

---

## 8. Ejemplos en React

### Hook de login
```tsx
// src/hooks/useAuth.ts
import { useState } from 'react';
import { api, saveToken, clearToken } from '../lib/api';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(username: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/login', { username, password });
      saveToken(data.data.accessToken);
      return data.data.user;
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Error de conexión');
      throw e;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearToken();
    window.location.href = '/login';
  }

  return { login, logout, loading, error };
}
```

### Componente de login
```tsx
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export function LoginForm() {
  const { login, loading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form onSubmit={async (e) => { e.preventDefault(); await login(username, password); }}>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usuario" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
      <button disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
```

### Hook para listar (paginado)
```tsx
import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export function useNoticias(page = 1, limit = 20) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/noticias?page=${page}&limit=${limit}`)
      .then(({ data }) => {
        setItems(data.data);
        setPagination(data.pagination);
      })
      .finally(() => setLoading(false));
  }, [page, limit]);

  return { items, pagination, loading };
}
```

### Portal público (sin token)
```tsx
import { useEffect, useState } from 'react';

const API_BASE = 'https://colcom-api-web.onrender.com/api';

export function NoticiasPublicas({ paisSlug }: { paisSlug: string }) {
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/public/paises/${paisSlug}/noticias`)
      .then((r) => r.json())
      .then((res) => res.ok && setNoticias(res.data));
  }, [paisSlug]);

  return (
    <ul>
      {noticias.map((n: any) => (
        <li key={n.id}>
          <a href={`/${paisSlug}/${n.slug}`}>{n.titulo}</a>
        </li>
      ))}
    </ul>
  );
}
```

### Formulario público de contacto
```tsx
async function enviarSolicitud(payload: {
  nombre: string;
  correo: string;
  telefono?: string;
  mensaje?: string;
  pais_slug: 'argentina' | 'chile';
}) {
  const res = await fetch(`${API_BASE}/solicitudes/public`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.message);
  return json.data;
}
```

### Upload de imagen
```tsx
async function subirImagen(noticiaId: string, file: File) {
  const form = new FormData();
  form.append('file', file);
  // NO setear Content-Type — el browser arma el boundary del multipart
  const { data } = await api.patch(`/noticias/${noticiaId}/imagen`, form);
  return data.data;
}
```

---

## 9. Tips y gotchas

- **JWT expira en 8h**. Cuando recibas `401` en una request autenticada, limpia el token y redirige a login (el interceptor del ejemplo lo hace).
- **No setees `Content-Type` manualmente** cuando mandes `FormData` — el browser lo hace y necesita el `boundary`.
- **Cold start de Render**: la primera request después de inactividad puede demorar. Considera un loader inicial o pre-warm con un `GET /api/health` al cargar la app.
- **Paginación**: `page` empieza en `1` (no en `0`). `limit` máx `100`, default `20`.
- **IDs son strings UUID** (text), no enteros. Pásalos tal cual.
- **Rutas y campos están en español** (`titulo`, `correo`, `gestionado_por`). No los traduzcas en el payload.
- **Editor no puede borrar** noticias/testimonios/archivos. Oculta los botones de delete según el rol del usuario logueado (`user.rol`).
- **Scope por país** es transparente: editor/admin solo ven y modifican datos de su `pais_id`. Si intentan acceder a otro país, reciben 404.
- **Health check**: usa `GET /api/health` para verificar conectividad sin consumir cuota.
- **Bloqueo de login**: tras 5 intentos fallidos se bloquea el usuario por 15 minutos.

---

## 10. Checklist para arrancar

- [ ] Hacer `GET /api/health` para validar conectividad
- [ ] Probar login con `admin_argentina / admin123*`
- [ ] Guardar `accessToken` y mandarlo en `Authorization: Bearer ...`
- [ ] Renderizar listado de noticias con `GET /api/noticias`
- [ ] Probar listado público con `GET /api/public/paises/argentina/noticias`
- [ ] Manejar `401` redirigiendo a login
- [ ] Si necesitas restringir CORS más adelante, avísame el dominio del frontend para agregarlo en Render
