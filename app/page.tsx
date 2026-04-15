"use client";

import { AnimatePresence } from "framer-motion";
import { DropZone } from "@/app/components/drop-zone";
import { ImageViewer } from "@/app/components/image-viewer";
import { ControlBar } from "@/app/components/control-bar";
import { SettingsPanel } from "@/app/components/settings-panel";
import { BackgroundGrid } from "@/app/components/background-grid";
import { useSessionStore } from "@/app/use-session";

export default function Home() {
  const store = useSessionStore();

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-black text-white" style={{ background: "#000", color: "#fff" }}>
      {/* Background */}
      {!store.sessionActive && <BackgroundGrid />}

      {/* Landing / Upload */}
      {!store.sessionActive && (
        <div className="relative z-10 w-full px-4">
          <DropZone
            onFilesSelected={store.loadImages}
            imageCount={store.imageCount}
            settings={store.settings}
            onSettingsChange={store.setSettings}
            onStartSession={store.startSession}
          />
        </div>
      )}

      {/* Image Viewer */}
      {store.sessionActive && store.currentUrl && (
        <ImageViewer
          src={store.currentUrl}
          name={store.currentName}
          index={store.currentIndex}
        />
      )}

      {/* Control Bar */}
      <AnimatePresence>
        {store.sessionActive && (
          <ControlBar
            isPlaying={store.isPlaying}
            timeLeft={store.timeLeft}
            duration={store.settings.duration}
            currentIndex={store.currentIndex}
            totalImages={store.imageCount}
            onTogglePlay={store.togglePlay}
            onNext={store.goToNext}
            onPrev={store.goToPrev}
            onShuffle={store.handleShuffle}
            onSettings={() => store.setShowSettings(true)}
            onStop={store.stopSession}
          />
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {store.showSettings && (
          <SettingsPanel
            settings={store.settings}
            onSettingsChange={store.setSettings}
            onClose={() => store.setShowSettings(false)}
            imageCount={store.imageCount}
            onStartSession={store.startSession}
            sessionActive={store.sessionActive}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
