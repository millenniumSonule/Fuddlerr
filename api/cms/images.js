import { getErrorMessage, getSupabase, requireAuthenticated, sendJson } from '../_cms.js';

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    sendJson(response, 405, { ok: false, message: 'Method Not Allowed' });
    return;
  }

  if (!requireAuthenticated(request, response)) return;

  try {
    const supabase = getSupabase();
    if (!supabase) {
      sendJson(response, 503, { ok: false, message: 'Supabase env vars are required for production image listings' });
      return;
    }

    const bucket = process.env.SUPABASE_CMS_BUCKET || 'cms-images';
    const { data, error } = await supabase.storage.from(bucket).list('uploads', {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error) throw error;

    const images = (data || [])
      .filter((item) => item.name)
      .map((item) => {
        const filePath = `uploads/${item.name}`;
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
        return {
          name: item.name,
          path: filePath,
          url: urlData.publicUrl,
        };
      });

    sendJson(response, 200, { ok: true, images });
  } catch (error) {
    sendJson(response, 500, {
      ok: false,
      message: getErrorMessage(error, 'Unable to load CMS images'),
    });
  }
}
