"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-md">
        <Link
          href="/"
          className="mx-auto mb-6 flex w-fit items-center gap-3"
        >
          <Image
            src="/logo/innovyra-icon.svg"
            alt="Innovyra"
            width={34}
            height={34}
            priority
          />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide">Innovyra</div>
            <div className="text-xs text-[var(--muted)]">
              Smart Career Execution Engine
            </div>
          </div>
        </Link>

        <Card className="p-6">
          <div className="text-lg font-semibold tracking-tight">{title}</div>
          <div className="mt-1 text-sm text-[var(--muted)]">{subtitle}</div>
          <div className="mt-6">{children}</div>
        </Card>

        <p className="mt-6 text-center text-xs text-[rgba(234,240,255,0.55)]">
          From Career Goal → Real Execution → Measurable Growth.
        </p>
      </div>
    </div>
  );
}

