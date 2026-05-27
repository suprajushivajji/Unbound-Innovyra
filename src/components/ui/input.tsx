"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "neon-ring h-11 w-full rounded-xl border border-[rgba(255,255,255,0.10)] bg-[rgba(0,0,0,0.20)] px-3 text-sm text-[var(--foreground)] placeholder:text-[rgba(234,240,255,0.45)]",
        "focus:border-[rgba(6,182,212,0.45)]",
        className
      )}
      {...props}
    />
  );
}

