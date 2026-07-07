import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const contentFilePath = path.resolve(__dirname, 'src/data/content.json');
const cmsImageDir = path.resolve(__dirname, 'public/cms');
const cmsSessionCookie = 'fuddlerr_cms_session';

type ContentValue = string | number | boolean | null | ContentValue[] | { [key: string]: ContentValue };
type ServerEnv = Record<string, string>;

function readRequestBody(request: import('node:http').IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', () => resolve(body));
    request.on('error', reject);
  });
}

function getCookie(request: import('node:http').IncomingMessage, name: string) {
  const cookieHeader = request.headers.cookie || '';
  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
  const cookie = cookies.find((item) => item.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : '';
}

function sendJson(response: import('node:http').ServerResponse, statusCode: number, payload: Record<string, unknown>) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(payload));
}

function getValueAtPath(content: ContentValue, editPath: Array<string | number>) {
  return editPath.reduce<ContentValue | undefined>((current, segment) => {
    if (current === undefined || current === null || typeof current !== 'object') return undefined;
    return (current as Record<string, ContentValue> | ContentValue[])[segment as never];
  }, content);
}

function skipWhitespace(source: string, index: number) {
  while (/\s/.test(source[index] || '')) index += 1;
  return index;
}

function readStringRange(source: string, index: number) {
  let end = index + 1;
  let escaped = false;

  while (end < source.length) {
    const char = source[end];

    if (char === '"' && !escaped) {
      return { start: index, end: end + 1, value: JSON.parse(source.slice(index, end + 1)) as string };
    }

    escaped = char === '\\' && !escaped;
    if (char !== '\\') escaped = false;
    end += 1;
  }

  throw new Error('Invalid JSON string in content file');
}

function skipValue(source: string, index: number): number {
  index = skipWhitespace(source, index);
  const char = source[index];

  if (char === '"') return readStringRange(source, index).end;

  if (char === '{') {
    let depth = 1;
    index += 1;

    while (index < source.length && depth > 0) {
      if (source[index] === '"') {
        index = readStringRange(source, index).end;
        continue;
      }

      if (source[index] === '{') depth += 1;
      if (source[index] === '}') depth -= 1;
      index += 1;
    }

    return index;
  }

  if (char === '[') {
    let depth = 1;
    index += 1;

    while (index < source.length && depth > 0) {
      if (source[index] === '"') {
        index = readStringRange(source, index).end;
        continue;
      }

      if (source[index] === '[') depth += 1;
      if (source[index] === ']') depth -= 1;
      index += 1;
    }

    return index;
  }

  while (index < source.length && !/[\s,\]}]/.test(source[index])) index += 1;
  return index;
}

function findStringRangeAtPath(source: string, editPath: Array<string | number>, index = 0): { start: number; end: number } {
  index = skipWhitespace(source, index);

  if (editPath.length === 0) {
    if (source[index] !== '"') throw new Error('Editable content path does not point to a string');
    const range = readStringRange(source, index);
    return { start: range.start, end: range.end };
  }

  const [segment, ...remainingPath] = editPath;

  if (source[index] === '{') {
    index += 1;

    while (index < source.length) {
      index = skipWhitespace(source, index);
      if (source[index] === '}') break;

      const key = readStringRange(source, index);
      index = skipWhitespace(source, key.end);
      if (source[index] !== ':') throw new Error('Invalid JSON object in content file');
      index = skipWhitespace(source, index + 1);

      if (key.value === segment) return findStringRangeAtPath(source, remainingPath, index);

      index = skipValue(source, index);
      index = skipWhitespace(source, index);
      if (source[index] === ',') index += 1;
    }
  }

  if (source[index] === '[' && typeof segment === 'number') {
    index += 1;
    let itemIndex = 0;

    while (index < source.length) {
      index = skipWhitespace(source, index);
      if (source[index] === ']') break;

      if (itemIndex === segment) return findStringRangeAtPath(source, remainingPath, index);

      index = skipValue(source, index);
      index = skipWhitespace(source, index);
      if (source[index] === ',') index += 1;
      itemIndex += 1;
    }
  }

  throw new Error('Editable content path was not found');
}

function replaceStringAtPath(source: string, editPath: Array<string | number>, value: string) {
  const range = findStringRangeAtPath(source, editPath);
  return `${source.slice(0, range.start)}${JSON.stringify(value)}${source.slice(range.end)}`;
}

