# PratTasques · React + Cloudflare Workers + D1 (SQLite)

Exemple del mòdul 0492 Projecte intermodular (DAM2, PratFP).
Web de tasques feta amb React (Vite) i una API al mateix Worker que desa les dades a una base de dades **D1** (SQLite).

## Estructura

| Carpeta / fitxer | Què hi ha |
|---|---|
| `src/` | Frontend en React |
| `worker/index.ts` | API: `GET/POST /api/tasques`, `PATCH/DELETE /api/tasques/:id` |
| `migrations/` | Fitxers SQL que creen i modifiquen les taules |
| `wrangler.jsonc` | Configuració de Cloudflare (nom del Worker i base de dades) |

## Treballar en local

```bash
npm install
npm run db:local   # crea les taules a la base de dades local
npm run dev        # http://localhost:5173
```

## Desplegament

Cada `git push` a `main` el publica Cloudflare (Workers Builds).
Ordre de desplegament configurada al panell:

```bash
npm run db:remote && npx wrangler deploy
```
