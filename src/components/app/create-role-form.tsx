"use client";

import { useTransition, useState } from "react";
import { createRole } from "@/app/(app)/_actions";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showSuccess } from "@/lib/toast";

export function CreateRoleForm() {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        await createRole(formData);
        showSuccess("Role created successfully!");
        event.currentTarget.reset();
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to create role.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1fr_2fr_auto] md:items-end">
      <div className="space-y-2">
        <Label htmlFor="name">Role Name</Label>
        <Input id="name" name="name" placeholder="e.g. Fabric Operator" required disabled={isPending} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" name="description" placeholder="Optional role description" disabled={isPending} />
      </div>
      <ConfirmSubmitButton disabled={isPending} confirmTitle="Create role?" confirmDescription="Confirm the role name before creating it.">
        {isPending ? "Creating..." : "Create Role"}
      </ConfirmSubmitButton>
      {errorMsg && <p className="text-sm text-destructive md:col-span-3">{errorMsg}</p>}
    </form>
  );
}
