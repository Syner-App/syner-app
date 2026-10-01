"use client"

import { Search } from "lucide-react"

import { FiltersBar } from "@/components/filters-bar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CATEGORIES, CATEGORY_LABELS, type Category } from "@/app/dashboard/products/utils/types"

export interface FilterValues {
  nombre: string
  proveedor: string
  categoria?: Category
  stock_bajo: boolean
  inactivos: boolean
}

const ALL = "all"

// The name search stays visible on phones; the other filters open in a sheet
export function ProductFilters({
  value,
  onChange,
}: {
  value: FilterValues
  onChange: (value: FilterValues) => void
}) {
  const activeCount =
    (value.proveedor ? 1 : 0) + (value.categoria ? 1 : 0) + (value.stock_bajo ? 1 : 0) + (value.inactivos ? 1 : 0)

  return (
    <FiltersBar
      activeCount={activeCount}
      primary={
        <div className="relative w-full md:w-64">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            aria-label="Buscar por nombre"
            placeholder="Buscar por nombre"
            className="pl-8"
            value={value.nombre}
            onChange={(event) => onChange({ ...value, nombre: event.target.value })}
          />
        </div>
      }
    >
      <Input
        aria-label="Proveedor"
        placeholder="Proveedor"
        className="md:w-48"
        value={value.proveedor}
        onChange={(event) => onChange({ ...value, proveedor: event.target.value })}
      />
      <Select
        value={value.categoria ?? ALL}
        onValueChange={(categoria) =>
          onChange({ ...value, categoria: categoria === ALL ? undefined : (categoria as Category) })
        }
      >
        <SelectTrigger aria-label="Categoría" className="md:w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Todas las categorías</SelectItem>
          {CATEGORIES.map((categoria) => (
            <SelectItem key={categoria} value={categoria}>
              {CATEGORY_LABELS[categoria]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Label className="flex items-center gap-2 font-normal">
        <Checkbox
          checked={value.stock_bajo}
          onCheckedChange={(checked) => onChange({ ...value, stock_bajo: checked === true })}
        />
        Stock bajo
      </Label>
      <Label className="flex items-center gap-2 font-normal">
        <Checkbox
          checked={value.inactivos}
          onCheckedChange={(checked) => onChange({ ...value, inactivos: checked === true })}
        />
        Ver eliminados
      </Label>
    </FiltersBar>
  )
}
