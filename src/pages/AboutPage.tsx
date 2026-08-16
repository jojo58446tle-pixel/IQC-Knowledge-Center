import { Bot, ShieldCheck } from "lucide-react";
import { ConnectionStatus } from "@/components/layout/ConnectionStatus";

export function AboutPage() {
  return <div className="h-full overflow-y-auto bg-slate-50"><div className="mx-auto max-w-3xl px-4 py-8 sm:px-6"><div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><span className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-700"><Bot size={25} /></span><h2 className="mt-5 text-2xl font-bold text-slate-950">About IQC Knowledge Center</h2><p className="mt-3 text-sm leading-7 text-slate-600">An internal AI assistant interface for finding IQC knowledge such as SOP, WI, material information, monthly reports, and NG history.</p><div className="mt-6"><ConnectionStatus /></div><div className="mt-6 flex items-start gap-3 rounded-2xl bg-slate-50 p-4"><ShieldCheck size={19} className="mt-0.5 shrink-0 text-blue-700" /><p className="text-sm leading-6 text-slate-600">Version 1 is a frontend experience only. JOJO Embed or API integration will be connected through an approved secure architecture in a future release.</p></div></div></div></div>;
}
