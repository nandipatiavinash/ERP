"use client";

import { useTransition, useState } from "react";
import { createErpUser } from "@/app/(app)/_actions";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { statusOptions } from "@/lib/modules";
import { showSuccess } from "@/lib/toast";

type RoleOption = { id: string; name: string };
type CustomerOption = { id: string; customer_name: string };

export function UserForm({ roles, customers }: { roles: RoleOption[]; customers?: CustomerOption[] }) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedRoleName, setSelectedRoleName] = useState<string>("");

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = roles.find((r) => r.id === e.target.value);
    setSelectedRoleName(selected?.name ?? "");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg(null);
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      try {
        const res = await createErpUser(null, formData);
        if (res && res.error) {
          setErrorMsg(res.error);
        } else {
          showSuccess("User created successfully!");
          form.reset();
          setSelectedRoleName("");
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to create user.");
      }
    });
  };

  const isClient = selectedRoleName === "client";

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input id="full_name" name="full_name" required disabled={isPending} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" disabled={isPending} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Temporary Password</Label>
        <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" disabled={isPending} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" autoComplete="tel" disabled={isPending} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role_id">Role</Label>
        <select
          id="role_id"
          name="role_id"
          required
          defaultValue=""
          onChange={handleRoleChange}
          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          disabled={isPending}
        >
          <option value="" disabled>Select role</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select id="status" name="status" defaultValue="active" className="h-10 w-full rounded-md border bg-background px-3 text-sm" disabled={isPending}>
          {statusOptions.map((status) => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
      </div>

      {/* Customer Firm — only shown for 'client' role */}
      {isClient && (
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="customer_id">Customer Firm <span className="text-red-500">*</span></Label>
          <select
            id="customer_id"
            name="customer_id"
            required={isClient}
            defaultValue=""
            className="h-10 w-full rounded-md border bg-background px-3 text-sm font-semibold"
            disabled={isPending}
          >
            <option value="" disabled>Select Customer Firm...</option>
            {(customers ?? []).map((c) => (
              <option key={c.id} value={c.id}>{c.customer_name}</option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            This client will only see products and orders belonging to this firm.
          </p>
        </div>
      )}

      {errorMsg && <p className="text-sm text-destructive md:col-span-2">{errorMsg}</p>}
      <div className="md:col-span-2">
        <ConfirmSubmitButton disabled={isPending} confirmTitle="Create Supabase user?" confirmDescription="Confirm the user details and role before creating the authentication account.">
          {isPending ? "Creating..." : "Create Supabase User"}
        </ConfirmSubmitButton>
      </div>
    </form>
  );
}
