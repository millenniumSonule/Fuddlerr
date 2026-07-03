# Fuddlerr

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-zusqr9qj)

## Production CMS on Vercel

The `/edit` CMS works locally through Vite middleware. In production on Vercel, edits are stored in Supabase because deployed Vercel functions cannot permanently write back to `src/data/content.json`.

### Vercel environment variables

Set these in your Vercel project settings:

```bash
FUDDLERR_CMS_PASSWORD=your-admin-password
CMS_SESSION_SECRET=your-long-random-session-secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_CMS_TABLE=cms_content
SUPABASE_CMS_BUCKET=cms-images
```

`SUPABASE_SERVICE_ROLE_KEY` must stay server-side only. Do not expose it with a `VITE_` prefix.

### Supabase setup

Create the content table:

```sql
create table if not exists public.cms_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz default now()
);
```

Create a public storage bucket named `cms-images` for uploaded CMS images. The site stores uploaded image URLs in the content JSON.

### First deployment

Deploy to Vercel after setting the env vars. The production API falls back to `src/data/content.json` until the first CMS save creates the `cms_content` row in Supabase.
