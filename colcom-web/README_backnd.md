# Colcom API

Backend administrativo y portal público para CMS multipaís de **Colcom**, construido con **NestJS + TypeScript + pg puro (sin ORM) + Supabase Storage**.

> 49 endpoints, 4 roles (público, editor, admin_pais, superadmin), audit log automático, RBAC scoped por país.

---

## Stack

| Capa | Tecnología |
|---|---|
| Runtime | Node.js 20+ (TypeScript, target ES2022, CommonJS modules) |
| Framework | NestJS 10 |
| Acceso a DB | `pg` (node-postgres) puro, Pool centralizado vía `PG_POOL` token |
| Base de datos | PostgreSQL en Supabase (vía pooler) |
| Auth | `@nestjs/jwt` + `@nestjs/passport` + `passport-jwt` (JWT firmado con `jsonwebtoken`) |
| Hash | `bcryptjs` |
| Validación | `class-validator` + `class-transformer` DTOs |
| Storage | `@supabase/storage-js` (solo Storage, no DB) |
| Upload multipart | `multer` (memory storage) + `FileInterceptor` |

**No** se usa: Express directo, Prisma, Sequelize, TypeORM, `@supabase/supabase-js` para DB.

---

## Quick start

```bash
# 1. Instalar dependencias
pnpm install

# 2. Configurar .env (copiar de .env.example y completar)
cp .env.example .env

# 3. Arrancar (watch + autoreload)
pnpm dev

# o sin watch
pnpm start

# 4. Probar health
curl http://localhost:3001/api/health
```

Type check (no compilación a disco): `pnpm typecheck`
Build a `dist/`: `pnpm build` y luego `pnpm start:prod`.

---

## Variables de entorno

Ver `.env.example`. Esenciales:

