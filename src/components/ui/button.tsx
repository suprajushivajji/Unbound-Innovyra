"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      className={cn(
        "neon-ring inline-flex items-center justify-center gap-2 rounded-xl font-medium transition will-change-transform disabled:cursor-not-allowed disabled:opacity-60",
        "active:translate-y-[1px]",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-11 px-4 text-sm",
        size === "lg" && "h-12 px-5 text-base",
        variant === "primary" &&
          "text-white shadow-[0_0_0_1px_rgba(6,182,212,0.25)_inset,0_18px_60px_rgba(139,92,246,0.22)] bg-[linear-gradient(135deg,rgba(139,92,246,0.90)_0%,rgba(59,130,246,0.88)_45%,rgba(6,182,212,0.82)_100%)] hover:brightness-110",
        variant === "outline" &&
          "glass text-[var(--foreground)] hover:border-[rgba(6,182,212,0.45)] hover:shadow-[0_0_22px_rgba(6,182,212,0.18)]",
        variant === "ghost" &&
          "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.06)]",
        className
      )}
      {...props}
    />
  );
}

