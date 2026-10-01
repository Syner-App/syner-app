// Root of every finance query: a finance mutation invalidates all of them, since a sale,
// a payment or a movement changes the reports, the waterfall and the dashboard at once
export const FINANCE_KEY = ["finance"]
