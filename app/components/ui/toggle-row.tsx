"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface ToggleRowProps {
  icon: ReactNode;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  grouped?: boolean;
}

export function ToggleRow({
  icon,
  label,
  checked,
  onChange,
  grouped = false,
}: ToggleRowProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={
        "flex h-13 w-full items-center justify-between px-3 transition-colors hover:bg-white/4 cursor-pointer " +
        (grouped ? "" : "glass rounded-lg")
      }
    >
      <div
        className={
          "flex items-center gap-2 text-[17px] transition-colors " +
          (checked ? "text-white/85" : "text-muted-foreground")
        }
      >
        {icon}
        <span>{label}</span>
      </div>

      <div
        className={
          "relative h-7 w-16 rounded-full transition-colors " +
          (checked
            ? "border-white/20 bg-white/30"
            : "border-white/10 bg-white/12")
        }
      >
        <motion.div
          animate={{ x: checked ? 21 : 0 }}
          transition={{ type: "spring", stiffness: 560, damping: 34 }}
          className="absolute left-0.5 top-0.5 h-6 w-9.75 rounded-full bg-white"
        />
      </div>
    </button>
  );
}
