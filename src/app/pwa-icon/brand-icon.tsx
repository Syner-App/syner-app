import { ImageResponse } from "next/og";

// Colores de los tokens --primary / --primary-foreground (tema claro) en globals.css
export const BRAND_BACKGROUND = "#171717";
export const BRAND_FOREGROUND = "#fafafa";

// La "S" ocupa ~45% del lado para quedar dentro de la zona segura de los íconos maskable
export function brandIcon(size: number) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BRAND_BACKGROUND,
          color: BRAND_FOREGROUND,
          fontSize: size * 0.55,
          fontWeight: 700,
        }}
      >
        S
      </div>
    ),
    { width: size, height: size },
  );
}
