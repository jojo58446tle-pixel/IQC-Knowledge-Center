import { DEMO_NG_HISTORY } from "@/data/demoNGHistory";
import type { NGHistoryRecord } from "@/types";

export interface NGHistoryQuery { search?: string; year?: string; month?: string; type?: NGHistoryRecord["type"] | "All" }

export async function getNGHistory(query: NGHistoryQuery = {}): Promise<NGHistoryRecord[]> {
  const search = query.search?.trim().toLocaleLowerCase() ?? "";
  return DEMO_NG_HISTORY.filter((record) => {
    const matchesSearch = !search || record.materialCode.toLocaleLowerCase().includes(search) || record.supplier.toLocaleLowerCase().includes(search) || record.defect.toLocaleLowerCase().includes(search);
    const matchesYear = !query.year || record.date.startsWith(query.year);
    const matchesMonth = !query.month || record.date.slice(5, 7) === query.month.padStart(2, "0");
    const matchesType = !query.type || query.type === "All" || record.type === query.type;
    return matchesSearch && matchesYear && matchesMonth && matchesType;
  });
}
