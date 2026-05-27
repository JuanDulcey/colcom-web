# Recuperación de contraseña con pregunta de seguridad

> Guía para el frontend. Base URL: `http://localhost:3001/api` en dev, o el host de Render en prod.
> Todos los endpoints viven bajo `/auth`. La respuesta siempre tiene la forma `{ ok, data, message? }` (éxito) o `{ ok: false, statusCode, message, errors? }` (error).

## Modelo conceptual

1. El usuario, **estando logueado**, configura su pregunta y respuesta de seguridad (ej. *"¿Cómo se llama tu perro?" → "Mayu"*).
2. La respuesta se guarda hasheada con bcrypt y **normalizada** (`lowercase + trim`), nunca en texto plano.
3. Cuando olvida la contraseña, el flujo es:
   - El usuario escribe su `username` → el front pide al backend la pregunta asociada.
   - Se muestra la pregunta en pantalla y se piden: respuesta + nueva contraseña.
   - El backend valida la respuesta y, si coincide, actualiza la contraseña.
4. Si la respuesta falla 5 veces seguidas, la **recuperación queda bloqueada 15 minutos** (configurable vía `LOGIN_MAX_ATTEMPTS` y `LOGIN_BLOCK_MINUTES` en el backend). El login normal tiene su propio contador independiente.

---

## 1) Configurar pregunta de seguridad (autenticado)

Crea o actualiza la pregunta/respuesta del usuario logueado. Llamar **una sola vez** al onboarding, o desde "Mi cuenta → seguridad".

- **Método y ruta:** `PATCH /api/auth/security-question`
- **Headers:** `Authorization: Bearer <accessToken>`
- **Body:**

```json
{
  "pregunta_seguridad": "¿Cómo se llama tu perro?",
  "respuesta_seguridad": "Mayu"
}
```

- **Validaciones:** `pregunta_seguridad` mín. 3 chars · `respuesta_seguridad` mín. 2 chars.
- **Respuesta 200:**

```json
{ "ok": true, "data": { "message": "Pregunta de seguridad actualizada" } }
```

- **Errores típicos:**
  - `401 Unauthorized` → falta o expiró el JWT.
  - `400 Bad Request` → validación falla (cuerpo con `errors[]`).

---

## 2) Ver mi pregunta de seguridad (autenticado)

Útil en "Mi cuenta" para mostrar al usuario qué pregunta tiene configurada (la respuesta nunca se devuelve).

- **Método y ruta:** `GET /api/auth/security-question/me`
- **Headers:** `Authorization: Bearer <accessToken>`
- **Respuesta 200:**

```json
{ "ok": true, "data": { "pregunta_seguridad": "¿Cómo se llama tu perro?" } }
```

Si nunca la configuró: `{ "ok": true, "data": { "pregunta_seguridad": null } }`.

---

## 3) Obtener pregunta por username (PÚBLICO)

**Paso 1 del flujo "olvidé mi contraseña".** Toma el username y devuelve la pregunta a mostrarle al usuario. **No requiere token.**

- **Método y ruta:** `POST /api/auth/security-question`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{ "username": "admin_argentina" }
```

- **Respuesta 200:**

```json
{ "ok": true, "data": { "pregunta_seguridad": "¿Cómo se llama tu perro?" } }
```

- **Errores típicos:**
  - `404 Not Found` → username no existe **o** el usuario no tiene pregunta configurada. Por seguridad el mensaje es el mismo en ambos casos: `"No hay pregunta de seguridad configurada"`. El front debe mostrar al usuario algo genérico como *"No es posible recuperar la contraseña de este usuario por este método. Contacta al administrador."*
  - `400 Bad Request` → username mal formado.

---

## 4) Restablecer contraseña (PÚBLICO)

**Paso 2 del flujo "olvidé mi contraseña".** Valida la respuesta y cambia la contraseña.

- **Método y ruta:** `POST /api/auth/forgot-password`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{
  "username": "admin_argentina",
  "respuesta_seguridad": "Mayu",
  "new_password": "NuevaPass123*"
}
```

- **Validaciones:** `username` mín. 3 · `respuesta_seguridad` mín. 2 · `new_password` **mín. 8** chars.
- **Respuesta 200:**

```json
{ "ok": true, "data": { "message": "Contraseña restablecida" } }
```

- **Errores típicos:**
  - `403 Forbidden – "Respuesta incorrecta"` → respuesta de seguridad mal escrita. Cada fallo incrementa el contador.
  - `403 Forbidden – "Recuperación bloqueada hasta <ISO timestamp>"` → tras 5 intentos fallidos el usuario queda bloqueado 15 min para recuperación. El front puede parsear el timestamp del mensaje para mostrar countdown.
  - `403 Forbidden – "No se puede recuperar la contraseña por este método"` → el usuario no tiene pregunta configurada.
  - `400 Bad Request` → validación de cuerpo falla (p.ej. contraseña < 8).

Tras éxito, el backend también:
- Resetea el contador de intentos fallidos de **login** (no solo el de recuperación), desbloqueando al usuario.
- Genera una notificación in-app "Contraseña restablecida" visible en `/api/notificaciones`.
- Registra el evento en `bitacora_auditoria` (acción `recuperar_contrasena`).

> Después del 200, el front debe redirigir al login. La nueva contraseña ya es válida — no se devuelve token automáticamente.

---

## Flujo recomendado en UI

```
[Pantalla login]
   ├── usuario clica "Olvidé mi contraseña"
   ▼
[Pantalla 1: pedir username]
   ├── input: username
   ├── botón "Continuar"  →  POST /auth/security-question
   ▼ (si 200)
[Pantalla 2: pregunta + respuesta + nueva contraseña]
   ├── label (read-only): data.pregunta_seguridad
   ├── input: respuesta
   ├── input: nueva contraseña (mín 8)
   ├── input: confirmar nueva contraseña (validar en front)
   ├── botón "Restablecer"  →  POST /auth/forgot-password
   ▼ (si 200)
[Toast "Contraseña restablecida"] → redirect /login
```

Manejo de errores en pantalla 2:
- `403 "Respuesta incorrecta"` → mensaje inline + dejar reintentar.
- `403 "Recuperación bloqueada hasta ..."` → bloquear el botón, mostrar countdown hasta la hora indicada.

---

## Tabla resumen

| # | Método | Ruta                              | Auth | Propósito                                |
|---|--------|-----------------------------------|------|------------------------------------------|
| 1 | PATCH  | `/api/auth/security-question`     | JWT  | Configurar o actualizar la pregunta      |
| 2 | GET    | `/api/auth/security-question/me`  | JWT  | Ver mi pregunta configurada              |
| 3 | POST   | `/api/auth/security-question`     | —    | (Público) Obtener pregunta por username  |
| 4 | POST   | `/api/auth/forgot-password`       | —    | (Público) Restablecer contraseña         |

---

## Notas de seguridad para el front

- **Nunca envíes** la respuesta en URL o query params, siempre en body.
- La respuesta es case-insensitive y se le hace trim: `"Mayu"`, `"mayu"` y `" MAYU "` se aceptan igual.
- Si el usuario nunca configuró una pregunta, no podrá usar este flujo. Considera forzar la configuración en el primer login (UX sugerido: tras login, si `/auth/security-question/me` devuelve `null`, mostrar un modal obligatorio).
- El bloqueo es por usuario, no por IP. Tras 5 intentos fallidos quedan 15 min sin poder recuperar — el login normal con la contraseña sigue funcionando.
