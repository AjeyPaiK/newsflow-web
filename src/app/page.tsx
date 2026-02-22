import Link from "next/link";
import { fetchNews } from "@/lib/api";

export const revalidate = 3600; // 1 hour
export const dynamic = "force-dynamic";

export default async function Home() {
  const news = await fetchNews();

  const byCategory = news.reduce<Record<string, typeof news>>((acc, item) => {
    const c = item.category || "general";
    if (!acc[c]) acc[c] = [];
    acc[c].push(item);
    return acc;
  }, {});

  const categories = ["trending", "politics", "culture", "government_initiatives"];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-5">
          <Link
            href="/"
            className="font-serif text-xl font-semibold tracking-tight text-[var(--foreground)] transition hover:text-[var(--accent)]"
          >
            Newsflow
          </Link>
          <nav className="flex gap-8 text-sm font-medium text-[var(--muted)]">
            <Link href="/podcasts" className="transition hover:text-[var(--foreground)]">
              Podcasts
            </Link>
            <a href="#news" className="transition hover:text-[var(--foreground)]">
              News
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-14">
        <section className="mb-16 text-center">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-[var(--foreground)] md:text-5xl">
            Your briefing, one place
          </h1>
          <p className="mt-3 text-lg text-[var(--muted)]">
            Aggregated from trusted sources. Watch the show.
          </p>
        </section>

        <section id="news" className="mb-20">
          <h2 className="font-serif mb-8 text-2xl font-semibold text-[var(--foreground)]">
            Aggregated news
          </h2>
          <div className="space-y-10">
            {categories.map((cat) => {
              const items = byCategory[cat] || [];
              if (items.length === 0) return null;
              const label = cat.replace(/_/g, " ");
              return (
                <div key={cat}>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                    {label}
                  </h3>
                  <ul className="space-y-1">
                    {items.slice(0, 8).map((item, i) => (
                      <li key={`${item.url}-${i}`}>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3.5 text-[var(--foreground)] shadow-sm transition hover:border-[var(--accent)]/30 hover:shadow"
                        >
                          <span className="font-medium">{item.title}</span>
                          {item.source && (
                            <span className="ml-2 text-xs text-[var(--muted)]">
                              ({item.source})
                            </span>
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
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-8 py-14 text-center text-[var(--muted)] shadow-sm">
              Could not load news. Ensure the API is running and CORS is configured.
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-[var(--border)] py-8 text-center text-sm text-[var(--muted)]">
        Newsflow — aggregated news & video briefs
      </footer>
    </div>
  );
}
