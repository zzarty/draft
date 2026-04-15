"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { shuffleArray } from "@/lib/utils";
import { playBeep, playFinalBeep } from "@/lib/audio";

export interface SessionSettings {
  duration: number;
  shuffle: boolean;
  loop: boolean;
}

const TIMER_PRESETS = [
  { label: "30s", value: 30 },
  { label: "45s", value: 45 },
  { label: "1m", value: 60 },
  { label: "2m", value: 120 },
  { label: "5m", value: 300 },
  { label: "10m", value: 600 },
] as const;

export { TIMER_PRESETS };

/** Keep blob URLs for only a small window around the current index */
const URL_WINDOW = 2; // current ± 2

export function useSessionStore() {
  const [files, setFiles] = useState<File[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [settings, setSettings] = useState<SessionSettings>({
    duration: 60,
    shuffle: true,
    loop: true,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showSettings, setShowSettings] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // URL cache: index → blob URL. Only a small window is active at any time.
  const urlCacheRef = useRef<Map<number, string>>(new Map());

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Manage the blob URL window — create URLs near current, revoke distant ones
  const syncUrlWindow = useCallback(
    (index: number, fileList: File[]) => {
      const cache = urlCacheRef.current;
      const lo = Math.max(0, index - URL_WINDOW);
      const hi = Math.min(fileList.length - 1, index + URL_WINDOW);

      // Revoke URLs outside the window
      for (const [i, url] of cache) {
        if (i < lo || i > hi) {
          URL.revokeObjectURL(url);
          cache.delete(i);
        }
      }

      // Create URLs inside the window that don't exist yet
      for (let i = lo; i <= hi; i++) {
        if (!cache.has(i) && fileList[i]) {
          cache.set(i, URL.createObjectURL(fileList[i]));
        }
      }
    },
    []
  );

  const revokeAll = useCallback(() => {
    const cache = urlCacheRef.current;
    for (const url of cache.values()) {
      URL.revokeObjectURL(url);
    }
    cache.clear();
  }, []);

  /** Get the blob URL for the current image (already in cache from syncUrlWindow) */
  const getCurrentUrl = useCallback((): string | null => {
    return urlCacheRef.current.get(currentIndex) ?? null;
  }, [currentIndex]);

  const getCurrentName = useCallback((): string => {
    return files[currentIndex]?.name ?? "";
  }, [files, currentIndex]);

  // Sync URL window whenever index or files change
  useEffect(() => {
    if (files.length > 0) {
      syncUrlWindow(currentIndex, files);
    }
  }, [currentIndex, files, syncUrlWindow]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const len = files.length;
      if (len === 0) return prev;
      const next = prev + 1;
      if (next >= len) {
        if (settings.loop) {
          return 0;
        } else {
          setIsPlaying(false);
          clearTimer();
          return prev;
        }
      }
      return next;
    });
    setTimeLeft(settings.duration);
    // clearTimer + startTimer will be called by the effect that watches timeLeft
    // but for manual advances (button/keyboard) we restart here directly.
    clearTimer();
  }, [files.length, settings.loop, settings.duration, clearTimer]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
    setTimeLeft(settings.duration);
  }, [settings.duration]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleShuffle = useCallback(() => {
    setFiles((f) => {
      // Revoke old URLs before shuffling indices
      const cache = urlCacheRef.current;
      for (const url of cache.values()) {
        URL.revokeObjectURL(url);
      }
      cache.clear();
      return shuffleArray(f);
    });
    setCurrentIndex(0);
    setTimeLeft(settings.duration);
  }, [settings.duration]);

  const loadImages = useCallback(
    (fileList: FileList) => {
      const imageFiles: File[] = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (file.type.startsWith("image/")) {
          imageFiles.push(file);
        }
      }
      if (imageFiles.length > 0) {
        revokeAll();
        const ordered = settings.shuffle
          ? shuffleArray(imageFiles)
          : imageFiles;
        setFiles(ordered);
        setCurrentIndex(0);
        setTimeLeft(settings.duration);
      }
    },
    [settings.shuffle, settings.duration, revokeAll]
  );

  const startSession = useCallback(() => {
    if (files.length === 0) return;
    revokeAll();
    setCurrentIndex(0);
    setTimeLeft(settings.duration);
    setSessionActive(true);
    setIsPlaying(true);
    setShowSettings(false);
    if (settings.shuffle) {
      setFiles((f) => shuffleArray(f));
    }
  }, [files.length, settings.duration, settings.shuffle, revokeAll]);

  const stopSession = useCallback(() => {
    setSessionActive(false);
    setIsPlaying(false);
    clearTimer();
    setTimeLeft(settings.duration);
  }, [clearTimer, settings.duration]);

  // Start / restart the interval. Called whenever playback state changes
  // or after an advance resets timeLeft, ensuring the first tick is a full second.
  const startTimer = useCallback(() => {
    clearTimer();
    if (!isPlaying || !sessionActive) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 0;
        if (prev <= 4 && prev > 1) playBeep();
        return prev - 1;
      });
    }, 1000);
  }, [isPlaying, sessionActive, clearTimer]);

  // Restart interval when play state changes
  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [startTimer, clearTimer]);

  // Auto-advance when timer hits 0
  useEffect(() => {
    if (timeLeft === 0 && isPlaying && sessionActive) {
      playFinalBeep();
      // Advance index and reset timer, then restart interval so
      // the first tick happens a full second from now.
      setCurrentIndex((prev) => {
        const len = files.length;
        if (len === 0) return prev;
        const next = prev + 1;
        if (next >= len) {
          if (settings.loop) return 0;
          setIsPlaying(false);
          clearTimer();
          return prev;
        }
        return next;
      });
      setTimeLeft(settings.duration);
      startTimer();
    }
  }, [timeLeft, isPlaying, sessionActive, files.length, settings.loop, settings.duration, clearTimer, startTimer]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      switch (e.code) {
        case "Space":
          e.preventDefault();
          if (sessionActive) togglePlay();
          break;
        case "ArrowRight":
          e.preventDefault();
          if (sessionActive) goToNext();
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (sessionActive) goToPrev();
          break;
        case "KeyR":
          e.preventDefault();
          if (sessionActive) handleShuffle();
          break;
        case "Escape":
          e.preventDefault();
          setShowSettings((prev) => !prev);
          break;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sessionActive, togglePlay, goToNext, goToPrev, handleShuffle]);

  // Cleanup all blob URLs on unmount
  useEffect(() => {
    return () => {
      revokeAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    files,
    imageCount: files.length,
    currentIndex,
    currentUrl: getCurrentUrl(),
    currentName: getCurrentName(),
    settings,
    setSettings,
    isPlaying,
    timeLeft,
    showSettings,
    setShowSettings,
    sessionActive,
    togglePlay,
    goToNext,
    goToPrev,
    handleShuffle,
    loadImages,
    startSession,
    stopSession,
  };
}
