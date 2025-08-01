export async function handleStorage(request, env) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/storage', '');
  
  try {
    switch (request.method) {
      case 'GET':
        if (path === '/') {
          return listObjects(request, env, path);
        }
        return getObject(request, env, path);
      
      case 'PUT':
        return putObject(request, env, path);
      
      case 'DELETE':
        return deleteObject(request, env, path);
      
      default:
        return new Response('Method Not Allowed', { status: 405 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function listObjects(request, env, prefix) {
  const list = await env.STORAGE_BUCKET.list({ prefix });
  return new Response(JSON.stringify(list), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function getObject(request, env, key) {
  const object = await env.STORAGE_BUCKET.get(key);
  if (!object) {
    return new Response('Not Found', { status: 404 });
  }
  
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  
  return new Response(object.body, { headers });
}

async function putObject(request, env, key) {
  const object = await env.STORAGE_BUCKET.put(key, request.body);
  return new Response(JSON.stringify({
    key: object.key,
    version: object.version,
    etag: object.httpEtag
  }), {
    headers: { 'Content-Type': 'application/json' },
    status: 201
  });
}

async function deleteObject(request, env, key) {
  await env.STORAGE_BUCKET.delete(key);
  return new Response(null, { status: 204 });
}