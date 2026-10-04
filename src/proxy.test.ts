import { NextRequest } from "next/server"
import { describe, expect, it } from "vitest"

import { SESSION_COOKIE } from "@/lib/session"
import { proxy } from "@/proxy"

function request(pathname: string, withSession: boolean) {
  const req = new NextRequest(new URL(pathname, "http://localhost:3001"))
  if (withSession) req.cookies.set(SESSION_COOKIE, "token")
  return req
}

function location(res: Response) {
  const header = res.headers.get("location")
  return header ? new URL(header).pathname : null
}

describe("proxy", () => {
  it("shows the landing to visitors without a session", () => {
    expect(location(proxy(request("/", false)))).toBeNull()
  })

  it("sends signed-in users from the landing to the dashboard", () => {
    expect(location(proxy(request("/", true)))).toBe("/dashboard")
  })

  it("sends signed-in users from /login to the dashboard", () => {
    expect(location(proxy(request("/login", true)))).toBe("/dashboard")
  })

  it("sends visitors without a session from the dashboard to /login", () => {
    expect(location(proxy(request("/dashboard/products", false)))).toBe("/login")
  })
})
