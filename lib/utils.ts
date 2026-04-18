import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Parse "30", "30s", "2m", "5m 30s" → seconds, or null if invalid */
export function parseDuration(raw: string): number | null {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) return null;

  // (?:(\d+)\s*m)? - optional minutes (number + 'm')
  // \s*            - optional whitespace between minutes and seconds
  // (?:(\d+)\s*s?)? - optional seconds (number + 's' or just a number)
  const match = trimmed.match(/^(?:(\d+)\s*m)?\s*(?:(\d+)\s*s?)?$/);

  if (!match || (!match[1] && !match[2])) return null;

  const minutes = match[1] ? parseInt(match[1], 10) : 0;
  const seconds = match[2] ? parseInt(match[2], 10) : 0;

  const totalSeconds = minutes * 60 + seconds;

  if (totalSeconds < 5 || totalSeconds > 3600) return null;
  return totalSeconds;
}

export function formatCustomDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}
