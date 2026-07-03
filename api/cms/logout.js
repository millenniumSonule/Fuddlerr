import { clearSessionCookie, sendJson } from '../_cms.js';

export default function handler(request, response) {
  if (request.method !== 'POST') {
    sendJson(response, 405, { ok: false, message: 'Method Not Allowed' });
    return;
  }

  response.setHeader('Set-Cookie', clearSessionCookie());
  sendJson(response, 200, { ok: true });
}
