import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const cookieName = 'fuddlerr_cms_session';
const sessionMaxAgeSeconds = 60 * 60 * 8;

export function sendJson(response, statusCode, payload) {
  response.status(statusCode).json(payload);
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
  const parent = getValueAtPath(content, editPath.slice(0, -1));

  if (
    lastSegment === undefined ||
    parent === undefined ||
    parent === null ||
    typeof parent !== 'object' ||
    typeof parent[lastSegment] !== 'string'
  ) {
    throw new Error('Editable content path was not found');
  }

  parent[lastSegment] = value;
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
