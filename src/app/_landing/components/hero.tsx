import Link from "next/link"

import styles from "@/app/_landing/landing.module.css"
import { SaleTicket } from "@/app/_landing/components/sale-ticket"
import { MONTHLY_PRICE_COP, formatCop } from "@/app/_landing/utils/contact"

export function Hero() {
  return (
    <section className={`${styles.container} ${styles.hero}`}>
      <div>
        <h1 className={styles.heroTitle}>Deja el cuaderno.</h1>
        <p className={styles.heroLead}>
          Syner lleva el inventario, las ventas, las compras y las cuentas de tu negocio en un solo
          lugar, en el computador o en el celular. Para la granizadería, la tienda de ropa y
          calzado, la cocina o el taller que fabrica lo que vende.
        </p>
        <div className={styles.actions}>
          <a href="#precio" className={`${styles.button} ${styles.primary}`}>
            Pedir acceso
          </a>
          <Link href="/login" className={`${styles.button} ${styles.secondary}`}>
            Iniciar sesión
          </Link>
        </div>
        <p className={styles.heroNote}>
          {formatCop(MONTHLY_PRICE_COP)} COP al mes, todo incluido.
        </p>
      </div>
      <SaleTicket />
    </section>
  )
}
