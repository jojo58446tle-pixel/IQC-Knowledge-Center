import { FlaskConical } from "lucide-react";

export function DemoBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-amber-800" title="Demonstration data only — not production knowledge">
      <FlaskConical size={12} aria-hidden="true" />
      {compact ? "DEMO" : "DEMO DATA ONLY"}
    </span>
  );
}
