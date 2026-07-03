import { createSessionCookie, getCmsPassword, sendJson } from '../_cms.js';

export default function handler(request, response) {
  if (request.method !== 'POST') {
    sendJson(response, 405, { ok: false, message: 'Method Not Allowed' });
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

  if (request.body?.password !== configuredPassword) {
    sendJson(response, 401, { ok: false, message: 'Invalid password' });
    return;
  }

  response.setHeader('Set-Cookie', createSessionCookie());
  sendJson(response, 200, { ok: true });
}
