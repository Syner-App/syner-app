import { Bricolage_Grotesque } from "next/font/google"

// Display face for the landing only; body text keeps Geist from the root layout
export const displayFont = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["wdth"],
})
