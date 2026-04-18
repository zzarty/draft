"use client";

import { useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { TIMER_PRESETS } from "@/app/use-session";
import { parseDuration, formatCustomDuration } from "@/lib/utils";

interface DurationPickerProps {
  duration: number;
  onChange: (value: number) => void;
}

export function DurationPicker({
  duration,
  onChange,
}: DurationPickerProps) {
  const [editing, setEditing] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isPreset = TIMER_PRESETS.some((preset) => preset.value === duration);

  const startEditing = () => {
    setCustomValue(isPreset ? "" : formatCustomDuration(duration));
    setEditing(true);
    window.setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const commit = () => {
    const seconds = parseDuration(customValue);
    if (seconds !== null) {
      onChange(seconds);
    }
    setEditing(false);
  };

  const cancel = () => {
    setEditing(false);
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {TIMER_PRESETS.map((preset) => (
        <button
          key={preset.value}
          onClick={() => {
            onChange(preset.value);
            setEditing(false);
          }}
          className={
            "h-9 rounded-lg text-[15px] transition-all cursor-pointer " +
            (duration === preset.value && !editing
              ? "border border-white/20 bg-white/12 text-white"
              : "glass text-muted-foreground hover:bg-white/6 hover:text-foreground")
          }
        >
          {preset.label}
        </button>
      ))}

      {/* Custom button / inline input */}
      {editing ? (
        <div
          className="col-span-2 flex h-9 items-center justify-center rounded-lg border border-white/20 bg-white/12"
        >
          <input
            ref={inputRef}
            type="text"
            inputMode="text"
            value={customValue}
            placeholder="e.g. 45s, 2m"
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") cancel();
            }}
            onBlur={commit}
            className="h-full w-full rounded-lg bg-transparent text-center text-[15px] text-white tabular-nums outline-none placeholder:text-white/25"
          />
        </div>
      ) : (
        <button
          onClick={startEditing}
          className={
            "col-span-2 flex h-9 items-center justify-center gap-1.5 rounded-lg text-[15px] transition-all cursor-pointer " +
            (!isPreset
              ? "border border-white/20 bg-white/12 text-white"
              : "glass text-muted-foreground hover:bg-white/6 hover:text-foreground")
          }
        >
          {!isPreset ? formatCustomDuration(duration) : <><Pencil className="h-3 w-3" /> Custom</>}
        </button>
      )}
    </div>
  );
}
