import Link from "next/link"

import styles from "@/app/_landing/landing.module.css"
import { BrandLink } from "@/app/_landing/components/brand-link"

export function LandingFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} ${styles.footerInner}`}>
        <BrandLink />
        <Link href="/login" className={styles.textLink}>
          Iniciar sesión
        </Link>
      </div>
    </footer>
  )
}
