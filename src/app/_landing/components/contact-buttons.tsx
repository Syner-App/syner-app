import { Mail, MessageCircle } from "lucide-react"
import type { ReactNode } from "react"

import styles from "@/app/_landing/landing.module.css"
import { mailtoHref, whatsappHref } from "@/app/_landing/utils/contact"

function ContactButton({
  href,
  icon,
  label,
  variant,
}: {
  href: string | null
  icon: ReactNode
  label: string
  variant: "primary" | "secondary"
}) {
  if (!href) {
    return (
      <span className={`${styles.button} ${styles.disabled}`} aria-disabled="true">
        {icon}
        {label}, disponible pronto
      </span>
    )
  }
  const external = href.startsWith("http")
  return (
    <a
      href={href}
      className={`${styles.button} ${styles[variant]}`}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {icon}
      {label}
    </a>
  )
}

export function ContactButtons() {
  return (
    <div className={styles.actions}>
      <ContactButton
        href={whatsappHref()}
        icon={<MessageCircle aria-hidden />}
        label="Escribir por WhatsApp"
        variant="primary"
      />
      <ContactButton
        href={mailtoHref()}
        icon={<Mail aria-hidden />}
        label="Enviar correo"
        variant="secondary"
      />
    </div>
  )
}
