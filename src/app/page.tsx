import { Mail } from "lucide-react"

import { UiShowcase } from "@/components/ui-showcase"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Syner App</CardTitle>
          <CardDescription>shadcn/ui + Lucide listos.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">
              <Mail className="size-4" />
              Email
            </Label>
            <Input id="email" type="email" placeholder="tu@correo.com" />
          </div>
          <UiShowcase />
        </CardContent>
      </Card>
    </main>
  )
}
