"use client";

import { TEMPLATE_LABELS, ALL_TEMPLATES } from "@/lib/templates";
import type { TemplateId } from "@/lib/types";

type Props = {
  value: TemplateId;
  onChange: (t: TemplateId) => void;
};

export function TemplatePicker({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-paper/40">Swap template</p>
      <div className="flex flex-wrap gap-2">
        {ALL_TEMPLATES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
              value === t
                ? "bg-neon text-ink border-neon"
                : "border-white/15 text-paper/60 hover:border-neon/50"
            }`}
          >
            {TEMPLATE_LABELS[t]}
          </button>
        ))}
      </div>
    </div>
  );
}
