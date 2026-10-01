"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { io } from "socket.io-client"
import { toast } from "sonner"

import { getNotificationTicketAction } from "@/app/dashboard/alerts/actions/getNotificationTicketAction"
import { ALERTS_KEY } from "@/app/dashboard/alerts/hooks/useAlerts"
import type { Alert } from "@/app/dashboard/alerts/utils/types"
import { PRODUCTS_KEY } from "@/app/dashboard/products/hooks/useProducts"

const GATEWAY_WS_URL = process.env.NEXT_PUBLIC_GATEWAY_WS_URL ?? "http://localhost:3000"

// The gateway drops sockets without a valid ticket and socket.io does not retry those
const SERVER_DISCONNECT_RETRY_MS = 5_000

// Real-time stock alerts of the selected organization (client-gateway namespace
// /notifications). Reconnects with a fresh ticket when the organization changes
export function useAlertNotifications(organizationId: string | undefined) {
  const queryClient = useQueryClient()
  const router = useRouter()

  useEffect(() => {
    if (!organizationId) return

    const socket = io(`${GATEWAY_WS_URL}/notifications`, {
      transports: ["websocket"],
      // Called on every (re)connection, so each attempt sends a new single-use ticket
      auth: (callback) => {
        getNotificationTicketAction().then(
          ({ ticket }) => callback({ ticket }),
          () => callback({})
        )
      },
    })

    const refresh = () => {
      void queryClient.invalidateQueries({ queryKey: ALERTS_KEY })
      void queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
    }
    const openAlerts = () => router.push("/dashboard/alerts")

    socket.on("alert:created", (alert: Alert) => {
      toast.warning("Nueva alerta de stock", {
        id: alert.id,
        description: alert.descripcion,
        action: { label: "Ver", onClick: openAlerts },
      })
      refresh()
    })

    socket.on("alert:resolved", (alert: Alert) => {
      toast.success("Alerta resuelta", { id: alert.id, description: alert.descripcion })
      refresh()
    })

    // Catch up on whatever happened while the socket was down
    socket.io.on("reconnect", refresh)

    let retry: ReturnType<typeof setTimeout> | undefined
    socket.on("disconnect", (reason) => {
      if (reason === "io server disconnect") {
        retry = setTimeout(() => socket.connect(), SERVER_DISCONNECT_RETRY_MS)
      }
    })

    return () => {
      clearTimeout(retry)
      socket.disconnect()
    }
  }, [organizationId, queryClient, router])
}
