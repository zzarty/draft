"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { formatTime } from "@/lib/utils";
import {
  Pause,
  Play,
  Settings,
  Shuffle,
  SkipBack,
  SkipForward,
  X,
} from "lucide-react";

interface ControlBarProps {
  isPlaying: boolean;
  timeLeft: number;
  duration: number;
  currentIndex: number;
  totalImages: number;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onShuffle: () => void;
  onSettings: () => void;
  onStop: () => void;
}

export function ControlBar({
  isPlaying,
  timeLeft,
  duration,
  currentIndex,
  totalImages,
  onTogglePlay,
  onNext,
  onPrev,
  onShuffle,
  onSettings,
  onStop,
}: ControlBarProps) {
  const progress = duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0;

  return (
    <>
      {/* Side bubbles — top corners on small screens, beside bar on large */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="fixed top-6 left-8 z-50 sm:hidden"
      >
        <SideCircleButton small onClick={onStop} title="Stop session">
          <X className="h-5 w-5" strokeWidth={2.5} />
        </SideCircleButton>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="fixed top-6 right-8 z-50 sm:hidden"
      >
        <SideCircleButton small onClick={onSettings} title="Settings (Esc)">
          <Settings className="h-5 w-5" />
        </SideCircleButton>
      </motion.div>

      {/* Main control bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="fixed z-50 bottom-8 left-8 right-8 sm:bottom-[26px] sm:left-1/2 sm:right-auto sm:-translate-x-1/2"
      >
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:block">
            <SideCircleButton onClick={onStop} title="Stop session">
              <X className="h-7 w-7" strokeWidth={2.5} />
            </SideCircleButton>
          </div>

          <div className="glass-strong flex h-12 sm:h-16.5 w-full sm:w-auto flex-col overflow-hidden rounded-4xl text-[15px]">
            <div className="h-0.5 w-full shrink-0 bg-white/6">
              <motion.div
                className="h-full bg-white/40"
                animate={{ width: progress + "%" }}
                transition={{ duration: 0.3, ease: "linear" }}
              />
            </div>

            <div className="flex flex-1 items-center justify-between px-4 sm:justify-start sm:gap-9 sm:px-5.5">
              <div className="flex items-center gap-4 sm:gap-9">
                <div className="flex items-center">
                  <ControlButton onClick={onShuffle} title="Shuffle (R)" tone="muted">
                    <Shuffle className="h-4 w-4 sm:h-5.5 sm:w-5.5" />
                  </ControlButton>
                </div>

                <div className="flex items-center gap-4">
                <ControlButton onClick={onPrev} title="Previous" tone="primary">
                  <SkipBack className="h-5 w-5 sm:h-7 sm:w-7" fill="currentColor" />
                </ControlButton>

                <motion.button
                  onClick={onTogglePlay}
                  title={isPlaying ? "Pause (Space)" : "Play (Space)"}
                  whileTap="active"
                  className="relative flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <motion.div
                    variants={{ active: { scale: 0 } }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="flex h-full w-full items-center justify-center"
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6 sm:h-8 sm:w-8" fill="currentColor" />
                    ) : (
                      <Play className="ml-0.5 h-6 w-6 sm:h-8 sm:w-8" fill="currentColor" />
                    )}
                  </motion.div>
                </motion.button>

                <ControlButton onClick={onNext} title="Next" tone="primary">
                  <SkipForward className="h-5 w-5 sm:h-7 sm:w-7" fill="currentColor" />
                </ControlButton>
              </div>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="min-w-13 px-2 text-center">
                  <span className="font-mono font-medium tabular-nums text-[13px] sm:text-[15px] text-white/80">
                    {formatTime(timeLeft)}
                  </span>
                </div>

                <div className="px-1.5 font-mono tabular-nums text-[13px] sm:text-[15px] text-white/40">
                  {currentIndex + 1}/{totalImages}
                </div>
              </div>
            </div>
          </div>

          <div className="hidden sm:block">
            <SideCircleButton onClick={onSettings} title="Settings (Esc)">
              <Settings className="h-7 w-7" />
            </SideCircleButton>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function SideCircleButton({
  onClick,
  title,
  children,
  small,
}: {
  onClick: () => void;
  title: string;
  children: ReactNode;
  small?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      title={title}
      whileTap={{ scale: 1.15, filter: "brightness(1.5)" }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={
        `glass-strong flex shrink-0 items-center justify-center rounded-full text-white transition-opacity cursor-pointer ${small ? "h-12 w-12" : "h-16.5 w-16.5"}`
      }
    >
      {children}
    </motion.button>
  );
}

function ControlButton({
  onClick,
  title,
  children,
  tone = "muted",
}: {
  onClick: () => void;
  title: string;
  children: ReactNode;
  tone?: "primary" | "muted";
}) {
  return (
    <motion.button
      onClick={onClick}
      title={title}
      whileTap="active"
      className={
        "flex h-7 w-7 items-center justify-center rounded-full transition-all cursor-pointer " +
        (tone === "primary"
          ? "text-white"
          : "text-white/60 hover:text-white")
      }
    >
      <motion.div
        variants={{ active: { scale: 0.5 } }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="flex h-full w-full items-center justify-center"
      >
        {children}
      </motion.div>
    </motion.button>
  );
}
