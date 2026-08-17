import { Building2, ExternalLink, ShieldCheck } from "lucide-react";

const JOJO_EMBED_URL = "https://agent.sungrow.cn/webim/#/chat/FxkjSJ?isFullPage=1";

export function JojoEmbed() {
  return (
    <section className="relative flex h-full min-h-0 flex-col bg-white" aria-label="JOJO Company AI">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/80 px-3 py-2 sm:px-5">
        <div className="flex min-w-0 items-center gap-2 text-xs text-slate-600">
          <ShieldCheck size={15} className="shrink-0 text-emerald-600" aria-hidden="true" />
          <span className="truncate">Company AI • Internal corporate network</span>
        </div>
        <a
          href={JOJO_EMBED_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-blue-700 hover:bg-blue-50"
        >
          <ExternalLink size={14} aria-hidden="true" />
          <span className="hidden sm:inline">Open JOJO</span>
        </a>
      </div>

      <div className="relative min-h-0 flex-1 bg-white">
        <iframe
          src={JOJO_EMBED_URL}
          title="JOJO Company AI"
          allow="microphone"
          className="absolute inset-0 h-full w-full border-0 bg-white"
        />

        <noscript>
          <div className="grid h-full place-items-center p-6 text-center">
            <div>
              <Building2 className="mx-auto text-slate-400" />
              <p className="mt-3 text-sm font-semibold text-slate-800">JOJO requires JavaScript.</p>
              <p className="mt-1 text-sm text-slate-500">Please enable JavaScript and use the company network.</p>
            </div>
          </div>
        </noscript>
      </div>
    </section>
  );
}
