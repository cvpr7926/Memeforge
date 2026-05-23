import { DEV_TICKER } from "@/lib/dev-ticker";

export function DevTicker() {
  const items = [...DEV_TICKER, ...DEV_TICKER];

  return (
    <div className="border-y border-white/5 bg-ink/80 overflow-hidden py-2">
      <div className="flex animate-marquee-gpu w-max gap-10 px-4 motion-reduce:animate-none">
        {items.map((text, i) => (
          <span
            key={`${text}-${i}`}
            className="shrink-0 text-[11px] font-mono uppercase tracking-widest text-paper/35 whitespace-nowrap"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
