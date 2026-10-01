"use client"

import { PageHeader } from "@/components/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GeneralForm } from "@/app/dashboard/settings/organization/components/general-form"
import { MembersPanel } from "@/app/dashboard/settings/organization/components/members-panel"

export function OrganizationSettings() {
  return (
    <>
      <PageHeader title="Organización" description="Datos de la organización y quién tiene acceso." />
      <Tabs defaultValue="general" className="gap-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="members">Miembros</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <GeneralForm />
        </TabsContent>
        <TabsContent value="members">
          <MembersPanel />
        </TabsContent>
      </Tabs>
    </>
  )
}
