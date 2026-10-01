import { ModeToggle } from "@/components/mode-toggle"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/app/dashboard/components/app-sidebar"
import { DashboardBreadcrumb } from "@/app/dashboard/components/dashboard-breadcrumb"

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 bg-background/95 backdrop-blur transition-[width,height] ease-linear supports-backdrop-filter:bg-background/80 md:static md:h-16 md:bg-background md:backdrop-blur-none group-has-data-[collapsible=icon]/sidebar-wrapper:md:h-12">
          <div className="flex min-w-0 items-center gap-2 px-3 sm:px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <DashboardBreadcrumb />
          </div>
          <div className="ml-auto px-3 sm:px-4">
            <ModeToggle />
          </div>
        </header>
        <div className="flex min-w-0 flex-1 flex-col gap-4 p-3 pt-1 pb-8 sm:p-4 sm:pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
