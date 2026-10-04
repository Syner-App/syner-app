import type { Metadata } from "next"

import styles from "@/app/_landing/landing.module.css"
import { displayFont } from "@/app/_landing/fonts"
import { Features } from "@/app/_landing/components/features"
import { Hero } from "@/app/_landing/components/hero"
import { LandingFooter } from "@/app/_landing/components/landing-footer"
import { LandingHeader } from "@/app/_landing/components/landing-header"
import { Pains } from "@/app/_landing/components/pains"
import { Pricing } from "@/app/_landing/components/pricing"
import { Steps } from "@/app/_landing/components/steps"

const description =
  "Inventario, ventas, compras y finanzas para negocios que venden productos. Deja el cuaderno por $60.000 COP al mes."

export const metadata: Metadata = {
  title: { absolute: "Syner: inventario, ventas y finanzas para tu negocio" },
  description,
  openGraph: {
    title: "Syner",
    description,
    locale: "es_CO",
    type: "website",
  },
}

// Public landing; src/proxy.ts sends visitors with a session straight to /dashboard
export default function Home() {
  return (
    <div className={`${displayFont.variable} ${styles.root}`}>
      <LandingHeader />
      <main>
        <Hero />
        <Pains />
        <Features />
        <Steps />
        <Pricing />
      </main>
      <LandingFooter />
    </div>
  )
}
