import { FileSearch, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { DemoBadge } from "@/components/common/DemoBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { getDocuments } from "@/services/documentService";
import type { DocumentCategory, KnowledgeDocument } from "@/types";

const categories: Array<DocumentCategory | "All"> = ["All", "Master List", "Monthly Report", "SOP", "WI", "Standard", "Other"];

export function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<DocumentCategory | "All">("All");
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);

  useEffect(() => { void getDocuments({ search, category }).then(setDocuments); }, [search, category]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div><p className="section-eyebrow">Knowledge Library</p><h2 className="page-title">Documents</h2><p className="page-description">Browse IQC knowledge documents prepared for future company data integration.</p></div><DemoBadge />
        </div>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <label className="relative block"><Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search document name or document number" className="form-input pl-10" /></label>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Document category filter">
            {categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${category === item ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{item}</button>)}
          </div>
        </div>
        <div className="mt-5">
          {documents.length === 0 ? <EmptyState icon={FileSearch} title="No document found" description="Try another document name, document number, or category." /> : (
            <div>
              <div className="grid gap-3 md:hidden">{documents.map((document) => <article key={document.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><p className="break-all text-sm font-semibold text-blue-700">{document.documentNo}</p><DemoBadge compact /></div><h3 className="mt-2 text-sm font-semibold leading-6 text-slate-800">{document.documentName}</h3><dl className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-xs"><div><dt className="text-slate-400">Category</dt><dd className="mt-1 font-medium text-slate-700">{document.category}</dd></div><div><dt className="text-slate-400">Revision</dt><dd className="mt-1 font-medium text-slate-700">{document.revision}</dd></div></dl></article>)}</div>
              <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block"><div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3.5 font-semibold">Document No.</th><th className="px-5 py-3.5 font-semibold">Document Name</th><th className="px-5 py-3.5 font-semibold">Category</th><th className="px-5 py-3.5 font-semibold">Revision</th><th className="px-5 py-3.5 font-semibold">Status</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">{documents.map((document) => <tr key={document.id} className="hover:bg-slate-50/80"><td className="whitespace-nowrap px-5 py-4 font-semibold text-blue-700">{document.documentNo}</td><td className="max-w-xl px-5 py-4 leading-6 text-slate-700">{document.documentName}</td><td className="whitespace-nowrap px-5 py-4 text-slate-600">{document.category}</td><td className="whitespace-nowrap px-5 py-4 text-slate-600">{document.revision}</td><td className="px-5 py-4"><DemoBadge compact /></td></tr>)}</tbody>
                </table>
              </div><div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-500">Showing {documents.length} demonstration document{documents.length === 1 ? "" : "s"}</div></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
