// Fill these in to enable the contact buttons; while empty they render as "Disponible pronto"
export const CONTACT_EMAIL = ""
// Country code + number, digits only (e.g. 573001234567)
export const CONTACT_WHATSAPP = ""

export const MONTHLY_PRICE_COP = 60000

const ACCESS_MESSAGE = "Hola, quiero usar Syner en mi negocio. ¿Me ayudan con el acceso?"

export function mailtoHref(email = CONTACT_EMAIL) {
  if (!email) return null
  const params = new URLSearchParams({ subject: "Quiero acceso a Syner", body: ACCESS_MESSAGE })
  return `mailto:${email}?${params.toString().replace(/\+/g, "%20")}`
}

export function whatsappHref(phone = CONTACT_WHATSAPP) {
  const digits = phone.replace(/\D/g, "")
  if (!digits) return null
  return `https://wa.me/${digits}?text=${encodeURIComponent(ACCESS_MESSAGE)}`
}

export function formatCop(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value)
}
