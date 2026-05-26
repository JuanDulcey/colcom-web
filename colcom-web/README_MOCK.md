# Guía de Ejecución Local (Modo Mock)

Esta guía explica cómo levantar el entorno de desarrollo simulando el backend de Colcom, ideal para cuando el servidor de la API real se encuentra caído o inaccesible.

## 1. Configuración de Variables de Entorno

El proyecto contiene un archivo `.env` en la raíz (junto al `package.json`).
Asegúrate de que su contenido incluya:

```env
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=http://localhost:3001/api
```

> [!WARNING]
> **REINICIAR SERVIDOR**: Si tenías el comando `npm run dev` ejecutándose mientras el archivo `.env` fue modificado, **debes detenerlo (Ctrl + C) y volver a ejecutarlo**. Vite solo lee el archivo `.env` al iniciar, por lo que si no reinicias, la app no sabrá que el mock está encendido y fallarán los inicios de sesión al intentar conectarse al backend caído.

## 2. Iniciar el Servidor de Desarrollo

Ejecuta el siguiente comando en la terminal (ubicado en la carpeta `colcom-web`):
```bash
npm run dev
```

Abre la URL proporcionada (usualmente `http://localhost:5173`) en tu navegador.

## 3. Credenciales de Prueba (Mock)

Los siguientes usuarios están configurados automáticamente en la base de datos simulada y funcionarán al iniciar sesión:

- **Super Administrador**
  - Username: `superadmin`
  - Password: `superadmin123*`
  - *Acceso total, gestión de usuarios, auditoría, y vista global de países.*

- **Administrador de País (Argentina)**
  - Username: `admin_argentina`
  - Password: `admin123*`
  - *Acceso completo a noticias, testimonios, archivos y solicitudes de Argentina.*

- **Editor (Argentina)**
  - Username: `editor_argentina`
  - Password: `editor123*`
  - *Puede crear y editar contenido de Argentina, pero no tiene permisos para borrar ni ver solicitudes o usuarios.*

## 4. Limpieza de Base de Datos Local

Toda la base de datos simulada vive en el `localStorage` de tu navegador web bajo la llave `colcom_mock_db`. 
- Si accidentalmente borras o dañas algo y quieres empezar desde cero, abre las DevTools de tu navegador (F12) > Application > Local Storage > Elimina `colcom_mock_db`. Al recargar la página, la base de datos de prueba se restaurará automáticamente.

## 5. Volver al Backend Real

Cuando el backend real vuelva a estar en línea, simplemente abre tu archivo `.env` y realiza uno de los siguientes pasos:
- Cambia `VITE_USE_MOCK_API=false`
- O bien, elimina por completo la variable `VITE_USE_MOCK_API`.

Luego, **reinicia el servidor de desarrollo (`npm run dev`)** para aplicar los cambios y la plataforma se reconectará al backend instantáneamente.
