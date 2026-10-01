"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { SESSION_KEY } from "@/hooks/use-session"
import { loginAction } from "@/app/login/actions/loginAction"
import { landingPath } from "@/app/login/utils/landing-path"

export function useLogin() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: loginAction,
    onSuccess: (session) => {
      queryClient.clear()
      queryClient.setQueryData(SESSION_KEY, session)
      router.replace(landingPath(session))
    },
  })
}
