import Link from "next/link"

import styles from "@/app/_landing/landing.module.css"

export function BrandLink() {
  return (
    <Link href="/" className={styles.brand}>
      <span className={styles.brandMark} aria-hidden>
        S
      </span>
      Syner
    </Link>
  )
}
