export interface AIServiceResponse { success: boolean; configured: boolean; message: string }

/** Version 1 intentionally calls no AI provider. Replace only this implementation after a secure server-side JOJO adapter exists. */
export async function sendMessage(_message: string): Promise<AIServiceResponse> {
  return { success: false, configured: false, message: "Company AI connection is not configured yet." };
}
