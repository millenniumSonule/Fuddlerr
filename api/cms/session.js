import { getCmsPassword, isAuthenticated, sendJson } from '../_cms.js';

export default function handler(request, response) {
  if (request.method !== 'GET') {
    sendJson(response, 405, { ok: false, message: 'Method Not Allowed' });
    return;
  }

  sendJson(response, 200, {
    ok: true,
    authenticated: isAuthenticated(request),
    configured: Boolean(getCmsPassword()),
  });
}
