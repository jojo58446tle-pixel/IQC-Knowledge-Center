import { DEMO_DOCUMENTS } from "@/data/demoDocuments";
import type { DocumentCategory, KnowledgeDocument } from "@/types";

export interface DocumentQuery { search?: string; category?: DocumentCategory | "All" }

export async function getDocuments(query: DocumentQuery = {}): Promise<KnowledgeDocument[]> {
  const search = query.search?.trim().toLocaleLowerCase() ?? "";
  const category = query.category ?? "All";
  return DEMO_DOCUMENTS.filter((document) => {
    const matchesSearch = !search || document.documentNo.toLocaleLowerCase().includes(search) || document.documentName.toLocaleLowerCase().includes(search);
    return matchesSearch && (category === "All" || document.category === category);
  });
}
