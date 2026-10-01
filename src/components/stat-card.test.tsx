import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { StatCard } from "@/components/stat-card"

describe("StatCard", () => {
  it("renders the title and the value", () => {
    render(<StatCard title="Ventas" value="$ 1.000" />)
    expect(screen.getByText("Ventas")).toBeInTheDocument()
    expect(screen.getByText("$ 1.000")).toBeInTheDocument()
  })

  it("wraps the tile in a link when it has an href", () => {
    render(<StatCard title="Alertas" value={3} href="/dashboard/alerts" />)
    expect(screen.getByRole("link")).toHaveAttribute("href", "/dashboard/alerts")
  })

  it("renders no value while loading", () => {
    render(<StatCard title="Gastos" />)
    expect(screen.getByText("Gastos")).toBeInTheDocument()
    expect(screen.queryByRole("link")).not.toBeInTheDocument()
  })
})
