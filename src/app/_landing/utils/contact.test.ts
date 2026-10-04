import { describe, expect, it } from "vitest"

import { formatCop, mailtoHref, whatsappHref } from "@/app/_landing/utils/contact"

describe("contact links", () => {
  it("returns null while the contact is not configured", () => {
    expect(mailtoHref("")).toBeNull()
    expect(whatsappHref("")).toBeNull()
  })

  it("builds a mailto with subject and body", () => {
    const href = mailtoHref("ventas@syner.co")
    expect(href).toMatch(/^mailto:ventas@syner\.co\?subject=Quiero%20acceso%20a%20Syner&body=/)
  })

  it("keeps only digits in the WhatsApp number", () => {
    expect(whatsappHref("+57 300 123 4567")).toMatch(/^https:\/\/wa\.me\/573001234567\?text=/)
  })

  it("formats prices in Colombian pesos", () => {
    expect(formatCop(60000).replace(/\s/g, " ")).toBe("$ 60.000")
  })
})
