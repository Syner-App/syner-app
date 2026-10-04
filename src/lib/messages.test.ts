import { describe, expect, it } from "vitest"

import { looksEnglish, translate } from "@/lib/messages"

describe("translate", () => {
  it.each([
    ["Only the platform superadmin can manage organizations", "Solo el superadministrador de la plataforma puede gestionar organizaciones"],
    ["Record not found", "El registro no existe"],
    ["A valid organization_id is required", "Selecciona una organización primero"],
    ["cuota_asignada cannot be greater than cuota_mensual", "La cuota asignada no puede ser mayor que la cuota mensual"],
    ["Product validation timed out", "La validación del producto tardó demasiado"],
    ["Product with the same organization_id, codigo_sku already exists", "Ya existe un producto con ese SKU"],
  ])("translates %s", (message, spanish) => {
    expect(translate(message)).toBe(spanish)
  })

  it.each([
    ["Organization with id 64f0 not found", "El registro no existe"],
    ["Credit with id: #12 not found", "El registro no existe"],
    ["Payable #4 is already paid", "La cuenta por pagar ya está pagada"],
    ["Insufficient stock for product #7: 2 available, 5 requested", "Stock insuficiente: hay 2 disponibles y se pidieron 5"],
    ["Product #9 not found or inactive", "El producto #9 no existe o está inactivo"],
    ["Supply with the same organization_id, producto_id already exists", "Ya existe un registro con esos datos"],
    ["Possible estado values are PENDIENTE, APROBADA", "El valor de «estado» no es válido"],
    ["precio_venta must be a positive number", "El campo «precio venta» no es válido"],
    ["items.0.cantidad must not be less than 1", "El campo «cantidad» no es válido"],
    ["Requires one of the roles: owner, admin", "No tienes permiso para esta acción"],
    ["products-ms failed", "El servicio no respondió, intenta de nuevo"],
  ])("translates the pattern %s", (message, spanish) => {
    expect(translate(message)).toBe(spanish)
  })

  it("never shows an unknown English message", () => {
    expect(translate("User not found in request (is AuthGuard applied?)", 500)).toBe(
      "El servicio no está disponible, intenta de nuevo en un momento"
    )
    expect(translate("Something was rejected", 403)).toBe("No tienes permiso para esta acción")
    expect(translate("The thing failed")).toBe("No se pudo completar la operación")
  })

  it("keeps Spanish messages as they are", () => {
    for (const message of [
      "Faltan $ 742.100 para cubrir el capital de trabajo y la reserva",
      "Ocurrió un error inesperado",
      "El proveedor no tenía stock",
    ]) {
      expect(looksEnglish(message)).toBe(false)
      expect(translate(message, 400)).toBe(message)
    }
  })
})
