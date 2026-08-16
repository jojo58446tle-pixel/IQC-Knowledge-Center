export type PageKey = "chat" | "documents" | "ng-history" | "settings" | "about";
export type ConnectionState = "connected" | "not-connected" | "error";

export interface ReferenceSource { id: string; title: string; url?: string }

export interface MaterialInformation {
  materialCode: string;
  result?: string;
  supplierCode?: string;
  supplier?: string;
  incomingQuantity?: string;
  po?: string;
  batch?: string;
}

export interface NGInformation {
  materialCode: string;
  type: "Incoming NG" | "Production NG";
  defect: string;
  quantity: number;
  supplier?: string;
}

export type DocumentCategory = "Master List" | "Monthly Report" | "SOP" | "WI" | "Standard" | "Other";

export interface DocumentInformation {
  documentNo: string;
  documentName: string;
  category: DocumentCategory;
  revision?: string;
}

export interface AnswerTable { columns: string[]; rows: Array<Array<string | number>> }

export interface AIAnswerContent {
  text?: string[];
  bullets?: string[];
  table?: AnswerTable;
  material?: MaterialInformation;
  ng?: NGInformation;
  document?: DocumentInformation;
  references?: ReferenceSource[];
  isDemo?: boolean;
}

export type ChatState = "thinking" | "connection-error" | "no-knowledge" | "no-reference" | "not-connected";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "state";
  text?: string;
  answer?: AIAnswerContent;
  state?: ChatState;
}

export interface KnowledgeDocument {
  id: string;
  documentNo: string;
  documentName: string;
  category: DocumentCategory;
  revision: string;
  status: "Active" | "Archived" | "Demo";
  isDemo: true;
}

export interface NGHistoryRecord {
  id: string;
  date: string;
  materialCode: string;
  supplier: string;
  type: "Incoming NG" | "Production NG";
  defect: string;
  ngQty: number;
  reference: string;
  isDemo: true;
}

export type IntegrationMethod = "jojo-api" | "jojo-embed";
