"use client";

export function LoadingForge({ imageSrc }: { imageSrc: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      <div className="relative">
        <div className="absolute inset-0 rounded-2xl bg-neon/30 blur-2xl animate-pulse-glow" />
        <img
          src={imageSrc}
          alt=""
          className="relative w-40 h-40 object-cover rounded-2xl border-2 border-neon/50 rotate-3"
        />
      </div>
      <div className="text-center space-y-2">
        <p className="font-display font-bold text-xl shimmer-text">Forging captions…</p>
        <p className="text-sm text-paper/50 font-mono">Claude is studying your photo&apos;s crimes</p>
      </div>
      <div className="flex gap-2">
        {["😂", "💀", "📧", "🎭", "🌀", "🔥"].map((e, i) => (
          <span
            key={e}
            className="text-2xl animate-bounce"
            style={{ animationDelay: `${i * 0.12}s` }}
          >
            {e}
          </span>
        ))}
      </div>
    </div>
  );
}
