import { CircleCheck, TriangleAlert } from "lucide-react"
import type { CSSProperties } from "react"

import styles from "@/app/_landing/landing.module.css"

const delay = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` })

// One sale walking through the real Syner flow: sale -> stock drops -> low stock alert -> purchase order
export function SaleTicket() {
  return (
    <figure
      className={styles.ticketWrap}
      aria-label="Ejemplo: una venta de 3 granizados baja el stock de mora de 12 a 9, Syner avisa que quedó bajo el mínimo y crea la orden de compra."
    >
      <div className={styles.ticket} aria-hidden>
        <div className={styles.ticketHead}>
          <span>Granizados La Esquina</span>
          <span>#0142</span>
        </div>

        <div className={styles.ticketStep} style={delay(300)}>
          <div className={styles.ticketRow}>
            <span className={styles.ticketStrong}>3 × Granizado de mora</span>
            <span>$ 21.000</span>
          </div>
          <span className={styles.ticketMuted}>Venta registrada</span>
        </div>

        <div className={styles.ticketStep} style={delay(900)}>
          <div className={styles.ticketRow}>
            <span>Stock de mora</span>
            <span className={styles.ticketStrong}>12 → 9</span>
          </div>
          <div className={styles.stockBar}>
            <div className={styles.stockFill} />
            <div className={styles.stockMin} />
          </div>
        </div>

        <div className={`${styles.ticketStep} ${styles.alert}`} style={delay(2100)}>
          <span className={styles.ticketIcon}>
            <TriangleAlert />
          </span>
          <span className={styles.ticketStrong}>Quedan 9, el mínimo es 10</span>
        </div>

        <div className={`${styles.ticketStep} ${styles.order}`} style={delay(2900)}>
          <span className={styles.ticketIcon}>
            <CircleCheck />
          </span>
          <span className={styles.ticketStrong}>Orden de compra creada</span>
          <div className={styles.ticketMuted}>20 und. de mora para Frutas del Valle</div>
        </div>
      </div>
    </figure>
  )
}
