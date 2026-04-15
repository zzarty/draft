"use client";

import { Repeat, Shuffle as ShuffleIcon } from "lucide-react";
import type { SessionSettings } from "@/app/use-session";
import { DurationPicker } from "@/app/components/ui/duration-picker";
import { ToggleRow } from "@/app/components/ui/toggle-row";

interface SettingsControlsProps {
  settings: SessionSettings;
  onSettingsChange: (settings: SessionSettings) => void;
  imageCount: number;
  onStartSession: () => void;
  sessionActive?: boolean;
}

export function SettingsControls({
  settings,
  onSettingsChange,
  imageCount,
  onStartSession,
  sessionActive = false,
}: SettingsControlsProps) {
  return (
    <>
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-2 px-2 text-[17px] text-muted-foreground">
          <span>Duration per image</span>
        </div>

        <DurationPicker
          duration={settings.duration}
          onChange={(duration) => onSettingsChange({ ...settings, duration })}
        />
      </div>

      <div className={imageCount > 0 ? "mb-6" : ""}>
        <div className="glass overflow-hidden rounded-[20px]">
          <ToggleRow
            grouped
            icon={<ShuffleIcon className="h-4 w-4" />}
            label="Shuffle images"
            checked={settings.shuffle}
            onChange={(shuffle) => onSettingsChange({ ...settings, shuffle })}
          />

          <div className="mx-2 h-px bg-white/8" />

          <ToggleRow
            grouped
            icon={<Repeat className="h-4 w-4" />}
            label="Loop when finished"
            checked={settings.loop}
            onChange={(loop) => onSettingsChange({ ...settings, loop })}
          />
        </div>
      </div>

      {imageCount > 0 && (
        <button
          onClick={onStartSession}
          className="h-12 w-full rounded-full bg-white/10 text-[17px] text-white transition-colors hover:bg-white/15 cursor-pointer"
        >
          {sessionActive ? "Restart Session" : "Start Session"} ({imageCount}{" "}
          images)
        </button>
      )}
    </>
  );
}
