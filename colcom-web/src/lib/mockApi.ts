import { getDB, saveDB } from './mockData';
import { ApiEnvelope } from '../types';

function createId() {
  return Math.random().toString(36).substring(2, 9);
}

function parseToken(token?: string | null) {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

function createToken(user: any) {
  const payload = {
    sub: user.id,
    username: user.username,
    rol: user.rol,
    pais_id: user.pais_id
  };
  return 'header.' + btoa(JSON.stringify(payload)) + '.signature';
}

function paginate(array: any[], page: number, limit: number) {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  return {
    data: array.slice(startIndex, endIndex),
    pagination: {
      page,
      limit,
      total: array.length,
      totalPages: Math.ceil(array.length / limit) || 1
    }
  };
}

export async function mockApiRequest<T>(
  path: string,
  options: Omit<RequestInit, 'body'> & { body?: BodyInit | Record<string, unknown> } = {}
): Promise<ApiEnvelope<T>> {
  // Simulate network delay
  await new Promise(r => setTimeout(r, 300));

  const db = getDB();
  const method = options.method?.toUpperCase() || 'GET';
  const token = (options.headers as any)?.['Authorization']?.replace('Bearer ', '');
  const userPayload = parseToken(token);
  
  const bodyData = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
  
  const isPublic = path.startsWith('/public') || path.startsWith('/auth/login') || path.startsWith('/auth/security-question') || path.startsWith('/auth/forgot-password') || path === '/solicitudes/public' || path === '/chatbot/health' || path.startsWith('/paises');
  
  if (!isPublic && !userPayload) {
    return { ok: false, statusCode: 401, message: 'No autenticado' } as any;
  }

  const userRole = userPayload?.rol;
  const userPaisId = userPayload?.pais_id;
  const userId = userPayload?.sub;

  const getQueryParam = (key: string) => {
    const url = new URL(`http://localhost${path}`);
    return url.searchParams.get(key);
  };
  
  const basePath = path.split('?')[0];
  const segments = basePath.split('/').filter(Boolean);

  // AUTH
  if (basePath === '/auth/login' && method === 'POST') {
    const { username, password } = bodyData;
    const user = db.users.find((u: any) => u.username === username && u.password === password && u.estado === 'activo');
    if (!user) return { ok: false, statusCode: 401, message: 'Credenciales inválidas' } as any;
    const accessToken = createToken(user);
    const userSafe = { ...user };
    delete userSafe.password;
    return { ok: true, data: { accessToken, user: userSafe } } as any;
  }

  if (basePath === '/auth/security-question' && method === 'GET') {
    const username = getQueryParam('username');
    const user = db.users.find((u: any) => u.username === username && u.estado === 'activo');
    if (!user) return { ok: false, statusCode: 404, message: 'Usuario no encontrado' } as any;
    if (!user.pregunta_seguridad) return { ok: false, statusCode: 400, message: 'Usuario sin pregunta' } as any;
    return { ok: true, data: { pregunta: user.pregunta_seguridad } } as any;
  }

  if (basePath === '/auth/forgot-password' && method === 'POST') {
    const { username, respuesta_seguridad, new_password } = bodyData;
    const user = db.users.find((u: any) => u.username === username && u.estado === 'activo');
    if (!user) return { ok: false, statusCode: 404, message: 'Usuario no encontrado' } as any;
    if (user.respuesta_seguridad?.toLowerCase() !== respuesta_seguridad?.toLowerCase()) {
      return { ok: false, statusCode: 400, message: 'Respuesta incorrecta' } as any;
    }
    user.password = new_password;
    saveDB(db);
    return { ok: true, message: 'Contraseña actualizada' } as any;
  }

  if (basePath === '/auth/me' && method === 'PATCH') {
    const user = db.users.find((u: any) => u.id === userId);
    if (!user) return { ok: false, statusCode: 404, message: 'User not found' } as any;
    Object.assign(user, bodyData);
    saveDB(db);
    return { ok: true, data: user } as any;
  }

  // PUBLIC
  if (basePath.startsWith('/public/paises/')) {
    const paisSlug = segments[2];
    const entity = segments[3];
    const idOrSlug = segments[4];
    
    const country = db.countries.find((c: any) => c.slug === paisSlug);
    if (!country) return { ok: false, statusCode: 404, message: 'País no encontrado' } as any;

    if (entity === 'noticias') {
      const noticias = db.noticias.filter((n: any) => n.pais_id === country.id && n.estado === 'publicado');
      if (idOrSlug) {
        const noti = noticias.find((n: any) => n.slug === idOrSlug);
        if (!noti) return { ok: false, statusCode: 404, message: 'Noticia no encontrada' } as any;
        return { ok: true, data: noti } as any;
      }
      return { ok: true, ...paginate(noticias, Number(getQueryParam('page')) || 1, Number(getQueryParam('limit')) || 20) } as any;
    }
    
    if (entity === 'testimonios') {
      const testimonios = db.testimonios.filter((t: any) => t.pais_id === country.id && t.estado === 'publicado');
      if (idOrSlug) {
        const test = testimonios.find((t: any) => t.id === idOrSlug);
        if (!test) return { ok: false, statusCode: 404, message: 'Testimonio no encontrado' } as any;
        return { ok: true, data: test } as any;
      }
      return { ok: true, ...paginate(testimonios, Number(getQueryParam('page')) || 1, Number(getQueryParam('limit')) || 20) } as any;
    }
  }

  if (basePath === '/solicitudes/public' && method === 'POST') {
    const newSol = { id: createId(), ...bodyData, estado: 'pendiente', created_at: new Date().toISOString() };
    db.solicitudes.push(newSol);
    saveDB(db);
    return { ok: true, data: newSol } as any;
  }

  // DASHBOARD & ADMIN
  const isSuperadmin = userRole === 'superadmin';
  const isAdminPais = userRole === 'admin_pais';
  const isEditor = userRole === 'editor';

  const filterByCountry = (arr: any[]) => isSuperadmin ? arr : arr.filter(i => i.pais_id === userPaisId);

  // USERS (Solo Superadmin)
  if (basePath.startsWith('/users')) {
    if (!isSuperadmin) return { ok: false, statusCode: 403, message: 'Forbidden' } as any;
    const id = segments[1];
    
    if (method === 'GET') {
      return { ok: true, ...paginate(db.users, Number(getQueryParam('page')) || 1, Number(getQueryParam('limit')) || 20) } as any;
    }
    if (method === 'POST') {
      const newUser = { id: createId(), ...bodyData, estado: 'activo' };
      db.users.push(newUser);
      saveDB(db);
      return { ok: true, data: newUser } as any;
    }
    if (id) {
      const idx = db.users.findIndex((u: any) => u.id === id);
      if (idx === -1) return { ok: false, statusCode: 404, message: 'Not found' } as any;
      if (method === 'PUT' || method === 'PATCH') {
        Object.assign(db.users[idx], bodyData);
        saveDB(db);
        return { ok: true, data: db.users[idx] } as any;
      }
      if (method === 'DELETE') {
        db.users[idx].estado = 'inactivo';
        saveDB(db);
        return { ok: true, data: null } as any;
      }
    }
  }

  // PAISES
  if (basePath === '/paises' && method === 'GET') {
    if (isSuperadmin) return { ok: true, data: db.countries } as any;
    return { ok: true, data: db.countries.filter((c: any) => c.id === userPaisId) } as any;
  }

  // NOTICIAS & TESTIMONIOS & ARCHIVOS
  const handleCrud = (entityName: string) => {
    const arr = db[entityName];
    const id = segments[1];

    if (method === 'GET') {
      if (id) {
        const item = filterByCountry(arr).find((i: any) => i.id === id);
        return item ? { ok: true, data: item } as any : { ok: false, statusCode: 404, message: 'Not found' } as any;
      }
      return { ok: true, ...paginate(filterByCountry(arr), Number(getQueryParam('page')) || 1, Number(getQueryParam('limit')) || 20) } as any;
    }
    if (method === 'POST') {
      const isUpload = id === 'upload' && options.body instanceof FormData;
      if (isUpload) {
        const fakeUrl = 'blob:http://localhost/' + createId();
        const newFile = { id: createId(), nombre_archivo: 'mock_upload.jpg', url: fakeUrl, tipo_archivo: 'image/jpeg', pais_id: isSuperadmin ? (options.body as any).get('pais_id') : userPaisId, created_at: new Date().toISOString() };
        db.archivos.push(newFile);
        saveDB(db);
        return { ok: true, data: newFile } as any;
      }
      const newItem = { id: createId(), ...bodyData, pais_id: isSuperadmin ? bodyData.pais_id : userPaisId, created_at: new Date().toISOString() };
      arr.push(newItem);
      saveDB(db);
      return { ok: true, data: newItem } as any;
    }
    if (id) {
      const idx = arr.findIndex((i: any) => i.id === id);
      if (idx === -1) return { ok: false, statusCode: 404, message: 'Not found' } as any;
      
      if (!isSuperadmin && arr[idx].pais_id !== userPaisId) return { ok: false, statusCode: 403, message: 'Forbidden' } as any;

      if (method === 'PUT' || method === 'PATCH') {
        if (segments[2] === 'estado') {
           arr[idx].estado = bodyData.estado;
        } else if (segments[2] === 'imagen' || segments[2] === 'foto') {
           arr[idx].imagen_url = 'blob:http://localhost/' + createId();
        } else {
           Object.assign(arr[idx], bodyData);
        }
        saveDB(db);
        return { ok: true, data: arr[idx] } as any;
      }
      if (method === 'DELETE') {
        if (isEditor) return { ok: false, statusCode: 403, message: 'Editor cannot delete' } as any;
        arr.splice(idx, 1);
        saveDB(db);
        return { ok: true, data: null } as any;
      }
    }
  };

  if (basePath.startsWith('/noticias')) return handleCrud('noticias');
  if (basePath.startsWith('/testimonios')) return handleCrud('testimonios');
  if (basePath.startsWith('/archivos')) return handleCrud('archivos');
  
  // SOLICITUDES & AUDITORIA (No editor)
  if (basePath.startsWith('/solicitudes') || basePath.startsWith('/auditoria')) {
    if (isEditor) return { ok: false, statusCode: 403, message: 'Forbidden' } as any;
    const entity = basePath.startsWith('/solicitudes') ? 'solicitudes' : 'auditoria';
    const id = segments[1];
    const arr = filterByCountry(db[entity]);

    if (method === 'GET') {
      if (id) {
        const item = arr.find((i: any) => i.id === id);
        return item ? { ok: true, data: item } as any : { ok: false, statusCode: 404, message: 'Not found' } as any;
      }
      return { ok: true, ...paginate(arr, Number(getQueryParam('page')) || 1, Number(getQueryParam('limit')) || 20) } as any;
    }
    
    if (entity === 'solicitudes' && id) {
       const idx = db.solicitudes.findIndex((i: any) => i.id === id);
       if (method === 'PUT' || method === 'PATCH') {
         Object.assign(db.solicitudes[idx], bodyData);
         saveDB(db);
         return { ok: true, data: db.solicitudes[idx] } as any;
       }
       if (method === 'DELETE') {
         db.solicitudes.splice(idx, 1);
         saveDB(db);
         return { ok: true, data: null } as any;
       }
    }
  }

  // CHATBOT
  if (basePath === '/chatbot/consultar' && method === 'POST') {
    return { ok: true, data: { answer: 'Esta es una respuesta simulada del chatbot local.' } } as any;
  }

  if (basePath === '/health') {
    return { ok: true, data: { status: 'mocked' } } as any;
  }

  return { ok: false, statusCode: 404, message: `Mock endpoint not found: ${method} ${path}` } as any;
}
