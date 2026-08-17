import { ExternalLink, FileText } from "lucide-react";
import type { ReferenceSource } from "@/types";

export function ReferenceSources({ sources }: { sources: ReferenceSource[] }) {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <section className="mt-5 border-t border-slate-200 pt-4">
      <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">References</p>
      <div className="space-y-2">
        {sources.map((source) => {
          const title = source.name || source.title || "Unknown Reference";
          const content = (
            <>
              <FileText size={15} className="mt-0.5 shrink-0 text-blue-600" />
              <span className="min-w-0 flex-1 text-sm leading-5">{title}</span>
              {source.url && <ExternalLink size={14} className="shrink-0 text-slate-400" />}
            </>
          );
          return source.url ? (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              {content}
            </a>
          ) : (
            <div
              key={source.id}
              className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-700"
            >
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
