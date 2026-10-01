"use client"

import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { cn } from "@/lib/utils"
import { useProducts } from "@/app/dashboard/products/hooks/useProducts"
import type { Product } from "@/app/dashboard/products/utils/types"

// Searchable product picker; the search runs in products-ms (nombre filter)
export function ProductCombobox({
  id,
  value,
  onChange,
  invalid,
  placeholder = "Elige un producto",
}: {
  id?: string
  value?: Product
  onChange: (product: Product) => void
  invalid?: boolean
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const nombre = useDebouncedValue(search.trim())
  const products = useProducts({ page: 1, limit: 20, nombre: nombre || undefined })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={invalid}
          className="w-full justify-between font-normal"
        >
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {value ? value.nombre : placeholder}
          </span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) min-w-64 p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Buscar producto…" value={search} onValueChange={setSearch} />
          <CommandList>
            {products.isFetching && !products.data ? (
              <div className="flex justify-center p-4">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <CommandEmpty>No hay productos.</CommandEmpty>
            )}
            <CommandGroup>
              {products.data?.data.map((product) => (
                <CommandItem
                  key={product.id}
                  value={String(product.id)}
                  onSelect={() => {
                    onChange(product)
                    setOpen(false)
                  }}
                >
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate">{product.nombre}</span>
                    <span className="text-xs text-muted-foreground">
                      {product.codigo_sku} · stock {product.stock_actual}
                    </span>
                  </div>
                  <Check className={cn("ml-auto", value?.id === product.id ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
