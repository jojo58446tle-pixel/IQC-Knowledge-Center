import type { LucideIcon } from "lucide-react";

interface EmptyStateProps { icon: LucideIcon; title: string; description: string }

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-500"><Icon size={23} aria-hidden="true" /></span>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}
