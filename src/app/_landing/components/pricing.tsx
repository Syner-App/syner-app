import { Check } from "lucide-react"
import Link from "next/link"

import styles from "@/app/_landing/landing.module.css"
import { ContactButtons } from "@/app/_landing/components/contact-buttons"
import { MONTHLY_PRICE_COP, formatCop } from "@/app/_landing/utils/contact"

const INCLUDED = [
  "Inventario, ventas, alertas, órdenes de compra y finanzas",
  "Usuarios para tu equipo, con permisos según su rol",
  "Acceso desde el computador y el celular, sin instalar nada",
  "Tus datos separados de los de cualquier otro negocio",
]

export function Pricing() {
  return (
    <section id="precio" className={styles.section}>
      <div className={`${styles.container} ${styles.pricing}`}>
        <div>
          <h2 className={styles.sectionTitle}>Un solo plan, todo incluido</h2>
          <p className={styles.price}>
            <span className={styles.priceAmount}>{formatCop(MONTHLY_PRICE_COP)}</span>
            <span className={styles.pricePeriod}>COP al mes</span>
          </p>
        </div>
        <div>
          <ul className={styles.included}>
            {INCLUDED.map((item) => (
              <li key={item} className={styles.includedItem}>
                <Check aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <ContactButtons />
          <p className={styles.contactHint}>
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className={styles.textLink}>
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
