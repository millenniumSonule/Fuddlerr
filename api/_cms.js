import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const cookieName = 'fuddlerr_cms_session';
const sessionMaxAgeSeconds = 60 * 60 * 8;

export function sendJson(response, statusCode, payload) {
  response.status(statusCode).json(payload);
}

export function getErrorMessage(error, fallback = 'Unknown error') {
  if (error instanceof Error && error.message) return error.message;
  if (error && typeof error === 'object') {
    if (typeof error.message === 'string' && error.message) return error.message;
    if (typeof error.error_description === 'string' && error.error_description) return error.error_description;
    if (typeof error.error === 'string' && error.error) return error.error;
  }

  return fallback;
}

export function getCmsPassword() {
  return process.env.FUDDLERR_CMS_PASSWORD || '';
}

function getSessionSecret() {
  return process.env.CMS_SESSION_SECRET || getCmsPassword();
}

function base64UrlEncode(value) {
  return Buffer.from(value).toString('base64url');
}

function base64UrlDecode(value) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function sign(value) {
  return crypto.createHmac('sha256', getSessionSecret()).update(value).digest('base64url');
}

export function createSessionCookie() {
  const payload = base64UrlEncode(JSON.stringify({ exp: Date.now() + sessionMaxAgeSeconds * 1000 }));
  const signature = sign(payload);
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${cookieName}=${payload}.${signature}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${sessionMaxAgeSeconds}${secure}`;
}

export function clearSessionCookie() {
  return `${cookieName}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
}

export function isAuthenticated(request) {
  const token = request.cookies?.[cookieName];
  if (!token || !getSessionSecret()) return false;

  const [payload, signature] = token.split('.');
  if (!payload || !signature || sign(payload) !== signature) return false;

  try {
    const session = JSON.parse(base64UrlDecode(payload));
    return typeof session.exp === 'number' && session.exp > Date.now();
  } catch {
    return false;
  }
}

export function requireAuthenticated(request, response) {
  if (isAuthenticated(request)) return true;
  sendJson(response, 401, { ok: false, message: 'CMS login required' });
  return false;
}

export function getDefaultContent() {
  const filePath = path.join(process.cwd(), 'src/data/content.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: {
      persistSession: false,
    },
  });
}

export async function readContent() {
  const supabase = getSupabase();
  if (!supabase) return getDefaultContent();

  const table = process.env.SUPABASE_CMS_TABLE || 'cms_content';
  const { data, error } = await supabase.from(table).select('content').eq('id', 'site').maybeSingle();
  if (error) throw error;
  return data?.content || getDefaultContent();
}

export async function writeContent(content) {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase env vars are required for production CMS writes');
  }

  const table = process.env.SUPABASE_CMS_TABLE || 'cms_content';
  const { error } = await supabase.from(table).upsert({
    id: 'site',
    content,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export function getValueAtPath(content, editPath) {
  return editPath.reduce((current, segment) => {
    if (current === undefined || current === null || typeof current !== 'object') return undefined;
    return current[segment];
  }, content);
}

export function setValueAtPath(content, editPath, value) {
  const lastSegment = editPath.at(-1);
  let parent = content;

  if (
    lastSegment === undefined ||
    parent === undefined ||
    parent === null ||
    typeof parent !== 'object'
  ) {
    throw new Error('Editable content path was not found');
  }

  for (let index = 0; index < editPath.length - 1; index += 1) {
    const segment = editPath[index];
    const nextSegment = editPath[index + 1];

    if (Array.isArray(parent)) {
      if (parent[segment] === undefined || parent[segment] === null || typeof parent[segment] !== 'object') {
        parent[segment] = typeof nextSegment === 'number' ? [] : {};
      }

      parent = parent[segment];
      continue;
    }

    if (typeof parent !== 'object') {
      throw new Error('Editable content path was not found');
    }

    if (parent[segment] === undefined || parent[segment] === null || typeof parent[segment] !== 'object') {
      parent[segment] = typeof nextSegment === 'number' ? [] : {};
    }

    parent = parent[segment];
  }

  const currentValue = getValueAtPath(content, editPath);

  if (typeof currentValue === 'number') {
    const nextValue = Number(value.trim());
    if (!Number.isFinite(nextValue)) {
      throw new Error('Numeric content must be a valid number');
    }

    parent[lastSegment] = nextValue;
    return;
  }

  if (typeof currentValue === 'boolean') {
    if (value.trim() === 'true') {
      parent[lastSegment] = true;
      return;
    }

    if (value.trim() === 'false') {
      parent[lastSegment] = false;
      return;
    }

    throw new Error('Boolean content must be true or false');
  }

  if (typeof currentValue === 'string') {
    parent[lastSegment] = value;
    return;
  }

  if (currentValue === undefined) {
    parent[lastSegment] = value;
    return;
  }

  throw new Error('Editable content path was not found');
}

export function safeFileName(fileName) {
  const extension = path.extname(fileName).toLowerCase();
  const baseName = path
    .basename(fileName, extension)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);

  return `${Date.now()}-${baseName || 'image'}${extension}`;
}
