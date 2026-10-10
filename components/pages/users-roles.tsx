"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Table, TD, TH, THead, TRow } from "@/components/ui/table";
import { ConfirmPopover } from "@/components/ui/confirm-popover";
import { InviteUserModal } from "@/components/modals/invite-user-modal";
import { useErpStore } from "@/lib/store";
import { UserX } from "lucide-react";

export function UsersRoles() {
  const users = useErpStore((s) => s.users);
  const deactivateUser = useErpStore((s) => s.deactivateUser);
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Users & roles"
        description="Everyone with access to Timberline ERP."
        actions={
          <Button variant="primary" onClick={() => setInviteOpen(true)}>
            <Plus size={14} /> Invite user
          </Button>
        }
      />

      <Card>
        <Table>
          <THead>
            <tr>
              <TH>Name</TH>
              <TH>Role</TH>
              <TH>Status</TH>
              <TH>Last active</TH>
              <TH />
            </tr>
          </THead>
          <tbody>
            {users.map((u) => (
              <TRow key={u.id}>
                <TD>
                  <div className="flex items-center gap-3">
                    <Avatar name={u.name} size={34} />
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-[12px] text-[var(--muted-foreground)]">{u.email}</p>
                    </div>
                  </div>
                </TD>
                <TD>
                  <Badge tone="slate">{u.role === "Owner" ? "Owner / Admin" : u.role === "Driver" ? "Driver / Dispatch" : u.role}</Badge>
                </TD>
                <TD>
                  <StatusBadge status={u.status} />
                </TD>
                <TD className="text-[var(--muted-foreground)]">{u.lastActive}</TD>
                <TD>
                  {u.status !== "Deactivated" && (
                    <ConfirmPopover
                      message="Deactivate this user?"
                      confirmLabel="Deactivate"
                      onConfirm={() => deactivateUser(u.id)}
                      trigger={
                        <button className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--muted-foreground)] hover:bg-[var(--accent-red-bg)] hover:text-[var(--accent-red)] transition-colors">
                          <UserX size={14} />
                        </button>
                      }
                    />
                  )}
                </TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>

      <InviteUserModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  );
}
