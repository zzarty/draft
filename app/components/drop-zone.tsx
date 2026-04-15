"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Cloud } from "lucide-react";
import type { SessionSettings } from "@/app/use-session";
import { SettingsControls } from "@/app/components/settings-controls";

interface DropZoneProps {
  onFilesSelected: (files: FileList) => void;
  imageCount: number;
  settings: SessionSettings;
  onSettingsChange: (settings: SessionSettings) => void;
  onStartSession: () => void;
}

export function DropZone({
  onFilesSelected,
  imageCount,
  settings,
  onSettingsChange,
  onStartSession,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        onFilesSelected(e.dataTransfer.files);
      }
    },
    [onFilesSelected]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    if (isMobile) {
      fileInputRef.current?.click();
    } else {
      folderInputRef.current?.click();
    }
  }, [isMobile]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFilesSelected(e.target.files);
      }
    },
    [onFilesSelected]
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-strong rounded-4xl p-[14px] w-full max-w-sm mx-auto text-[17px]"
    >
      {/* Header */}
      <div className="mb-2.5 flex flex-col gap-1.5 p-[8px]">
        <h1 className="font-semibold">Draft</h1>
        <p className="text-muted-foreground">
          Load your images and set the pace before you start.
        </p>
      </div>

      {/* Upload area */}
      <div className="mb-6">
        {/* Folder picker for desktop */}
        <input
          ref={folderInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          // @ts-expect-error webkitdirectory is non-standard
          webkitdirectory=""
        />
        {/* Plain file picker for mobile */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={
            "flex min-h-20 w-full cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl border border-dashed transition-all " +
            (isDragging
              ? "border-white/30 bg-white/10"
              : "border-white/10 hover:border-white/20 hover:bg-white/2")
          }
        >
          <Cloud className="w-5 h-5 text-muted-foreground" />
          <span className="text-muted-foreground">
            {imageCount > 0
              ? imageCount + " images loaded"
              : "Select folder or drop images"}
          </span>
        </div>
      </div>

      <SettingsControls
        settings={settings}
        onSettingsChange={onSettingsChange}
        imageCount={imageCount}
        onStartSession={onStartSession}
      />
    </motion.div>
  );
}
