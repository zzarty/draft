"use client";

import { AnimatePresence, motion } from "framer-motion";

interface ImageViewerProps {
  src: string;
  name: string;
  index: number;
}

export function ImageViewer({ src, name, index }: ImageViewerProps) {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.img
          key={`${src}-${index}`}
          src={src}
          alt={name}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="max-w-full max-h-full object-contain select-none"
          draggable={false}
        />
      </AnimatePresence>
    </div>
  );
}
