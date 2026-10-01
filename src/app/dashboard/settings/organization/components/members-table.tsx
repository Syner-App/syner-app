"use client"

import { Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ROLE_LABELS, ROLES } from "@/lib/permissions"
import type { Member, Role } from "@/lib/types"

// Members of an organization. Role changes and removals are offered per member according
// to the caller's permissions (also used by the platform panel)
export function MembersTable({
  members,
  isLoading,
  currentUserId,
  canChangeRole,
  canRemove,
  onChangeRole,
  onRemove,
}: {
  members?: Member[]
  isLoading: boolean
  currentUserId?: string
  canChangeRole: (member: Member) => boolean
  canRemove: (member: Member) => boolean
  onChangeRole?: (member: Member, role: Role) => void
  onRemove: (member: Member) => void
}) {
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead className="w-44">Rol</TableHead>
            <TableHead className="w-12">
              <span className="sr-only">Acciones</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: 3 }, (_, index) => (
              <TableRow key={index}>
                <TableCell colSpan={4}>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              </TableRow>
            ))}
          {!isLoading && members?.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                Sin miembros todavía.
              </TableCell>
            </TableRow>
          )}
          {members?.map((member) => {
            const isSelf = member.user_id === currentUserId
            return (
              <TableRow key={member.user_id}>
                <TableCell className="font-medium">
                  {member.name}
                  {isSelf && <span className="text-muted-foreground"> (tú)</span>}
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  {!isSelf && onChangeRole && canChangeRole(member) ? (
                    <Select value={member.role} onValueChange={(role) => onChangeRole(member, role as Role)}>
                      <SelectTrigger size="sm" className="w-36" aria-label={`Rol de ${member.name}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((role) => (
                          <SelectItem key={role} value={role}>
                            {ROLE_LABELS[role]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant={member.role === "owner" ? "default" : "secondary"}>
                      {ROLE_LABELS[member.role]}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {!isSelf && canRemove(member) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Quitar a ${member.name}`}
                      onClick={() => onRemove(member)}
                    >
                      <Trash2 />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
