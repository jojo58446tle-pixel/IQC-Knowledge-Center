import { Bot, ClipboardList, FileText, ShieldAlert } from "lucide-react";
import { DemoBadge } from "@/components/common/DemoBadge";
import type { AIAnswerContent } from "@/types";
import { ReferenceSources } from "./ReferenceSources";

function Field({ label, value }: { label: string; value?: string | number }) {
  if (value === undefined || value === "") return null;
  return (
    <div className="grid gap-0.5 border-b border-slate-100 py-2 last:border-b-0 sm:grid-cols-[150px_1fr] sm:gap-4">
      <dt className="text-xs font-medium text-slate-500 sm:text-sm">{label}</dt>
      <dd className="break-words text-sm font-medium text-slate-800">{value}</dd>
    </div>
  );
}

export function AIAnswer({ answer }: { answer: AIAnswerContent }) {
  return (
    <div className="flex max-w-3xl items-start gap-3">
      <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200"><Bot size={17} aria-hidden="true" /></div>
      <article className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">IQC AI Answer</p>{answer.isDemo && <DemoBadge compact />}</div>
        {answer.isDemo && <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">UI demonstration only. This answer is not production knowledge.</div>}

        {answer.text?.map((paragraph, index) => <p key={index} className="mb-3 text-sm leading-7 text-slate-700 last:mb-0">{paragraph}</p>)}
        {answer.bullets && <ul className="my-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-700">{answer.bullets.map((item, index) => <li key={index}>{item}</li>)}</ul>}

        {answer.material && (
          <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 sm:p-4">
            <div className="mb-2 flex items-center gap-2"><ClipboardList size={17} className="text-blue-600" /><h3 className="text-sm font-semibold text-slate-900">Material Information</h3></div>
            <dl>
              <Field label="Material Code" value={answer.material.materialCode} />
              <Field label="Result" value={answer.material.result} />
              <Field label="Supplier Code" value={answer.material.supplierCode} />
              <Field label="Supplier" value={answer.material.supplier} />
              <Field label="Incoming Quantity" value={answer.material.incomingQuantity} />
              <Field label="PO" value={answer.material.po} />
              <Field label="Batch" value={answer.material.batch} />
            </dl>
          </section>
        )}

        {answer.ng && (
          <section className="rounded-xl border border-rose-200 bg-rose-50/70 p-4">
            <div className="mb-2 flex items-center gap-2"><ShieldAlert size={17} className="text-rose-600" /><h3 className="text-sm font-semibold text-slate-900">NG Information</h3></div>
            <dl>
              <Field label="Material Code" value={answer.ng.materialCode} />
              <Field label="Type" value={answer.ng.type} />
              <Field label="Supplier" value={answer.ng.supplier} />
              <Field label="Defect" value={answer.ng.defect} />
              <Field label="NG Quantity" value={answer.ng.quantity} />
            </dl>
          </section>
        )}

        {answer.document && (
          <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="mb-2 flex items-center gap-2"><FileText size={17} className="text-blue-600" /><h3 className="text-sm font-semibold text-slate-900">Document Information</h3></div>
            <dl>
              <Field label="Document No." value={answer.document.documentNo} />
              <Field label="Document Name" value={answer.document.documentName} />
              <Field label="Category" value={answer.document.category} />
              <Field label="Revision" value={answer.document.revision} />
            </dl>
          </section>
        )}

        {answer.table && (
          <div className="my-4 overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600"><tr>{answer.table.columns.map((column) => <th key={column} className="whitespace-nowrap px-3 py-2.5 font-semibold">{column}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-100 bg-white">{answer.table.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((value, cellIndex) => <td key={cellIndex} className="whitespace-nowrap px-3 py-2.5 text-slate-700">{value}</td>)}</tr>)}</tbody>
            </table>
          </div>
        )}

        <ReferenceSources sources={answer.references ?? []} />
      </article>
    </div>
  );
}
