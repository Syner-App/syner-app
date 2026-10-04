import type { MetadataRoute } from "next";
import { BRAND_BACKGROUND } from "@/app/pwa-icon/brand-icon";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Syner",
    short_name: "Syner",
    description: "Inventario y gestión de organizaciones",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: BRAND_BACKGROUND,
    icons: [
      { src: "/pwa-icon/192", sizes: "192x192", type: "image/png" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png" },
      {
        src: "/pwa-icon/512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
