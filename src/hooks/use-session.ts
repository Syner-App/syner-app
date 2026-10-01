"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { getSessionAction, logoutAction, switchOrganizationAction } from "@/lib/auth-actions"

export const SESSION_KEY = ["session"]

// The current user and its memberships. Refetching it also renews the session cookie
export function useSession() {
  return useQuery({
    queryKey: SESSION_KEY,
    queryFn: getSessionAction,
    staleTime: 5 * 60_000,
    refetchInterval: 15 * 60_000,
  })
}

export function useSwitchOrganization() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: switchOrganizationAction,
    onSuccess: () => {
      // Every cached query belongs to the previous organization
      queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== SESSION_KEY[0] })
      void queryClient.invalidateQueries({ queryKey: SESSION_KEY })
      router.push("/dashboard")
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: logoutAction,
    onSettled: () => {
      queryClient.clear()
      router.replace("/login")
    },
  })
}
