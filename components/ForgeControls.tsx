"use client";

type Props = {
  userContext: string;
  onContextChange: (v: string) => void;
  spice: number;
  onSpiceChange: (v: number) => void;
  disabled?: boolean;
};

export function ForgeControls({
  userContext,
  onContextChange,
  spice,
  onSpiceChange,
  disabled,
}: Props) {
  const spiceLabel =
    spice <= -40 ? "Wholesome" : spice >= 40 ? "Savage" : "Balanced";

  return (
    <div className="space-y-5">
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-widest text-neon">
          The situation (optional)
        </span>
        <textarea
          value={userContext}
          onChange={(e) => onContextChange(e.target.value)}
          disabled={disabled}
          placeholder='e.g. "3rd coffee before 9am standup" · "cat destroyed my plant"'
          rows={2}
          className="mt-2 w-full bg-ink/60 border border-white/10 rounded-xl px-4 py-3 text-sm resize-none placeholder:text-paper/25 focus:border-neon/50 focus:outline-none focus:ring-1 focus:ring-neon/30 transition-all"
        />
      </label>

      <div className="rounded-xl bg-ink/40 border border-white/10 p-4">
        <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wide">
          <span className="text-paper/45">Soft</span>
          <span className="text-neon px-2 py-0.5 rounded-full bg-neon/10">
            {spiceLabel} · {spice > 0 ? `+${spice}` : spice}
          </span>
          <span className="text-punch">Unhinged</span>
        </div>
        <input
          type="range"
          min={-100}
          max={100}
          value={spice}
          onChange={(e) => onSpiceChange(Number(e.target.value))}
          disabled={disabled}
          className="mt-3 w-full h-2 rounded-full appearance-none bg-white/10 accent-neon cursor-pointer"
        />
      </div>
    </div>
  );
}