```dotenv
# Servidor
PORT=3001

# Base de datos — pooler de Supabase (puerto 6543, transaction mode)
DATABASE_URL=postgresql://postgres.<ref>:<pwd>@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Supabase Storage (solo para uploads, no para DB)
SUPABASE_URL=https://<ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Buckets (opcionales — defaults son los nombres)
SUPABASE_BUCKET_NOTICIAS=noticias
SUPABASE_BUCKET_TESTIMONIOS=testimonios
SUPABASE_BUCKET_ARCHIVOS=archivos

# JWT
JWT_SECRET=cadena_de_32_chars_o_mas
JWT_EXPIRES_IN=8h

# Seguridad
BCRYPT_ROUNDS=10
LOGIN_MAX_ATTEMPTS=5
LOGIN_BLOCK_MINUTES=15

# CORS — vacío = permitir todos
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

**Importante**: la URL directa `db.<ref>.supabase.co:5432` puede llegar a IPv6 y caer por NAT — usa siempre el **pooler** para `DATABASE_URL`.

---

## Roles y RBAC

| Rol | Alcance |
|---|---|
| público (sin JWT) | crea solicitudes de contacto y lee portales públicos (noticias/testimonios publicados de un país) |
| editor | scope a su `pais_id`; gestiona noticias/testimonios sin eliminar; sube archivos sin eliminar; sin acceso a usuarios/solicitudes/auditoría |
| admin_pais | scope a su `pais_id`; CRUD completo de noticias/testimonios/solicitudes/archivos; ve auditoría de su país |
| superadmin | acceso global; único que administra usuarios |

JWT payload: `{ sub, username, rol, pais_id }`.

---

## Endpoints (49)

### `/api/auth` — todos retornan envelope `{ ok, data }`

| Método | Ruta | Auth | Roles |
|---|---|---|---|
| POST | `/api/auth/login` | – | público |
| POST | `/api/auth/security-question` | – | público (consulta pregunta por username) |
| POST | `/api/auth/forgot-password` | – | público (recupera con pregunta) |
| PATCH | `/api/auth/me` | JWT | todos |
| PATCH | `/api/auth/change-my-password` | JWT | todos |
| PATCH | `/api/auth/security-question` | JWT | todos (set/update) |
| GET | `/api/auth/security-question/me` | JWT | todos |

### `/api/users` — solo `superadmin`

| Método | Ruta | Notas |
|---|---|---|
| GET | `/api/users` | paginado |
| POST | `/api/users` | requiere `pais_id` si rol ≠ superadmin |
| PUT | `/api/users/:id` | full update |
| PATCH | `/api/users/:id` | partial update |
| PATCH | `/api/users/:id/password` | reset por admin |
| DELETE | `/api/users/:id` | desactiva (`estado='inactivo'`); 403 si es uno mismo |
| DELETE | `/api/users/:id/permanent` | hard delete; 403 si es uno mismo o si target es superadmin |

### `/api/paises`

| Método | Ruta | Roles | Notas |
|---|---|---|---|
| GET | `/api/paises` | superadmin, admin_pais, editor | superadmin ve todos, admin/editor solo su país |

### `/api/noticias` — scope por país (editor NO DELETE)

| Método | Ruta | Roles |
|---|---|---|
| GET | `/api/noticias` | super, admin, editor |
| GET | `/api/noticias/:id` | super, admin, editor |
| POST | `/api/noticias` | super, admin, editor |
| PUT | `/api/noticias/:id` | super, admin, editor |
| PATCH | `/api/noticias/:id` | super, admin, editor |
| PATCH | `/api/noticias/:id/estado` | super, admin, editor |
| PATCH | `/api/noticias/:id/imagen` | super, admin, editor (multipart `file`, ≤ 5 MB) |
| DELETE | `/api/noticias/:id` | super, admin |

### `/api/testimonios` — mismo patrón que noticias

`PATCH /api/testimonios/:id/foto` para subir foto. `DELETE` solo super/admin.

### `/api/solicitudes`

| Método | Ruta | Auth | Roles |
|---|---|---|---|
| POST | `/api/solicitudes/public` | – | público — crea con `estado='pendiente'` |
| GET | `/api/solicitudes` | JWT | super, admin |
| GET | `/api/solicitudes/:id` | JWT | super, admin |
| PUT | `/api/solicitudes/:id` | JWT | super, admin |
| PATCH | `/api/solicitudes/:id` | JWT | super, admin |
| PATCH | `/api/solicitudes/:id/estado` | JWT | super, admin |
| DELETE | `/api/solicitudes/:id` | JWT | super, admin |

editor no tiene acceso.

### `/api/archivos`

| Método | Ruta | Roles |
|---|---|---|
| GET | `/api/archivos` | super, admin, editor |
| GET | `/api/archivos/:id` | super, admin, editor |
| POST | `/api/archivos` | super, admin, editor (registra URL manual) |
| POST | `/api/archivos/upload` | super, admin, editor (multipart, ≤ 20 MB) |
| PUT | `/api/archivos/:id` | super, admin, editor |
| PATCH | `/api/archivos/:id` | super, admin, editor |
| DELETE | `/api/archivos/:id` | super, admin (borra Storage físico + BD) |

### `/api/auditoria` — readonly

| Método | Ruta | Roles |
|---|---|---|
| GET | `/api/auditoria` | super, admin |
| GET | `/api/auditoria/:id` | super, admin |

Filtros: `?modulo`, `?accion`, `?usuario_id`, `?registro_id`, `?page`, `?limit`. admin solo ve entradas de usuarios de su país.

### `/api/public/...` — portal visitante (sin JWT)

| Método | Ruta |
|---|---|
| GET | `/api/public/paises/:paisSlug/noticias` |
| GET | `/api/public/paises/:paisSlug/noticias/:noticiaSlug` |
| GET | `/api/public/paises/:paisSlug/testimonios` |
| GET | `/api/public/paises/:paisSlug/testimonios/:id` |

Solo retornan `estado='publicado'`. Campos internos (autor_id, created_at, pais_id crudo) están ocultos.

---

## Envelope estándar

**Éxito**:
```json
{ "ok": true, "data": <T>, "pagination": { "page": 1, "limit": 20, "total": 35, "totalPages": 2 } }
```

**Error**:
```json
{ "ok": false, "statusCode": 401, "message": "Credenciales inválidas", "path": "/api/auth/login", "timestamp": "2026-05-13T...", "errors": [...] }
```

`errors[]` solo aparece en validación class-validator (400).

---

## Probar desde cero con curl

```bash
# 1. Health
curl http://localhost:3001/api/health

# 2. Login (guarda el accessToken)
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"superadmin","password":"superadmin123*"}' \
  | jq -r .data.accessToken)
echo $TOKEN

# 3. Listar usuarios (solo superadmin)
curl -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/users

# 4. Crear noticia (sin pais_id porque editor usa el suyo, pero superadmin debe pasarlo)
curl -X POST http://localhost:3001/api/noticias \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"titulo":"Mi noticia","contenido":"contenido","pais_id":"<UUID_ARGENTINA>"}'

# 5. Cambiar a publicado
NOTICIA_ID=<id-devuelto>
curl -X PATCH http://localhost:3001/api/noticias/$NOTICIA_ID/estado \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"estado":"publicado"}'