function safeFileName(fileName: string) {
  const extension = path.extname(fileName).toLowerCase();
  const baseName = path
    .basename(fileName, extension)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);

  return `${baseName || 'image'}-${Date.now()}${extension}`;
}

function getSupabase(env: ServerEnv): SupabaseClient | null {
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
    },
  });
}

async function readLocalContent() {
  return JSON.parse(await fs.readFile(contentFilePath, 'utf8')) as ContentValue;
}

async function readContent(env: ServerEnv) {
  const supabase = getSupabase(env);
  if (!supabase) return readLocalContent();

  const table = env.SUPABASE_CMS_TABLE || 'cms_content';
  const { data, error } = await supabase.from(table).select('content').eq('id', 'site').maybeSingle();
  if (error) throw error;

  return (data?.content as ContentValue | undefined) || readLocalContent();
}

async function writeContent(env: ServerEnv, content: ContentValue) {
  const supabase = getSupabase(env);
  if (!supabase) {
    await fs.writeFile(contentFilePath, `${JSON.stringify(content, null, 2)}\n`);
    return;
  }

  const table = env.SUPABASE_CMS_TABLE || 'cms_content';
  const { error } = await supabase.from(table).upsert({
    id: 'site',
    content,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

async function updateContentValue(editPath: Array<string | number>, value: unknown) {
  const source = await fs.readFile(contentFilePath, 'utf8');
  const content = JSON.parse(source) as ContentValue;
  const currentValue = getValueAtPath(content, editPath);

  if (currentValue === undefined) {
    let target = content as Record<string, ContentValue> | ContentValue[];
    for (let index = 0; index < editPath.length - 1; index += 1) {
      const segment = editPath[index];
      const nextSegment = editPath[index + 1];

      if (Array.isArray(target)) {
        if (target[segment as number] === undefined || target[segment as number] === null || typeof target[segment as number] !== 'object') {
          target[segment as number] = typeof nextSegment === 'number' ? [] : {};
        }
        target = target[segment as number] as Record<string, ContentValue> | ContentValue[];
        continue;
      }

      if (target[segment as string] === undefined || target[segment as string] === null || typeof target[segment as string] !== 'object') {
        target[segment as string] = typeof nextSegment === 'number' ? [] : {};
      }
      target = target[segment as string] as Record<string, ContentValue> | ContentValue[];

      if (Array.isArray(target) && typeof nextSegment === 'number') {
        continue;
      }
    }

    const lastSegment = editPath[editPath.length - 1];
    if (Array.isArray(target)) {
      target[lastSegment as number] = value as ContentValue;
    } else {
      target[lastSegment as string] = value as ContentValue;
    }
    await fs.writeFile(contentFilePath, `${JSON.stringify(content, null, 2)}\n`);
    return;
  }

  if (typeof currentValue === 'string' && typeof value === 'string') {
    await fs.writeFile(contentFilePath, replaceStringAtPath(source, editPath, value));
    return;
  }

  const nextContent = JSON.parse(source) as ContentValue;
  setValueAtPath(nextContent, editPath, value);
  await fs.writeFile(contentFilePath, `${JSON.stringify(nextContent, null, 2)}\n`);
}

function setValueAtPath(content: ContentValue, editPath: Array<string | number>, value: unknown) {
  const lastSegment = editPath.at(-1);
  let parent = content;

  if (lastSegment === undefined || parent === undefined || parent === null || typeof parent !== 'object') {
    throw new Error('Editable content path was not found');
  }

  for (let index = 0; index < editPath.length - 1; index += 1) {
    const segment = editPath[index];
    const nextSegment = editPath[index + 1];

    if (Array.isArray(parent)) {
      if (parent[segment as number] === undefined || parent[segment as number] === null || typeof parent[segment as number] !== 'object') {
        parent[segment as number] = typeof nextSegment === 'number' ? [] : {};
      }

      parent = parent[segment as number] as ContentValue;
      continue;
    }

    if (parent[segment as string] === undefined || parent[segment as string] === null || typeof parent[segment as string] !== 'object') {
      parent[segment as string] = typeof nextSegment === 'number' ? [] : {};
    }

    parent = parent[segment as string] as ContentValue;
  }

  const currentValue = getValueAtPath(content, editPath);
  const normalizedValue = typeof value === 'string' ? value : String(value);

  if (typeof currentValue === 'number') {
    const nextValue = Number(normalizedValue.trim());
    if (!Number.isFinite(nextValue)) throw new Error('Numeric content must be a valid number');
    if (Array.isArray(parent)) parent[lastSegment as number] = nextValue;
    else parent[lastSegment as string] = nextValue;
    return;
  }

  if (typeof currentValue === 'boolean') {
    if (normalizedValue.trim() === 'true') {
      if (Array.isArray(parent)) parent[lastSegment as number] = true;
      else parent[lastSegment as string] = true;
      return;
    }

    if (normalizedValue.trim() === 'false') {
      if (Array.isArray(parent)) parent[lastSegment as number] = false;
      else parent[lastSegment as string] = false;
      return;
    }

    throw new Error('Boolean content must be true or false');
  }

  if (typeof currentValue === 'string' || currentValue === undefined) {
    if (Array.isArray(parent)) parent[lastSegment as number] = normalizedValue;
    else parent[lastSegment as string] = normalizedValue;
    return;
  }

  throw new Error('Editable content path was not found');
}

function cmsContentPlugin(env: ServerEnv) {
  return {
    name: 'fuddlerr-cms-content-writer',
    configureServer(server: import('vite').ViteDevServer) {
      const sessions = new Set<string>();
      const supabase = getSupabase(env);
      const getCmsPassword = () => env.FUDDLERR_CMS_PASSWORD || '';
      const isPasswordBypassed = () => !getCmsPassword();
      const isAuthenticated = (request: import('node:http').IncomingMessage) => {
        if (isPasswordBypassed()) return true;
        const token = getCookie(request, cmsSessionCookie);
        return Boolean(token && sessions.has(token));
      };

      const requireAuthenticated = (
        request: import('node:http').IncomingMessage,
        response: import('node:http').ServerResponse
      ) => {
        if (isAuthenticated(request)) return true;
        sendJson(response, 401, { ok: false, message: 'CMS login required' });
        return false;
      };

      server.middlewares.use('/api/cms/session', async (request, response) => {
        if (request.method !== 'GET') {
          response.statusCode = 405;
          response.end('Method Not Allowed');
          return;
        }

        sendJson(response, 200, {
          ok: true,
          authenticated: isAuthenticated(request),
          configured: true,
        });
      });

      server.middlewares.use('/api/cms/login', async (request, response) => {
        if (request.method !== 'POST') {
          response.statusCode = 405;
          response.end('Method Not Allowed');
          return;
        }

        const configuredPassword = getCmsPassword();
        if (!configuredPassword) {
          sendJson(response, 200, { ok: true, bypassed: true });
          return;
        }

        try {
          const body = JSON.parse(await readRequestBody(request)) as { password?: string };

          if (body.password !== configuredPassword) {
            sendJson(response, 401, { ok: false, message: 'Invalid password' });
            return;
          }

          const token = crypto.randomBytes(32).toString('hex');
          sessions.add(token);
          response.setHeader(
            'Set-Cookie',
            `${cmsSessionCookie}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800`
          );
          sendJson(response, 200, { ok: true });
        } catch {
          sendJson(response, 400, { ok: false, message: 'Invalid login payload' });
        }
      });

      server.middlewares.use('/api/cms/logout', async (request, response) => {
        if (request.method !== 'POST') {
          response.statusCode = 405;
          response.end('Method Not Allowed');
          return;
        }

        const token = getCookie(request, cmsSessionCookie);
        if (token) sessions.delete(token);
        response.setHeader(
          'Set-Cookie',
          `${cmsSessionCookie}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`
        );
        sendJson(response, 200, { ok: true });
      });

      server.middlewares.use('/api/cms/content', async (request, response) => {
        if (request.method === 'GET') {
          try {
            sendJson(response, 200, await readContent(env) as Record<string, unknown>);
          } catch (error) {
            sendJson(response, 500, {
              ok: false,
              message: error instanceof Error ? error.message : 'Unable to read content',
            });
          }
          return;
        }

        if (request.method !== 'POST') {
          response.statusCode = 405;
          response.end('Method Not Allowed');
          return;
        }

        if (!requireAuthenticated(request, response)) return;

        try {
          const body = JSON.parse(await readRequestBody(request)) as {
            path?: Array<string | number>;
            value?: unknown;
          };

          if (!Array.isArray(body.path) || typeof body.value === 'undefined') {
            response.statusCode = 400;
            response.end('Invalid edit payload');
            return;
          }

          if (supabase) {
            const content = await readContent(env);
            setValueAtPath(content, body.path, body.value);
            await writeContent(env, content);
          } else {
            await updateContentValue(body.path, body.value);
          }

          server.ws.send({
            type: 'full-reload',
            path: '*',
          });

          response.setHeader('Content-Type', 'application/json');
          response.end(JSON.stringify({ ok: true }));
        } catch (error) {
          response.statusCode = 500;
          response.end(error instanceof Error ? error.message : 'Unable to save content edit');
        }
      });

      server.middlewares.use('/api/cms/image', async (request, response) => {
        if (request.method !== 'POST') {
          response.statusCode = 405;
          response.end('Method Not Allowed');
          return;
        }

        if (!requireAuthenticated(request, response)) return;

        try {
          const body = JSON.parse(await readRequestBody(request)) as {
            path?: Array<string | number>;
            fileName?: string;
            dataUrl?: string;
          };

          if (!Array.isArray(body.path) || !body.fileName || !body.dataUrl) {
            response.statusCode = 400;
            response.end('Invalid image payload');
            return;
          }

          const match = body.dataUrl.match(/^data:(image\/(?:png|jpeg|jpg|webp|gif|svg\+xml));base64,(.+)$/);
          if (!match) {
            response.statusCode = 400;
            response.end('Only PNG, JPG, WEBP, GIF, and SVG images are supported');
            return;
          }

          const fileName = safeFileName(body.fileName);
          let publicPath = `/cms/${fileName}`;

          if (supabase) {
            const bucket = env.SUPABASE_CMS_BUCKET || 'cms-images';
            const filePath = `uploads/${fileName}`;
            const { error: uploadError } = await supabase.storage
              .from(bucket)
              .upload(filePath, Buffer.from(match[2], 'base64'), {
                contentType: match[1],
                upsert: false,
              });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
            publicPath = data.publicUrl;

            const content = await readContent(env);
            setValueAtPath(content, body.path, publicPath);
            await writeContent(env, content);
          } else {
            await fs.mkdir(cmsImageDir, { recursive: true });
            await fs.writeFile(path.join(cmsImageDir, fileName), Buffer.from(match[2], 'base64'));
            await updateContentValue(body.path, publicPath);
          }

          server.ws.send({
            type: 'full-reload',
            path: '*',
          });

          response.setHeader('Content-Type', 'application/json');
          response.end(JSON.stringify({ ok: true, src: publicPath }));
        } catch (error) {
          response.statusCode = 500;
          response.end(error instanceof Error ? error.message : 'Unable to save image edit');
        }
      });

      server.middlewares.use('/api/cms/images', async (request, response) => {
        if (request.method !== 'GET') {
          response.statusCode = 405;
          response.end('Method Not Allowed');
          return;
        }

        if (!requireAuthenticated(request, response)) return;

        try {
          let images: Array<{ name: string; path: string; url: string }> = [];

          if (supabase) {
            const bucket = env.SUPABASE_CMS_BUCKET || 'cms-images';
            const { data, error } = await supabase.storage.from(bucket).list('uploads', {
              limit: 100,
              sortBy: { column: 'created_at', order: 'desc' },
            });

            if (error) throw error;

            images = (data || [])
              .filter((entry) => entry.name)
              .map((entry) => {
                const filePath = `uploads/${entry.name}`;
                const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
                return {
                  name: entry.name,
                  path: filePath,
                  url: urlData.publicUrl,
                };
              });
          } else {
            await fs.mkdir(cmsImageDir, { recursive: true });
            const entries = await fs.readdir(cmsImageDir, { withFileTypes: true });
            images = entries
              .filter((entry) => entry.isFile())
              .map((entry) => ({
                name: entry.name,
                path: `/cms/${entry.name}`,
                url: `/cms/${entry.name}`,
              }));
          }

          response.setHeader('Content-Type', 'application/json');
          response.end(JSON.stringify({ ok: true, images }));
        } catch (error) {
          response.statusCode = 500;
          response.end(error instanceof Error ? error.message : 'Unable to load CMS images');
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), cmsContentPlugin(env)],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
