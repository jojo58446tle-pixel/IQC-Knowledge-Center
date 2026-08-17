import { Building2 } from "lucide-react";

export function ConnectionStatus({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-medium text-emerald-700 sm:text-xs">
        <span className="size-1.5 rounded-full bg-emerald-500" />
        JOJO Embed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
      <Building2 size={14} />
      JOJO Company AI • Internal
    </span>
  );
}
