"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Status filter as tabs. On phones the tab list scrolls sideways instead of wrapping
export function FilterTabs<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (value: T) => void
  options: { value: T; label: string }[]
}) {
  return (
    <Tabs value={value} onValueChange={(next) => onChange(next as T)}>
      <div className="-mx-3 overflow-x-auto px-3 [scrollbar-width:none] sm:mx-0 sm:px-0">
        <TabsList>
          {options.map((option) => (
            <TabsTrigger key={option.value} value={option.value} className="px-3">
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  )
}
