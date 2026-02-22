# Newsflow Web

Frontend for **Newsflow**: watch aggregated news and video briefs. Built for **Vercel**.

- **Home**: Latest episodes (video grid) + aggregated news by category
- **Watch**: Video player for each episode

The app talks to the **Newsflow API** (hosted on Render). Set `NEXT_PUBLIC_API_URL` to your API base URL.

## How to get a video on the page (local)

1. **Generate a video** (in the [newsflow](https://github.com/your-org/newsflow) repo):
   ```bash
   cd /path/to/newsflow
   newsflow --no-youtube-upload
   ```
   This writes timestamped videos to `output/videos/` (e.g. `video_brief_20250222_120000.mp4`).

2. **Start the Newsflow API** so it serves those files:
   ```bash
   cd /path/to/newsflow
   export NEWSFLOW_OUTPUT_DIR=/path/to/newsflow/output   # or run from newsflow dir so default "output" works
   python -m uvicorn api.main:app --host 0.0.0.0 --port 8000
   ```
   The API lists and streams videos from `NEWSFLOW_OUTPUT_DIR` (default `output`).

3. **Point the frontend at the API** and run it:
   ```bash
   cd /path/to/newsflow-web
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
   npm install && npm run dev
   ```

4. **Open the site** (e.g. http://localhost:3000). You should see "Latest episodes" with your videos. Click one → you get the **Watch** page with the `<video>` player. The player’s `src` is `http://localhost:8000/videos/<filename>/stream`.

If the video doesn’t load: ensure the API is reachable at `NEXT_PUBLIC_API_URL`, that `output` (or `NEWSFLOW_OUTPUT_DIR`) contains `.mp4` files, and that you’re opening the **Watch** page (click a video from the home grid).

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
