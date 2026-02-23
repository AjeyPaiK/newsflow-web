import Link from "next/link";
import { fetchStoryPodcasts, getLanguageName, getStoryAudioStreamUrl } from "@/lib/api";

export const revalidate = 60;

const LANGUAGES = [
  { code: "en-IN", name: "English" },
  { code: "hi-IN", name: "Hindi" },
  { code: "bn-IN", name: "Bengali" },
  { code: "ta-IN", name: "Tamil" },
  { code: "te-IN", name: "Telugu" },
  { code: "kn-IN", name: "Kannada" },
  { code: "ml-IN", name: "Malayalam" },
  { code: "mr-IN", name: "Marathi" },
  { code: "gu-IN", name: "Gujarati" },
  { code: "pa-IN", name: "Punjabi" },
  { code: "od-IN", name: "Odia" },
];

type Props = { searchParams: Promise<{ language?: string }> };

export default async function StoriesPage({ searchParams }: Props) {
  const { language: langFilter } = await searchParams;
  const stories = await fetchStoryPodcasts(langFilter);

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
            <span className="text-[var(--foreground)]">Stories</span>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-14">
        <section className="mb-10">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
            Story podcasts
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Panchatantra and other story episodes—as audio in the language you prefer.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
            Language
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/stories"
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                !langFilter
                  ? "bg-[var(--accent)] text-[var(--background)]"
                  : "bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--accent)]/50"
              }`}
            >
              All
            </Link>
            {LANGUAGES.map(({ code, name }) => (
              <Link
                key={code}
                href={`/stories?language=${encodeURIComponent(code)}`}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  langFilter === code
                    ? "bg-[var(--accent)] text-[var(--background)]"
                    : "bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--accent)]/50"
                }`}
              >
                {name}
              </Link>
            ))}
          </div>
        </section>

        {stories.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-8 py-14 text-center text-[var(--muted)] shadow-sm">
            {langFilter
              ? `No story podcasts in ${getLanguageName(langFilter)} yet. Try another language or run the Panchatantra pipeline.`
              : "No story episodes yet. Run the Panchatantra pipeline (e.g. newsflow panchatantra-podcasts) to generate story podcasts in 11 Indian languages."}
          </div>
        ) : (
          <ul className="space-y-4">
            {stories.map((story) => (
              <li
                key={story.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition hover:border-[var(--accent)]/30"
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <h2 className="font-medium text-[var(--foreground)]">
                    {story.title}
                  </h2>
                  {story.language && (
                    <span className="rounded-md bg-[var(--accent)]/15 px-2 py-0.5 text-xs font-medium text-[var(--accent)]">
                      {getLanguageName(story.language)}
                    </span>
                  )}
                </div>
                <audio
                  controls
                  className="w-full"
                  src={getStoryAudioStreamUrl(story.filename)}
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
        Newsflow — Story podcasts in 11 languages
      </footer>
    </div>
  );
}
