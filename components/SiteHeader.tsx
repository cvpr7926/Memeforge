import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-ink/70 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-punch to-grape flex items-center justify-center text-lg font-black shadow-punch">
            M
          </span>
          <span className="font-display font-extrabold text-xl tracking-tight">
            Meme<span className="text-neon group-hover:text-punch transition-colors">Forge</span>
          </span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-paper/60">
          <a href="#studio" className="hover:text-neon transition-colors">
            Studio
          </a>
          <a href="/wall" className="hover:text-neon transition-colors">
            Wall
          </a>
          <a href="#how" className="hover:text-neon transition-colors">
            How it works
          </a>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="#studio"
            className="text-xs font-bold uppercase tracking-wider bg-neon text-ink px-4 py-2 rounded-full hover:shadow-neon transition-shadow"
          >
            Start free
          </a>
        </div>
      </div>
    </header>
  );
}
