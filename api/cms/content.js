import { getErrorMessage, readContent, requireAuthenticated, sendJson, setValueAtPath, writeContent } from '../_cms.js';

export default async function handler(request, response) {
  if (request.method === 'GET') {
    try {
      sendJson(response, 200, await readContent());
    } catch (error) {
      sendJson(response, 500, { ok: false, message: error instanceof Error ? error.message : 'Unable to read content' });
    }
    return;
  }

  if (request.method !== 'POST') {
    sendJson(response, 405, { ok: false, message: 'Method Not Allowed' });
    return;
  }

  if (!requireAuthenticated(request, response)) return;

  try {
    const { path, value } = request.body || {};
    if (!Array.isArray(path) || typeof value !== 'string') {
      sendJson(response, 400, { ok: false, message: 'Invalid edit payload' });
      return;
    }

    const content = await readContent();
    setValueAtPath(content, path, value);
    await writeContent(content);
    sendJson(response, 200, { ok: true, content });
  } catch (error) {
    sendJson(response, 500, {
      ok: false,
      message: getErrorMessage(error, 'Unable to save content edit'),
    });
  }
}
