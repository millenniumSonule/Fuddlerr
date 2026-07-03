import {
  getSupabase,
  readContent,
  requireAuthenticated,
  safeFileName,
  sendJson,
  setValueAtPath,
  writeContent,
} from '../_cms.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    sendJson(response, 405, { ok: false, message: 'Method Not Allowed' });
    return;
  }

  if (!requireAuthenticated(request, response)) return;

  try {
    const supabase = getSupabase();
    if (!supabase) {
      sendJson(response, 503, { ok: false, message: 'Supabase env vars are required for production image uploads' });
      return;
    }

    const { path, fileName, dataUrl } = request.body || {};
    if (!Array.isArray(path) || !fileName || !dataUrl) {
      sendJson(response, 400, { ok: false, message: 'Invalid image payload' });
      return;
    }

    const match = dataUrl.match(/^data:(image\/(?:png|jpeg|jpg|webp|gif|svg\+xml));base64,(.+)$/);
    if (!match) {
      sendJson(response, 400, { ok: false, message: 'Only PNG, JPG, WEBP, GIF, and SVG images are supported' });
      return;
    }

    const bucket = process.env.SUPABASE_CMS_BUCKET || 'cms-images';
    const storedFileName = safeFileName(fileName);
    const filePath = `uploads/${storedFileName}`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, Buffer.from(match[2], 'base64'), {
        contentType: match[1],
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    const content = await readContent();
    setValueAtPath(content, path, data.publicUrl);
    await writeContent(content);

    sendJson(response, 200, { ok: true, src: data.publicUrl, content });
  } catch (error) {
    sendJson(response, 500, { ok: false, message: error instanceof Error ? error.message : 'Unable to save image edit' });
  }
}
