"use client"

import { Search } from "lucide-react"

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

export function ProductFilters({
  value,
  onChange,
}: {
  value: FilterValues
  onChange: (value: FilterValues) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative w-full sm:w-64">
        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          aria-label="Buscar por nombre"
          placeholder="Buscar por nombre"
          className="pl-8"
          value={value.nombre}
          onChange={(event) => onChange({ ...value, nombre: event.target.value })}
        />
      </div>
      <Input
        aria-label="Proveedor"
        placeholder="Proveedor"
        className="w-full sm:w-48"
        value={value.proveedor}
        onChange={(event) => onChange({ ...value, proveedor: event.target.value })}
      />
      <Select
        value={value.categoria ?? ALL}
        onValueChange={(categoria) =>
          onChange({ ...value, categoria: categoria === ALL ? undefined : (categoria as Category) })
        }
      >
        <SelectTrigger aria-label="Categoría" className="w-full sm:w-44">
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
    </div>
  )
}
