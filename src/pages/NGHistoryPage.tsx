import { Search, SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import { DemoBadge } from "@/components/common/DemoBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { getNGHistory } from "@/services/ngHistoryService";
import type { NGHistoryRecord } from "@/types";
import { formatDate } from "@/utils/format";

export function NGHistoryPage() {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("");
  const [type, setType] = useState<NGHistoryRecord["type"] | "All">("All");
  const [records, setRecords] = useState<NGHistoryRecord[]>([]);

  useEffect(() => { void getNGHistory({ search, year, month, type }).then(setRecords); }, [search, year, month, type]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="section-eyebrow">Quality Records</p><h2 className="page-title">NG History</h2><p className="page-description">Search incoming and production NG records by material, supplier, or defect.</p></div><DemoBadge /></div>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <label className="relative block"><Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Material Code / Supplier / Defect" className="form-input pl-10" /></label>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <label><span className="form-label">Year</span><select value={year} onChange={(event) => setYear(event.target.value)} className="form-input"><option value="">All years</option><option value="2026">2026</option></select></label>
            <label><span className="form-label">Month</span><select value={month} onChange={(event) => setMonth(event.target.value)} className="form-input"><option value="">All months</option><option value="01">January</option><option value="02">February</option></select></label>
            <label><span className="form-label">Type</span><select value={type} onChange={(event) => setType(event.target.value as NGHistoryRecord["type"] | "All")} className="form-input"><option value="All">All</option><option value="Incoming NG">Incoming NG</option><option value="Production NG">Production NG</option></select></label>
          </div>
        </div>
        <div className="mt-5">
          {records.length === 0 ? <EmptyState icon={SearchX} title="No NG record found" description="No demonstration record matches the selected filters." /> : (
            <div>
              <div className="grid gap-3 md:hidden">{records.map((record) => <article key={record.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-xs text-slate-400">{formatDate(record.date)}</p><h3 className="mt-1 font-semibold text-blue-700">{record.materialCode}</h3></div><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${record.type === "Incoming NG" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"}`}>{record.type}</span></div><dl className="mt-3 grid gap-2 border-t border-slate-100 pt-3 text-sm"><div><dt className="text-xs text-slate-400">Supplier</dt><dd className="mt-0.5 text-slate-700">{record.supplier}</dd></div><div><dt className="text-xs text-slate-400">Defect</dt><dd className="mt-0.5 text-slate-700">{record.defect}</dd></div><div className="grid grid-cols-2 gap-3"><span><dt className="text-xs text-slate-400">NG Qty</dt><dd className="mt-0.5 font-semibold text-slate-800">{record.ngQty}</dd></span><span><dt className="text-xs text-slate-400">Reference</dt><dd className="mt-0.5 text-slate-600">{record.reference}</dd></span></div></dl></article>)}</div>
              <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block"><div className="overflow-x-auto">
                <table className="w-full min-w-[980px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{["Date", "Material Code", "Supplier", "Type", "Defect", "NG Qty", "Reference"].map((heading) => <th key={heading} className="px-4 py-3.5 font-semibold">{heading}</th>)}</tr></thead>
                  <tbody className="divide-y divide-slate-100">{records.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/80"><td className="whitespace-nowrap px-4 py-4 text-slate-600">{formatDate(record.date)}</td><td className="whitespace-nowrap px-4 py-4 font-semibold text-blue-700">{record.materialCode}</td><td className="whitespace-nowrap px-4 py-4 text-slate-700">{record.supplier}</td><td className="whitespace-nowrap px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${record.type === "Incoming NG" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"}`}>{record.type}</span></td><td className="px-4 py-4 text-slate-700">{record.defect}</td><td className="px-4 py-4 text-center font-semibold text-slate-800">{record.ngQty}</td><td className="whitespace-nowrap px-4 py-4 text-xs text-slate-500">{record.reference}</td></tr>
                  ))}</tbody>
                </table>
              </div><div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-500">DEMO_DATA · {records.length} record{records.length === 1 ? "" : "s"}</div></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
