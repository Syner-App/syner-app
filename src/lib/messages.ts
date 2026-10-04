// Spanish text for the backend messages a user can run into. The services answer in English;
// anything without a translation that still reads as English is replaced by a generic message
// for its status, so no English ever reaches the screen

// auth-ms and client-gateway
const MESSAGES: Record<string, string> = {
  "Invalid credentials": "Correo o contraseña incorrectos",
  "Invalid token": "Tu sesión expiró, vuelve a iniciar sesión",
  "Token not found": "Tu sesión expiró, vuelve a iniciar sesión",
  "You do not belong to any active organization": "No perteneces a ninguna organización activa",
  "You are not a member of this organization": "No eres miembro de esta organización",
  "The organization is suspended": "La organización está suspendida",
  "You cannot change your own role": "No puedes cambiar tu propio rol",
  "You cannot remove yourself": "No puedes quitarte a ti mismo",
  "An admin can only add members with role user": "Un administrador solo puede agregar miembros con rol usuario",
  "An admin can only remove members with role user": "Un administrador solo puede quitar miembros con rol usuario",
  "name and password are required to create a new user":
    "El usuario no existe: ingresa nombre y contraseña para crearlo",
  "Only the platform superadmin can manage organizations":
    "Solo el superadministrador de la plataforma puede gestionar organizaciones",
  "You cannot manage this organization": "No puedes gestionar esta organización",
  "Requires the platform superadmin": "Solo el superadministrador de la plataforma puede hacer esto",
  "slug must be lowercase letters and numbers separated by dashes":
    "El slug solo admite minúsculas y números separados por guiones",
  "Product with the same organization_id, codigo_sku already exists": "Ya existe un producto con ese SKU",
}

// products-ms, orders-ms and finance-ms
const OPERATION_MESSAGES: Record<string, string> = {
  "Register the break-even assumptions first": "Primero registra los supuestos del punto de equilibrio",
  "Register the recipes or a manual costo_variable_unitario in the assumptions":
    "Registra los productos o un costo variable unitario manual en los supuestos",
  "Product validation timed out": "La validación del producto tardó demasiado",
  "Invalid product": "El producto no es válido",
  "Record not found": "El registro no existe",
  "A valid organization_id is required": "Selecciona una organización primero",
  "motivo is required when estado is RECHAZADA": "El motivo es obligatorio para rechazar la orden",
  "A supply appears more than once in the recipe": "Un insumo aparece más de una vez en el producto",
  "Every item must be a supply of the organization (link it first with UpsertSupply)":
    "Cada ingrediente debe ser un insumo de la organización: regístralo primero en Insumos",
  "cuota_asignada cannot be greater than cuota_mensual": "La cuota asignada no puede ser mayor que la cuota mensual",
  "abono_capital cannot be greater than monto": "El abono a capital no puede ser mayor que el monto",
}

const PATTERNS: [RegExp, (match: RegExpExecArray) => string][] = [
  [/is already a member/, () => "El usuario ya es miembro de la organización"],
  [
    /^Insufficient stock .*: (\d+) available, (\d+) requested/,
    (m) => `Stock insuficiente: hay ${m[1]} disponibles y se pidieron ${m[2]}`,
  ],
  [/^Organization \S+ already exists$/, () => "Ya existe una organización con ese slug"],
  [/already exists$/, () => "Ya existe un registro con esos datos"],
  [/^Select an organization first/, () => "Selecciona una organización primero"],
  [/^Requires one of the roles/, () => "No tienes permiso para esta acción"],
  [/^Purchase order #\S+ is (\w+) and cannot be moved to (\w+)/, (m) => `La orden está ${m[1]} y no puede pasar a ${m[2]}`],
  [/^Purchase order #\S+ already has a payable/, () => "La orden ya tiene una cuenta por pagar"],
  [/^Product #(\d+) not found or inactive/, (m) => `El producto #${m[1]} no existe o está inactivo`],
  [/^(\w[\w ]*) with id:? #?\S+ not found/, () => "El registro no existe"],
  [/^Credit #\S+ is already paid off/, () => "El crédito ya está pagado"],
  [/^Expense #\S+ is already paid/, () => "El gasto ya está pagado"],
  [/^Payable #\S+ is already paid/, () => "La cuenta por pagar ya está pagada"],
  [/^Recipe #\S+ \((.+)\) is inactive/, (m) => `El producto ${m[1]} está inactivo`],
  [/^The supplies of sale #\S+ were already discounted/, () => "Los insumos de esta venta ya se descontaron"],
  [/^The period (\S+) is closed; reopen it/, (m) => `El periodo ${m[1]} está cerrado: reábrelo para registrar movimientos`],
  [/^The period (\S+) is not closed/, (m) => `El periodo ${m[1]} no está cerrado`],
  [/^The period (\S+) has not started yet/, (m) => `El periodo ${m[1]} aún no ha empezado`],
  [/^The period (\S+) is already closed/, (m) => `El periodo ${m[1]} ya está cerrado`],
  [/^Low stock alert sync/, () => "No se pudo sincronizar la alerta de stock bajo, intenta de nuevo"],
  [/^\S+-ms failed$/, () => "El servicio no respondió, intenta de nuevo"],
  [/is not available/, () => "El servicio no está disponible, intenta de nuevo en un momento"],
  // class-validator (gateway and services): "precio must be a positive number"
  [/^Possible (\w+) values are/, (m) => `El valor de «${field(m[1])}» no es válido`],
  [/^([\w.]+) (must|should) /, (m) => `El campo «${field(m[1])}» no es válido`],
]

// "items.0.cantidad" -> "cantidad", "costo_unitario" -> "costo unitario"
function field(name: string): string {
  return (name.split(".").pop() ?? name).replace(/_/g, " ")
}

const ENGLISH = /\b(the|is|are|was|were|not|found|failed|must|should|required|already|cannot|invalid|requires|select|timed out|available|requested|unauthorized|forbidden|internal|server)\b/i

export function looksEnglish(message: string): boolean {
  return ENGLISH.test(message)
}

function genericMessage(status?: number): string {
  if (status === 400) return "Revisa los datos ingresados"
  if (status === 401) return "Tu sesión expiró, vuelve a iniciar sesión"
  if (status === 403) return "No tienes permiso para esta acción"
  if (status === 404) return "El registro no existe"
  if (status === 409) return "Ya existe un registro con esos datos"
  if (status !== undefined && status >= 500) return "El servicio no está disponible, intenta de nuevo en un momento"
  return "No se pudo completar la operación"
}

// status: the HTTP status of the answer, to pick the generic message
export function translate(message: string, status?: number): string {
  const known = MESSAGES[message] ?? OPERATION_MESSAGES[message]
  if (known) return known
  for (const [pattern, toSpanish] of PATTERNS) {
    const match = pattern.exec(message)
    if (match) return toSpanish(match)
  }
  return looksEnglish(message) ? genericMessage(status) : message
}
