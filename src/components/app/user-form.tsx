"use client";

import { useTransition, useState } from "react";
import { createErpUser } from "@/app/(app)/_actions";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { statusOptions } from "@/lib/modules";
import { showSuccess } from "@/lib/toast";

type RoleOption = { id: string; name: string };

export function UserForm({ roles }: { roles: RoleOption[] }) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        const res = await createErpUser(null, formData);
        if (res && res.error) {
          setErrorMsg(res.error);
        } else {
          showSuccess("User created successfully!");
          event.currentTarget.reset();
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to create user.");
      }
    });
  };

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
        <select id="role_id" name="role_id" required defaultValue="" className="h-10 w-full rounded-md border bg-background px-3 text-sm" disabled={isPending}>
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
      {errorMsg && <p className="text-sm text-destructive md:col-span-2">{errorMsg}</p>}
      <div className="md:col-span-2">
        <ConfirmSubmitButton disabled={isPending} confirmTitle="Create Supabase user?" confirmDescription="Confirm the user details and role before creating the authentication account.">
          {isPending ? "Creating..." : "Create Supabase User"}
        </ConfirmSubmitButton>
      </div>
    </form>
  );
}
