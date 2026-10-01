import { apiFetch } from "@/lib/api-client"

// Single-use ticket to open the notifications socket: the session token stays in the
// httpOnly cookie, the BFF proxy sends it to the gateway as Bearer
export function getNotificationTicketAction() {
  return apiFetch<{ ticket: string }>("/notifications/ticket", { method: "POST" })
}
