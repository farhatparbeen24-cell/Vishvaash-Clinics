# Vishvaas Clinic — Eye & Dental Care, Dehradun

Production website for Vishvaas Clinic (Sahastradhara Road, Dehradun).
Single-page Next.js App Router site with a bilingual EN/हिंदी interface,
WhatsApp-first appointment requests, and a strict content-compliance policy
(only owner-verified photos and verbatim text; brand marks shown for
identification only).

## Stack

- **Next.js 16** (App Router, TypeScript) + **Tailwind CSS 4**
- next/image with fully local, verified assets in `public/images/`
- `next/font/google`: Fraunces (display), Manrope (body), Noto Sans Devanagari (हिंदी)
- No database, no server-side state — booking flows out via WhatsApp deep links

## Local development

```bash
bun install        # or npm install
npm run dev        # http://localhost:3000
```

| Script               | Purpose                                                        |
| -------------------- | -------------------------------------------------------------- |
| `npm run dev`        | Dev server on port 3000                                        |
| `npm run build`      | Production build (`next build --webpack`)                      |
| `npm run start`      | Serve the production build                                     |
| `npm run lint`       | ESLint                                                         |
| `npm run typecheck`  | Strict type check of app source (`tsconfig.check.json` scope)  |

## Deploying to Vercel

The repo is Vercel-ready with **zero extra configuration** — no `vercel.json`
needed. Vercel auto-detects Next.js from the lockfile and runs
`bun install` + `next build`.

1. Push this repository to GitHub (or GitLab/Bitbucket).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Framework preset: **Next.js** (auto-detected). Build command / output dir:
   leave at defaults.
4. Deploy. The first deployment works immediately on the `*.vercel.app` URL.
5. When the final production domain (e.g. `www.vishvaasclinics.com`) is live:
   - Add the domain in **Vercel → Project → Settings → Domains**.
   - Set the environment variable below and redeploy.

### Environment variables

| Variable               | Required | Description                                                                                                          |
| ---------------------- | -------- | -------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | No       | Production base URL, e.g. `https://www.vishvaasclinics.com`. Drives canonical URL, sitemap.xml, OG url and JSON-LD (see `src/lib/clinic.ts`). Falls back to the placeholder domain until set. |

No other environment variables, secrets or APIs are required — there is no
database and no server-side integration.

### Post-deploy checklist

- [ ] Custom domain added in Vercel + `NEXT_PUBLIC_SITE_URL` set and redeployed
- [ ] Canonical tag, `/sitemap.xml` and OG url now show the production domain
- [ ] WhatsApp booking verified: hero / services / doctors / contact CTAs all
      open `wa.me/917252991991` with the correct prefilled message
- [ ] EN ⇄ हिंदी switch persists and Hindi text renders correctly
- [ ] Doctor photos, gallery, Instagram/Facebook footer links render
- [ ] Submit `https://<domain>/sitemap.xml` in Google Search Console

## Build notes

- The build script pins `--webpack` because Turbopack panics in the original
  dev sandbox (documented in the project worklog). On Vercel you may remove
  the flag to try the default Turbopack build; webpack remains fully
  supported.
- `typescript.ignoreBuildErrors` stays enabled in `next.config.ts` as a deploy
  safety net; `npm run typecheck` is the real gate and passes clean.

## Repository hygiene

QA screenshots, stock-photo candidate downloads, owner photo originals
(`upload/`), the AI-imagery quarantine (`assets-excluded/`) and other
sandbox artifacts are intentionally **not tracked** in git — they remain on
the authoring machine only. Compliance/provenance documents that DO travel
with the repo:

- `download/hero-image-provenance.md` — full licensing/provenance table for hero imagery
- `download/final-handover/image-asset-register.md` — published vs. excluded asset register

Dead scaffold (Prisma/SQLite, websocket examples, unused heavy packages) was
removed for this deployment; the appointment flow never touches a server —
it composes a WhatsApp message client-side and opens the chat.
