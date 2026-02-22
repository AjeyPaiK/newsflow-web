import Link from "next/link";
import { fetchPodcasts, getAudioStreamUrl } from "@/lib/api";

export const revalidate = 60;

export default async function PodcastsPage() {
  const podcasts = await fetchPodcasts();

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
            <span className="text-[var(--foreground)]">Podcasts</span>
            <Link href="/" className="transition hover:text-[var(--foreground)]">
              News
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-14">
        <section className="mb-10">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
            Podcasts
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Audio recordings from the briefing. Listen on the go.
          </p>
        </section>

        {podcasts.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-8 py-14 text-center text-[var(--muted)] shadow-sm">
            No audio recordings yet. Check back after the next pipeline run.
          </div>
        ) : (
          <ul className="space-y-4">
            {podcasts.map((podcast) => (
              <li
                key={podcast.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition hover:border-[var(--accent)]/30"
              >
                <h2 className="mb-3 font-medium text-[var(--foreground)]">
                  {podcast.title}
                </h2>
                <audio
                  controls
                  className="w-full"
                  src={getAudioStreamUrl(podcast.filename)}
                  preload="metadata"
                >
                  Your browser does not support the audio element.
                </audio>
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer className="border-t border-[var(--border)] py-8 text-center text-sm text-[var(--muted)]">
        Newsflow — aggregated news & audio briefs
      </footer>
    </div>
  );
}
