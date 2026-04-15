"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { SessionSettings } from "@/app/use-session";
import { SettingsControls } from "@/app/components/settings-controls";

interface SettingsPanelProps {
  settings: SessionSettings;
  onSettingsChange: (settings: SessionSettings) => void;
  onClose: () => void;
  imageCount: number;
  onStartSession: () => void;
  sessionActive: boolean;
}

export function SettingsPanel({
  settings,
  onSettingsChange,
  onClose,
  imageCount,
  onStartSession,
  sessionActive,
}: SettingsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong rounded-4xl p-5.5 w-full max-w-sm mx-4 text-[17px]"
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2.5">
            <h2 className="font-semibold">Session Settings</h2>
            <p className="text-muted-foreground">
              Adjust timing and playback for this session.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/6 hover:text-foreground cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <SettingsControls
          settings={settings}
          onSettingsChange={onSettingsChange}
          imageCount={imageCount}
          onStartSession={onStartSession}
          sessionActive={sessionActive}
        />
      </motion.div>
    </motion.div>
  );
}
