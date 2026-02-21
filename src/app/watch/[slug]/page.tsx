import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchVideos, getStreamUrl } from "@/lib/api";

export const revalidate = 60;

export default async function WatchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const videos = await fetchVideos();
  const video = videos.find((v) => v.filename === decoded || v.id === decoded);
  if (!video) notFound();

  const streamUrl = getStreamUrl(video.filename);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-5">
          <Link
            href="/"
            className="text-[var(--muted)] transition hover:text-[var(--foreground)]"
            aria-label="Back to home"
          >
            ← Back
          </Link>
          <span className="font-serif text-xl font-semibold tracking-tight text-[var(--accent)]">
            Newsflow
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-4">
          <h1 className="font-serif text-2xl font-semibold text-[var(--foreground)]">
            {video.title}
          </h1>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
          <video
            key={streamUrl}
            controls
            autoPlay
            className="w-full"
            src={streamUrl}
            poster=""
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </main>
    </div>
  );
}
