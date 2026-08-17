import { Braces, CheckCircle2, KeyRound, Link2, LockKeyhole, Network, Server } from "lucide-react";
import { useState } from "react";
import type { IntegrationMethod } from "@/types";

const JOJO_EXPERIENCE_URL = "https://agent.sungrow.cn/webim/#/chat/FxkjSJ?isFullPage=1";

export function SettingsPage() {
  const [method, setMethod] = useState<IntegrationMethod>("jojo-embed");

  return (
    <div className="h-full overflow-y-auto bg-slate-50/40">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <div>
          <p className="section-eyebrow">System Configuration</p>
          <h2 className="page-title">Settings</h2>
          <p className="page-description">JOJO is embedded as the company AI experience. API integration can be added later through a secure server-side adapter.</p>
        </div>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700"><Server size={20} /></span>
              <div>
                <h3 className="text-base font-semibold text-slate-900">Company AI Integration</h3>
                <p className="mt-1 text-sm text-slate-500">JOJO / ADP Company AI</p>
              </div>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800"><CheckCircle2 size={14} />Embed Configured</span>
          </div>

          <div className="p-5 sm:p-6">
            <fieldset>
              <legend className="form-label mb-2">Integration Method</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${method === "jojo-embed" ? "border-blue-300 bg-blue-50/60" : "border-slate-200"}`}>
                  <input type="radio" name="integration-method" value="jojo-embed" checked={method === "jojo-embed"} onChange={() => setMethod("jojo-embed")} className="mt-1 accent-blue-600" />
                  <Link2 size={18} className="mt-0.5 text-blue-600" />
                  <span><span className="block text-sm font-semibold text-slate-800">JOJO Embed</span><span className="mt-1 block text-xs leading-5 text-slate-500">Active for Version 1. Uses the company-hosted JOJO chat experience.</span></span>
                </label>
                <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${method === "jojo-api" ? "border-blue-300 bg-blue-50/60" : "border-slate-200"}`}>
                  <input type="radio" name="integration-method" value="jojo-api" checked={method === "jojo-api"} onChange={() => setMethod("jojo-api")} className="mt-1 accent-blue-600" />
                  <Braces size={18} className="mt-0.5 text-blue-600" />
                  <span><span className="block text-sm font-semibold text-slate-800">JOJO API</span><span className="mt-1 block text-xs leading-5 text-slate-500">Future option for a fully custom chat UI and server-side integration.</span></span>
                </label>
              </div>
            </fieldset>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className="form-label">JOJO Experience URL</span><input type="url" readOnly value={JOJO_EXPERIENCE_URL} className="form-input bg-slate-50 text-slate-600" /></label>
              <label><span className="form-label">Access Scope</span><input type="text" readOnly value="Corporate network / approved access" className="form-input bg-slate-50 text-slate-600" /></label>
              <label><span className="form-label">App Key</span><input type="text" readOnly value="Not stored in frontend" className="form-input bg-slate-50 text-slate-600" /></label>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
              <Network size={19} className="mt-0.5 shrink-0 text-blue-700" />
              <div><p className="text-sm font-semibold text-blue-950">Internal access</p><p className="mt-1 text-sm leading-6 text-blue-800">JOJO is an internal company service. The embedded chat may be unavailable outside the corporate network, SASE, or approved VPN access.</p></div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2"><KeyRound size={17} className="text-slate-500" /><p className="text-sm font-semibold text-slate-800">Credentials</p></div>
              <p className="mt-1.5 text-sm leading-6 text-slate-500">The Full Page Embed does not require an App Key in this frontend. Any future API key, secret, or token must remain server-side.</p>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <LockKeyhole size={19} className="mt-0.5 shrink-0 text-amber-700" />
              <div><p className="text-sm font-semibold text-amber-900">Security requirement</p><p className="mt-1 text-sm leading-6 text-amber-800">Never store App Keys, secrets, tokens, or credentials in frontend source code.</p></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
