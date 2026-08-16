import type { NGHistoryRecord } from "@/types";

// DEMO DATA ONLY — placeholder values below are not production NG records.
export const DEMO_NG_HISTORY: NGHistoryRecord[] = [
  { id: "demo-ng-001", date: "2026-01-08", materialCode: "DEMO-MAT-001", supplier: "Demo Supplier A", type: "Incoming NG", defect: "Surface scratch", ngQty: 2, reference: "DEMO-NG-001", isDemo: true },
  { id: "demo-ng-002", date: "2026-01-17", materialCode: "DEMO-MAT-002", supplier: "Demo Supplier B", type: "Production NG", defect: "Paint thickness out of range", ngQty: 1, reference: "DEMO-PD-001", isDemo: true },
  { id: "demo-ng-003", date: "2026-02-05", materialCode: "DEMO-MAT-003", supplier: "Demo Supplier A", type: "Incoming NG", defect: "Packaging damage", ngQty: 3, reference: "DEMO-NG-002", isDemo: true },
  { id: "demo-ng-004", date: "2026-02-20", materialCode: "DEMO-MAT-001", supplier: "Demo Supplier A", type: "Production NG", defect: "Thread contamination", ngQty: 1, reference: "DEMO-PD-002", isDemo: true },
];
