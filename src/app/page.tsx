import Link from "next/link";
import { fetchNews, fetchVideos, getStreamUrl } from "@/lib/api";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export default async function Home() {
  const [news, videos] = await Promise.all([fetchNews(), fetchVideos()]);

  const byCategory = news.reduce<Record<string, typeof news>>((acc, item) => {
    const c = item.category || "general";
    if (!acc[c]) acc[c] = [];
    acc[c].push(item);
    return acc;
  }, {});

  const categories = ["trending", "politics", "culture", "government_initiatives"];

  return (
    <div className="min-h-screen bg-[#0c0e12] text-zinc-100">
      <header className="border-b border-zinc-800/80 bg-[#0c0e12]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight text-amber-400">
            Newsflow
          </Link>
          <nav className="flex gap-6 text-sm text-zinc-400">
            <a href="#news">News</a>
            <a href="#videos">Videos</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="mb-16 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Your briefing, one place
          </h1>
        </section>

        <section id="videos" className="mb-20">
          <h2 className="mb-6 text-2xl font-semibold text-white">Latest episodes</h2>
          {videos.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-6 py-12 text-center text-zinc-500">
              No episodes yet. Check back after the next run.
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-zinc-800 bg-black">
              <video
                key={getStreamUrl(videos[0].filename)}
                controls
                className="w-full"
                src={getStreamUrl(videos[0].filename)}
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
              <p className="mt-2 text-sm text-zinc-400">{videos[0].title}</p>
            </div>
          )}
        </section>

        <section id="news" className="mb-20">
          <h2 className="mb-6 text-2xl font-semibold text-white">Aggregated news</h2>
          <div className="space-y-10">
            {categories.map((cat) => {
              const items = byCategory[cat] || [];
              if (items.length === 0) return null;
              const label = cat.replace(/_/g, " ");
              return (
                <div key={cat}>
                  <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-amber-400/90">
                    {label}
                  </h3>
                  <ul className="space-y-2">
                    {items.slice(0, 8).map((item, i) => (
                      <li key={`${item.url}-${i}`}>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-4 py-3 text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800/50 hover:text-white"
                        >
                          <span className="font-medium">{item.title}</span>
                          {item.source && (
                            <span className="ml-2 text-xs text-zinc-500">({item.source})</span>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          {news.length === 0 && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-6 py-12 text-center text-zinc-500">
              Could not load news. Ensure the API is running and CORS is configured.
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-zinc-800/80 py-6 text-center text-sm text-zinc-500">
        Newsflow — aggregated news & video briefs
      </footer>
    </div>
  );
}
