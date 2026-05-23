# MemeForge (Magicthon)

## Run locally (WSL or PowerShell)

```bash
cd /mnt/c/Users/Admin/roastcam   # WSL
# or: cd C:\Users\Admin\roastcam  # Windows

npm install
cp .env.example .env.local
# Add ANTHROPIC_API_KEY from https://console.anthropic.com/
npm run dev
```

Open http://localhost:3000

### If `npm install` was stopped with Ctrl+Z

That suspends the install halfway — it will look broken. Fix:

```bash
kill %1 2>/dev/null || true    # stop suspended job
rm -rf node_modules
npm install                    # let it finish — do NOT press Ctrl+Z
```

Deprecation warnings are mostly gone after removing unused `fabric` (canvas uses plain HTML5).

### Env

```env
ANTHROPIC_API_KEY=sk-ant-...
# Optional if your account uses a different model:
# ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
```

## Flow

1. Optional **context** + **spice** slider (wholesome ↔ savage)
2. Upload / paste / **webcam** / sample photos → **Forge 6 memes**
3. Six humor styles as live previews · **Shuffle** · **🎰 Feeling lucky**
4. Edit: swap template, **stickers**, export PNG
5. Share → `/m/[id]` reactions · **creator live feed** (`?creator=1`)
6. **Remix** any meme photo · **Meme wall** at `/wall`

## Bonus features (hackathon)

| Feature | Where |
|---------|--------|
| 🎰 I'm feeling lucky | Studio (auto-pick → edit) |
| 🏆 Live meme wall | `/wall` |
| ♻️ Remix | Share page → home studio |
| 😎 Sticker layer | Edit page |
| 📷 Webcam | Upload zone |
| 📡 Creator live feed | After share (`?creator=1`) |
| Try sample photos | Studio |

## Check API key (no Anthropic call)

```bash
curl http://localhost:3000/api/health
# anthropicKey: "configured" means .env.local is loaded
```

### Claude errors

| Error | Meaning |
|-------|---------|
| `anthropicKey: missing` | Add key to `.env.local`, restart `npm run dev` |
| `Invalid API key` | Wrong key — get a new one at console.anthropic.com |
| `network timeout` / `ETIMEDOUT` | **Not** a bad key — Wi‑Fi, VPN, or WSL network issue. Retry or run dev from Windows. |

You do **not** need to re-upload the key unless you deleted `.env.local` or the key was revoked.

## Deploy on Vercel

1. Push repo to GitHub
2. https://vercel.com → **Import** project
3. Environment variable: `ANTHROPIC_API_KEY`
4. Deploy

Local build (must pass before deploy):

```bash
npm run build
npm start
```

**Note:** Share links + reactions use `data/memes.json` locally. On Vercel serverless, file writes may not persist between requests — fine for demoing upload → forge → edit; for full share/wall in prod add [Vercel KV](https://vercel.com/docs/storage/vercel-kv) later.

Check: `GET /api/health` → `anthropicKey: "configured"`
# MemeForge
# Memeforge
