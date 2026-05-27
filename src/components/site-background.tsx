export function SiteBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Grid */}
      <div className="absolute inset-0 innovyra-grid opacity-80" />

      {/* Nebula lights */}
      <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.42)_0%,rgba(59,130,246,0.18)_30%,transparent_70%)] blur-2xl" />
      <div className="absolute -bottom-52 -left-52 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(6,182,212,0.30)_0%,rgba(6,182,212,0.10)_40%,transparent_75%)] blur-3xl" />
      <div className="absolute -bottom-60 right-[-160px] h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(59,130,246,0.22)_0%,rgba(139,92,246,0.12)_45%,transparent_75%)] blur-3xl" />

      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent_0%,rgba(5,8,22,0.25)_45%,rgba(5,8,22,0.75)_100%)]" />
    </div>
  );
}

