import Link from "next/link"

import styles from "@/app/_landing/landing.module.css"
import { BrandLink } from "@/app/_landing/components/brand-link"

export function LandingHeader() {
  return (
    <header className={styles.container}>
      <div className={styles.header}>
        <BrandLink />
        <Link href="/login" className={`${styles.button} ${styles.secondary}`}>
          Iniciar sesión
        </Link>
      </div>
    </header>
  )
}
