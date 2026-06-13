# Deploying Outside Lovable

This project now has **two parallel build pipelines**:

| Pipeline | Config | Output | Used by |
|---|---|---|---|
| **Lovable (SSR, Cloudflare Workers)** | `vite.config.ts` + `wrangler.jsonc` | `dist/client` + `dist/server` | Lovable editor preview & `*.lovable.app` |
| **Static SPA (Netlify / Hostinger / CF Pages)** | `vite.netlify.config.ts` + `netlify.toml` | `dist/` with `index.html` + `assets/` | Your own hosting |

The two pipelines are independent. Editing in Lovable continues to work; deploying to Netlify uses the new config.

---

## Deploy to Netlify (recommended)

### One-time setup
1. Push this repo to GitHub (already done).
2. Go to <https://app.netlify.com> → **Add new site → Import from GitHub** → pick `devsmultispecialityclinic`.
3. Netlify auto-detects `netlify.toml`. Confirm:
   - **Build command:** `vite build --config vite.netlify.config.ts`
   - **Publish directory:** `dist`
4. Add environment variables under **Site settings → Environment variables**:
   ```
   VITE_SUPABASE_URL              = https://fuvcxmnxiodggftbkvrc.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY  = <your anon key from .env>
   VITE_SUPABASE_PROJECT_ID       = fuvcxmnxiodggftbkvrc
   ```
   (Copy values verbatim from `.env`. No service-role key is needed — Netlify hosts only the static frontend.)
5. **Deploy site.**

### Custom domain (Hostinger DNS → Netlify)
1. In Netlify: **Domain settings → Add custom domain** → enter `yourdomain.com`.
2. In Hostinger DNS panel, add the records Netlify shows you:
   - `A` record `@` → `75.2.60.5` (Netlify's load balancer)
   - `CNAME` record `www` → `<your-site>.netlify.app`
3. Netlify provisions a free SSL cert automatically (5–10 min).

### How AI chat keeps working
`netlify.toml` proxies `/api/*` to `https://devsmultispecialityclinic.lovable.app/api/*`. The Lovable-hosted backend serves the AI assistant. **Do NOT unpublish your Lovable project** or the chat will break.

If you ever fully shut down the Lovable hosting, you'll need to either:
- Migrate `src/routes/api/chat.ts` to a Netlify Function, OR
- Disable the AI assistant in `src/components/site/FloatingActions.tsx`.

---

## Deploy to Hostinger shared hosting (cheapest)
Hostinger shared hosting only serves static files (no Node, no proxies).
1. Run locally: `bun install && bun x vite build --config vite.netlify.config.ts`
2. Upload everything inside `dist/` to your Hostinger `public_html/` via File Manager or FTP.
3. The included `public/.htaccess` handles SPA refresh / deep-link routing.
4. ⚠️ **AI chat will not work on Hostinger** — there's no way to proxy `/api/chat`. Use Netlify if you want the assistant.

---

## Deploy to Cloudflare Pages
1. Connect the GitHub repo at <https://pages.cloudflare.com>.
2. Build command: `vite build --config vite.netlify.config.ts`
3. Build output directory: `dist`
4. Add the same `VITE_*` env vars as Netlify.
5. For SPA + `/api` proxy, create `public/_redirects` (already included).

---

## Environment variables (full list)

| Variable | Where | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | Build env on host | Browser Supabase client |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Build env on host | Browser Supabase client (anon key, safe to expose) |
| `VITE_SUPABASE_PROJECT_ID` | Build env on host | Optional, used by integrations |

**Not needed on Netlify/Hostinger** (these stay on the Lovable backend that hosts `/api/chat`):
- `LOVABLE_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` (unprefixed)

---

## Local verification before deploying
```bash
bun install
bun x vite build --config vite.netlify.config.ts
bun x vite preview --config vite.netlify.config.ts
# open http://localhost:4173 — full site should load except /api/chat
# (which only works once deployed behind the Netlify proxy)
```
