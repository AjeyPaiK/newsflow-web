const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface NewsItem {
  title: string;
  url: string;
  source: string;
  category: string;
  summary: string;
  published_at: string | null;
}

export interface VideoItem {
  id: string;
  title: string;
  filename: string;
  url: string;
  duration_seconds: number | null;
  created_at: string | null;
}

export interface AudioItem {
  id: string;
  title: string;
  filename: string;
  url: string;
  created_at: string | null;
  language: string | null;
}

export async function fetchNews(categories?: string): Promise<NewsItem[]> {
  try {
    const q = categories ? `?categories=${encodeURIComponent(categories)}` : "";
    const res = await fetch(`${API_URL}/news${q}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchVideos(): Promise<VideoItem[]> {
  try {
    const res = await fetch(`${API_URL}/videos`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const list: VideoItem[] = await res.json();
    return list.map((v) => ({
      ...v,
      url: `${API_URL}${v.url}`,
    }));
  } catch {
    return [];
  }
}

export function getStreamUrl(filename: string): string {
  return `${API_URL}/videos/${filename}/stream`;
}

const LANGUAGE_NAMES: Record<string, string> = {
  "en-IN": "English",
  "hi-IN": "Hindi",
  "bn-IN": "Bengali",
  "ta-IN": "Tamil",
  "te-IN": "Telugu",
  "kn-IN": "Kannada",
  "ml-IN": "Malayalam",
  "mr-IN": "Marathi",
  "gu-IN": "Gujarati",
  "pa-IN": "Punjabi",
  "od-IN": "Odia",
};

export async function fetchPodcasts(language?: string): Promise<AudioItem[]> {
  try {
    const q = language ? `?language=${encodeURIComponent(language)}` : "";
    const res = await fetch(`${API_URL}/audio${q}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const list: AudioItem[] = await res.json();
    return list.map((a) => ({
      ...a,
      url: `${API_URL}${a.url}`,
    }));
  } catch {
    return [];
  }
}

export function getLanguageName(code: string): string {
  return LANGUAGE_NAMES[code] ?? code;
}

export function getAudioStreamUrl(filename: string): string {
  return `${API_URL}/audio/${filename}/stream`;
}