# 6. Subir imagen (multipart)
curl -X PATCH http://localhost:3001/api/noticias/$NOTICIA_ID/imagen \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/ruta/a/imagen.png"

# 7. Solicitud pública (sin token)
curl -X POST http://localhost:3001/api/solicitudes/public \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"Cliente","correo":"c@test.com","pais_slug":"argentina","mensaje":"Hola"}'

# 8. Portal público: listar noticias publicadas de Argentina
curl http://localhost:3001/api/public/paises/argentina/noticias

# 9. Auditoría (solo superadmin/admin_pais)
curl -H "Authorization: Bearer $TOKEN" "http://localhost:3001/api/auditoria?modulo=auth&limit=5"
```

### Thunder Client / Postman

1. Crear una colección y agregar las URLs anteriores
2. En la pestaña de Auth: tipo `Bearer Token`, valor = `{{accessToken}}`
3. Crear una variable de entorno `accessToken` (después del primer login, usar test script para guardarla)

---

## Modelo de datos

8 tablas en `public`:

| Tabla | Filas semilla | Notas |
|---|---|---|
| `roles` | 3 (superadmin, admin_pais, editor) | descripción |
| `paises` | 2 (Argentina, Chile) | slug único, código único |
| `usuarios` | 3 (seed) | password_hash (bcrypt), `pais_id` nullable solo para superadmin |
| `noticias` | content | slug único global, `estado ∈ {borrador,publicado,despublicado}`, `fecha_publicacion` automática |
| `testimonios` | content | `destacado bool`, mismas reglas de estado |
| `solicitudes_contacto` | content | `estado ∈ {pendiente,leido,respondido}`, `fecha_gestion` + `gestionado_por` automáticos |
| `archivos` | content | `bucket` + `storage_path` cuando es upload físico |
| `bitacora_auditoria` | content | `usuario_id` con `ON DELETE SET NULL` |

Todos los FKs `→ usuarios.id` son `ON DELETE SET NULL` para permitir hard-delete del usuario preservando trazabilidad.

**Índices clave**:
- `paises_slug_key`, `paises_codigo_key`, `usuarios_email_key`, `usuarios_username_key`, `noticias_slug_key`
- `idx_usuarios_pais`, `idx_noticias_pais`, `idx_testimonios_pais`, `idx_solicitudes_pais`
- `idx_noticias_estado`, `idx_testimonios_estado`, `idx_solicitudes_estado`
- `idx_auditoria_modulo`, `idx_auditoria_usuario`, `idx_auditoria_created_at`
- `idx_archivos_modulo`, `idx_archivos_referencia`

---

## Credenciales de prueba (entorno de desarrollo)

| Usuario | Password | Rol | País |
|---|---|---|---|
| `superadmin` | `superadmin123*` | superadmin | – |
| `admin_argentina` | `admin123*` | admin_pais | Argentina |
| `editor_argentina` | `editor123*` | editor | Argentina |

**Nunca usar estas credenciales en producción**.

---

## Convenciones

- **No comentarios** en código salvo para WHY no obvio.
- **Rutas en español**, payload en español (`titulo`, `correo`, `gestionado_por`, etc.).
- IDs son `text` UUID — los DTOs usan `@IsString()` no `@IsUUID()`.
- Cualquier endpoint protegido sin `@Roles` exige solo JWT válido (cualquier rol).
- Para hacer una ruta pública: decorador `@Public()` en el método o controlador.

---

## Estructura del proyecto

```
src/
├── main.ts, app.module.ts, app.controller.ts
├── auth/                    7 endpoints + JwtStrategy + DTOs
├── users/                   7 endpoints + DTOs
├── paises/                  1 endpoint
├── noticias/                8 endpoints + DTOs + FileInterceptor
├── testimonios/             8 endpoints + DTOs + FileInterceptor
├── solicitudes/             7 endpoints (1 público) + DTOs
├── archivos/                7 endpoints + upload + delete físico
├── auditoria/               2 endpoints readonly + servicio @Global registrar()
├── public/                  4 endpoints @Public (portal visitante)
├── database/                @Global PG_POOL provider
├── storage/                 @Global StorageService (Supabase Storage)
└── common/
    ├── constants.ts, types/, dto/, decorators/, guards/,
    │   interceptors/, filters/, utils/
```

---

## Migraciones aplicadas

Histórico vía Supabase MCP:

1. `add_descripcion_to_roles` — añadió `roles.descripcion` text
2. `fk_usuarios_set_null_on_delete` — todos los FKs → usuarios con `ON DELETE SET NULL`
3. `indices_performance_nestjs` — índices para scope por país y orden por fecha en auditoría

---

## Licencia

ISC.
