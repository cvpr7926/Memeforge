const STEPS = [
  {
    num: "01",
    title: "Drop the photo",
    desc: "Drag, paste, or snap. Pets, coworkers, disasters — all fair game.",
    icon: "📸",
    color: "from-neon/20 to-neon/5 border-neon/30",
  },
  {
    num: "02",
    title: "Set the vibe",
    desc: "Optional context + spice dial. Wholesome church picnic or HR violation.",
    icon: "🌶️",
    color: "from-punch/20 to-punch/5 border-punch/30",
  },
  {
    num: "03",
    title: "Pick your weapon",
    desc: "Six live previews — relatable, absurdist, corporate, dramatic, brainrot, savage.",
    icon: "🎯",
    color: "from-sun/20 to-sun/5 border-sun/30",
  },
  {
    num: "04",
    title: "Ship it",
    desc: "Tweak captions, export PNG, share a link. Watch reactions roll in.",
    icon: "🚀",
    color: "from-grape/20 to-grape/5 border-grape/30",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="max-w-6xl mx-auto px-4 py-20">
      <div className="text-center mb-14">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl">
          Zero friction. <span className="text-neon">Maximum damage.</span>
        </h2>
        <p className="text-paper/55 mt-3 max-w-md mx-auto">
          No signup. No watermark. No 2009 meme generator energy.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STEPS.map((s) => (
          <article
            key={s.num}
            className={`rounded-2xl border bg-gradient-to-b p-5 ${s.color} hover:-translate-y-1 transition-transform duration-300`}
          >
            <span className="text-3xl">{s.icon}</span>
            <p className="font-mono text-[10px] text-paper/40 mt-4">{s.num}</p>
            <h3 className="font-display font-bold text-lg mt-1">{s.title}</h3>
            <p className="text-sm text-paper/60 mt-2 leading-relaxed">{s.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
