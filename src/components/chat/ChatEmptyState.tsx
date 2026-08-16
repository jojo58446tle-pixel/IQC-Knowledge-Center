import { Bot, FileSearch, FileText, History, PackageSearch } from "lucide-react";

const questions = [
  { label: "SOP", value: "ค้นหา SOP ที่เกี่ยวข้องกับการตรวจสอบ IQC", icon: FileSearch },
  { label: "Material Code", value: "ค้นหาข้อมูล Material Code ", icon: PackageSearch },
  { label: "NG History", value: "แสดงประวัติ NG ของ Material Code ", icon: History },
  { label: "Monthly Report", value: "ค้นหาข้อมูลจาก Monthly Report เดือน ", icon: FileText },
];

export function ChatEmptyState({ onQuestion }: { onQuestion: (value: string) => void }) {
  return <section className="text-center"><div className="mx-auto grid size-16 place-items-center rounded-2xl bg-blue-50 text-blue-600"><Bot size={31} /></div><h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Ask IQC AI</h2><p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">ถามเกี่ยวกับ SOP, WI, Material Code,<br className="hidden sm:block" /> Monthly Report, NG History และข้อมูล IQC</p><div className="mt-6 flex flex-wrap justify-center gap-2">{questions.map(({ label, value, icon: Icon }) => <button key={label} type="button" onClick={() => onQuestion(value)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"><Icon size={16} />{label}</button>)}</div></section>;
}
