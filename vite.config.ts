import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const contentFilePath = path.resolve(__dirname, 'src/data/content.json');
const cmsImageDir = path.resolve(__dirname, 'public/cms');
const cmsSessionCookie = 'fuddlerr_cms_session';

type ContentValue = string | number | boolean | null | ContentValue[] | { [key: string]: ContentValue };

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

async function updateContentString(editPath: Array<string | number>, value: string) {
  const source = await fs.readFile(contentFilePath, 'utf8');
  const content = JSON.parse(source) as ContentValue;

  if (typeof getValueAtPath(content, editPath) !== 'string') {
    throw new Error('Editable content path was not found');
  }

  await fs.writeFile(contentFilePath, replaceStringAtPath(source, editPath, value));
}

function cmsContentPlugin() {
  return {
    name: 'fuddlerr-cms-content-writer',
    configureServer(server: import('vite').ViteDevServer) {
      const sessions = new Set<string>();
      const getCmsPassword = () => process.env.FUDDLERR_CMS_PASSWORD || '';
      const isAuthenticated = (request: import('node:http').IncomingMessage) => {
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
          configured: Boolean(getCmsPassword()),
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
          sendJson(response, 503, {
            ok: false,
            message: 'Set FUDDLERR_CMS_PASSWORD before using /edit',
          });
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
            response.setHeader('Content-Type', 'application/json');
            response.end(await fs.readFile(contentFilePath, 'utf8'));
          } catch (error) {
            response.statusCode = 500;
            response.end(error instanceof Error ? error.message : 'Unable to read content');
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
            value?: string;
          };

          if (!Array.isArray(body.path) || typeof body.value !== 'string') {
            response.statusCode = 400;
            response.end('Invalid edit payload');
            return;
          }

          await updateContentString(body.path, body.value);

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

          await fs.mkdir(cmsImageDir, { recursive: true });
          const fileName = safeFileName(body.fileName);
          const publicPath = `/cms/${fileName}`;
          await fs.writeFile(path.join(cmsImageDir, fileName), Buffer.from(match[2], 'base64'));
          await updateContentString(body.path, publicPath);

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
          await fs.mkdir(cmsImageDir, { recursive: true });
          const entries = await fs.readdir(cmsImageDir, { withFileTypes: true });
          const images = entries
            .filter((entry) => entry.isFile())
            .map((entry) => ({
              name: entry.name,
              path: `/cms/${entry.name}`,
              url: `/cms/${entry.name}`,
            }));

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

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cmsContentPlugin()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
