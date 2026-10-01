"use client"

import * as React from "react"
import {
  AudioLines,
  BookOpen,
  Bot,
  Frame,
  GalleryVerticalEnd,
  Map as MapIcon,
  PieChart,
  Settings2,
  SquareTerminal,
  Terminal,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain } from "@/app/dashboard/components/nav-main"
import { NavProjects } from "@/app/dashboard/components/nav-projects"
import { NavUser } from "@/app/dashboard/components/nav-user"
import { TeamSwitcher } from "@/app/dashboard/components/team-switcher"

// Datos de ejemplo hasta conectar con el backend.
const data = {
  user: {
    name: "Usuario Syner",
    email: "usuario@syner.app",
    avatar: "",
  },
  teams: [
    {
      name: "Syner",
      logo: <GalleryVerticalEnd />,
      plan: "Enterprise",
    },
    {
      name: "Syner Labs",
      logo: <AudioLines />,
      plan: "Startup",
    },
    {
      name: "Syner Dev",
      logo: <Terminal />,
      plan: "Gratis",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: <SquareTerminal />,
      isActive: true,
      items: [
        { title: "Historial", url: "#" },
        { title: "Favoritos", url: "#" },
        { title: "Ajustes", url: "#" },
      ],
    },
    {
      title: "Modelos",
      url: "#",
      icon: <Bot />,
      items: [
        { title: "Genesis", url: "#" },
        { title: "Explorer", url: "#" },
        { title: "Quantum", url: "#" },
      ],
    },
    {
      title: "Documentación",
      url: "#",
      icon: <BookOpen />,
      items: [
        { title: "Introducción", url: "#" },
        { title: "Primeros pasos", url: "#" },
        { title: "Tutoriales", url: "#" },
        { title: "Cambios", url: "#" },
      ],
    },
    {
      title: "Configuración",
      url: "#",
      icon: <Settings2 />,
      items: [
        { title: "General", url: "#" },
        { title: "Equipo", url: "#" },
        { title: "Facturación", url: "#" },
        { title: "Límites", url: "#" },
      ],
    },
  ],
  projects: [
    { name: "Ingeniería de diseño", url: "#", icon: <Frame /> },
    { name: "Ventas y marketing", url: "#", icon: <PieChart /> },
    { name: "Viajes", url: "#", icon: <MapIcon /> },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
