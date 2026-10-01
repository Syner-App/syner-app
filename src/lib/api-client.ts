// Browser calls to the BFF route handlers (src/app/api), which forward them to
// client-gateway with the session cookie

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly messages: string[]
  ) {
    super(messages.join(". "))
    this.name = "ApiError"
  }
}

// Spanish text for the backend messages a user can run into; anything else is shown as is
const MESSAGES: Record<string, string> = {
  "Invalid credentials": "Correo o contraseña incorrectos",
  "Invalid token": "Tu sesión expiró, vuelve a iniciar sesión",
  "You do not belong to any active organization": "No perteneces a ninguna organización activa",
  "You are not a member of this organization": "No eres miembro de esta organización",
  "The organization is suspended": "La organización está suspendida",
  "You cannot change your own role": "No puedes cambiar tu propio rol",
  "You cannot remove yourself": "No puedes quitarte a ti mismo",
  "An admin can only add members with role user": "Un administrador solo puede agregar miembros con rol usuario",
  "An admin can only remove members with role user": "Un administrador solo puede quitar miembros con rol usuario",
  "name and password are required to create a new user":
    "El usuario no existe: ingresa nombre y contraseña para crearlo",
  "Product with the same organization_id, codigo_sku already exists": "Ya existe un producto con ese SKU",
}

function translate(message: string): string {
  if (MESSAGES[message]) return MESSAGES[message]
  if (/is already a member/.test(message)) return "El usuario ya es miembro de la organización"
  const stock = /^Insufficient stock .*: (\d+) available, (\d+) requested/.exec(message)
  if (stock) return `Stock insuficiente: hay ${stock[1]} disponibles y se pidieron ${stock[2]}`
  if (/^Organization .+ already exists$/.test(message)) return "Ya existe una organización con ese slug"
  return translateOperations(message)
}

// orders-ms and finance-ms
const OPERATION_MESSAGES: Record<string, string> = {
  "Register the break-even assumptions first": "Primero registra los supuestos del punto de equilibrio",
  "Register the recipes or a manual costo_variable_unitario in the assumptions":
    "Registra las recetas o un costo variable unitario manual en los supuestos",
  "Product validation timed out": "La validación del producto tardó demasiado",
}

const OPERATION_PATTERNS: [RegExp, (match: RegExpExecArray) => string][] = [
  [/^Purchase order #\S+ is (\w+) and cannot be moved to (\w+)/, (m) => `La orden está ${m[1]} y no puede pasar a ${m[2]}`],
  [/^Purchase order #\S+ already has a payable/, () => "La orden ya tiene una cuenta por pagar"],
  [/^Product #(\d+) not found or inactive/, (m) => `El producto #${m[1]} no existe o está inactivo`],
  [/^(\w[\w ]*) with id: #\S+ not found/, () => "El registro no existe"],
  [/^Credit #\S+ is already paid off/, () => "El crédito ya está pagado"],
  [/^Expense #\S+ is already paid/, () => "El gasto ya está pagado"],
  [/^Recipe #\S+ \((.+)\) is inactive/, (m) => `La receta ${m[1]} está inactiva`],
  [/^The supplies of sale #\S+ were already discounted/, () => "Los insumos de esta venta ya se descontaron"],
  [/^The period (\S+) is closed; reopen it/, (m) => `El periodo ${m[1]} está cerrado: reábrelo para registrar movimientos`],
  [/^The period (\S+) is not closed/, (m) => `El periodo ${m[1]} no está cerrado`],
  [/^The period (\S+) has not started yet/, (m) => `El periodo ${m[1]} aún no ha empezado`],
  [/^The period (\S+) is already closed/, (m) => `El periodo ${m[1]} ya está cerrado`],
  [/^The prepayment \((\d+)\) is greater than the principal \((\d+)\)/, (m) => `El abono (${m[1]}) supera el saldo de capital (${m[2]})`],
  [/is not available/, () => "El servicio no está disponible, intenta de nuevo en un momento"],
]

function translateOperations(message: string): string {
  if (OPERATION_MESSAGES[message]) return OPERATION_MESSAGES[message]
  for (const [pattern, toSpanish] of OPERATION_PATTERNS) {
    const match = pattern.exec(message)
    if (match) return toSpanish(match)
  }
  return message
}

type Query = Record<string, string | number | boolean | undefined | null>

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: unknown
  query?: Query
  // false for calls where a 401 is an expected answer (login)
  redirectOnUnauthorized?: boolean
}

function toSearch(query?: Query): string {
  if (!query) return ""
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value))
  }
  const search = params.toString()
  return search ? `?${search}` : ""
}

export async function apiFetch<T>(
  path: string,
  { method = "GET", body, query, redirectOnUnauthorized = true }: ApiOptions = {}
): Promise<T> {
  let response: Response
  try {
    response = await fetch(`/api${path}${toSearch(query)}`, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, ["No se pudo conectar con el servidor"])
  }

  const text = await response.text()
  const data: unknown = text ? JSON.parse(text) : null

  if (!response.ok) {
    if (response.status === 401 && redirectOnUnauthorized) {
      // A full reload on purpose: it drops every cached query of the expired session
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/login")
    }
    // The gateway sends message as a string (gRPC errors) or a string[] (validation)
    const message = (data as { message?: string | string[] } | null)?.message
    const messages = Array.isArray(message) ? message : [message ?? "Ocurrió un error inesperado"]
    throw new ApiError(response.status, messages.map(translate))
  }
  return data as T
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Ocurrió un error inesperado"
}
