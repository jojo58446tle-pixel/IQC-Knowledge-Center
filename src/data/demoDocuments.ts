import type { KnowledgeDocument } from "@/types";

// DEMO DATA ONLY — UI demonstration, not production knowledge.
// Document numbers are limited to values explicitly supplied in the specification.
export const DEMO_DOCUMENTS: KnowledgeDocument[] = [
  { id: "demo-doc-001", documentNo: "TH-QM-F-036-1.0", documentName: "Master List Standard Operating Procedure for IQC Inspection", category: "Master List", revision: "1.0", status: "Demo", isDemo: true },
  { id: "demo-doc-002", documentNo: "TH-QM-F-040-1.0", documentName: "Master List Equipment Daily Check List", category: "Master List", revision: "1.0", status: "Demo", isDemo: true },
  { id: "demo-doc-003", documentNo: "TH-QM-F-050-2022-1.0", documentName: "Master List Standard Operating Procedure for Using Measuring Instruments", category: "Master List", revision: "1.0", status: "Demo", isDemo: true },
  { id: "demo-doc-004", documentNo: "—", documentName: "Monthly Report of IQC for Jan_01-2026", category: "Monthly Report", revision: "—", status: "Demo", isDemo: true },
];
