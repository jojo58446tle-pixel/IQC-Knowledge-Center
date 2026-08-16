import { Braces, KeyRound, Link2, LockKeyhole, Server, Unplug } from "lucide-react";
import { useState } from "react";
import type { IntegrationMethod } from "@/types";

export function SettingsPage() {
  const [method, setMethod] = useState<IntegrationMethod>("jojo-embed");
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <div><p className="section-eyebrow">System Configuration</p><h2 className="page-title">Settings</h2><p className="page-description">Prepare the UI for a future secure connection to JOJO Company AI.</p></div>
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700"><Server size={20} /></span><div><h3 className="text-base font-semibold text-slate-900">Company AI Integration</h3><p className="mt-1 text-sm text-slate-500">JOJO integration configuration for a future release.</p></div></div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"><Unplug size={14} />Not Connected</span>
          </div>
          <div className="p-5 sm:p-6">
            <fieldset>
              <legend className="form-label mb-2">Integration Method</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${method === "jojo-embed" ? "border-blue-300 bg-blue-50/60" : "border-slate-200"}`}>
                  <input type="radio" name="integration-method" value="jojo-embed" checked={method === "jojo-embed"} onChange={() => setMethod("jojo-embed")} className="mt-1 accent-blue-600" /><Link2 size={18} className="mt-0.5 text-blue-600" /><span><span className="block text-sm font-semibold text-slate-800">JOJO Embed</span><span className="mt-1 block text-xs leading-5 text-slate-500">Display an approved company-hosted embed experience.</span></span>
                </label>
                <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${method === "jojo-api" ? "border-blue-300 bg-blue-50/60" : "border-slate-200"}`}>
                  <input type="radio" name="integration-method" value="jojo-api" checked={method === "jojo-api"} onChange={() => setMethod("jojo-api")} className="mt-1 accent-blue-600" /><Braces size={18} className="mt-0.5 text-blue-600" /><span><span className="block text-sm font-semibold text-slate-800">JOJO API</span><span className="mt-1 block text-xs leading-5 text-slate-500">Connect through a secure server-side API adapter.</span></span>
                </label>
              </div>
            </fieldset>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label><span className="form-label">Experience URL</span><input type="url" disabled placeholder="Configured in a future release" className="form-input disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400" /></label>
              <label><span className="form-label">API Base URL</span><input type="url" disabled placeholder="Configured in a future release" className="form-input disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400" /></label>
              <label><span className="form-label">Application ID</span><input type="text" disabled placeholder="Configured in a future release" className="form-input disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400" /></label>
              <label><span className="form-label">App Key Status</span><input type="text" disabled value="Not configured in frontend" className="form-input disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400" /></label>
            </div>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-center gap-2"><KeyRound size={17} className="text-slate-500" /><p className="text-sm font-semibold text-slate-800">App Key</p></div><p className="mt-1.5 text-sm leading-6 text-slate-500">Not available in the frontend. It will be configured only in the secure server environment.</p></div>
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4"><LockKeyhole size={19} className="mt-0.5 shrink-0 text-amber-700" /><div><p className="text-sm font-semibold text-amber-900">Security requirement</p><p className="mt-1 text-sm leading-6 text-amber-800">API credentials must be stored on the server side. Never store App Keys, secrets, or tokens in frontend source code.</p></div></div>
          </div>
        </section>
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h3 className="text-sm font-semibold text-slate-900">Version 1 scope</h3><ul className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2"><li className="rounded-lg bg-slate-50 px-3 py-2">Frontend user interface</li><li className="rounded-lg bg-slate-50 px-3 py-2">Local demonstration data</li><li className="rounded-lg bg-slate-50 px-3 py-2">Modular AI service boundary</li><li className="rounded-lg bg-slate-50 px-3 py-2">No external AI calls</li></ul></section>
      </div>
    </div>
  );
}
