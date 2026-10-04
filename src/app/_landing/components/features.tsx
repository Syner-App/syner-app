import { BellRing, Package, ShoppingCart, Smartphone, Users, Wallet } from "lucide-react"
import type { CSSProperties } from "react"

import styles from "@/app/_landing/landing.module.css"

const FEATURES = [
  {
    icon: Package,
    accent: "var(--leaf)",
    title: "Inventario",
    text: "Cada producto con su stock, su mínimo y el historial de entradas y salidas. Sabes qué tienes sin ponerte a contar.",
  },
  {
    icon: ShoppingCart,
    accent: "var(--cobalt)",
    title: "Ventas",
    text: "Registras la venta en segundos y el stock se descuenta solo, también el de los insumos de tus productos.",
  },
  {
    icon: BellRing,
    accent: "var(--mango)",
    title: "Alertas y compras",
    text: "Cuando un producto baja de su mínimo, Syner te avisa y arma la orden de compra para el proveedor.",
  },
  {
    icon: Wallet,
    accent: "var(--ink)",
    title: "Finanzas",
    text: "Gastos, cuentas por pagar, créditos y cierre de mes. Ves tu punto de equilibrio y cuánto puedes retirar sin descapitalizar el negocio.",
  },
  {
    icon: Users,
    accent: "var(--ink)",
    title: "Tu equipo, con permisos",
    text: "Cada persona entra con su usuario: quien atiende registra ventas, el administrador maneja inventario y compras, y las decisiones de dinero son tuyas.",
  },
  {
    icon: Smartphone,
    accent: "var(--cobalt)",
    title: "En tu celular",
    text: "Instálalo en el celular como una app y revisa el negocio desde donde estés.",
  },
]

export function Features() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Todo el negocio en un solo lugar</h2>
        <p className={styles.sectionLead}>
          Lo que vendes, lo que tienes, lo que debes y lo que ganas, conectado: una venta mueve el
          inventario, el inventario dispara las compras y todo queda en tus cuentas.
        </p>
        <ul className={styles.features}>
          {FEATURES.map(({ icon: Icon, accent, title, text }) => (
            <li key={title} className={styles.feature} style={{ "--accent": accent } as CSSProperties}>
              <h3 className={styles.featureTitle}>
                <Icon aria-hidden />
                {title}
              </h3>
              <p className={styles.featureText}>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
