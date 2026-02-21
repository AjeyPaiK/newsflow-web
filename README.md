# Newsflow Web

Frontend for **Newsflow**: watch aggregated news and video briefs. Built for **Vercel**.

- **Home**: Latest episodes (video grid) + aggregated news by category
- **Watch**: Video player for each episode

The app talks to the **Newsflow API** (hosted on Render). Set `NEXT_PUBLIC_API_URL` to your API base URL.

## Setup

```bash
cp .env.example .env.local
# Edit .env.local: set NEXT_PUBLIC_API_URL to your Render API URL
npm install
npm run dev
```

## Deploy on Vercel

1. Push this repo and import the project in Vercel.
2. Add environment variable: `NEXT_PUBLIC_API_URL` = your Render API URL (e.g. `https://newsflow-api.onrender.com`).
3. Deploy. Ensure the API allows your Vercel origin in `CORS_ORIGINS` (e.g. `https://your-app.vercel.app`).

## Repo separation

This repo is **separate** from the [Newsflow API/library](https://github.com/your-org/newsflow) repo. The API repo contains the Python library and FastAPI server (Render); this repo is the viewer (Vercel).
