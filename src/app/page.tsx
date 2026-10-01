import { redirect } from "next/navigation"

// src/proxy.ts sends visitors without a session to /login first
export default function Home() {
  redirect("/dashboard")
}
