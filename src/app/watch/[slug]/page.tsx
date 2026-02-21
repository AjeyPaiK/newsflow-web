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
    <div className="min-h-screen bg-[#0c0e12] text-zinc-100">
      <header className="border-b border-zinc-800/80 bg-[#0c0e12]/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4">
          <Link
            href="/"
            className="text-zinc-400 transition hover:text-amber-400"
            aria-label="Back to home"
          >
            ← Back
          </Link>
          <span className="text-xl font-bold tracking-tight text-amber-400">Newsflow</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-white">{video.title}</h1>
        </div>
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-black">
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
        <p className="mt-4 text-sm text-zinc-500">
          From the Newsflow briefing. Headlines from Punjab Kesari, Dainik Jagran, The Tribune &
          The Print.
        </p>
      </main>
    </div>
  );
}
