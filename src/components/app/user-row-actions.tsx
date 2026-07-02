"use client";

import { useTransition, useState } from "react";
import { changeUserPassword, linkEmployeeUser, deleteErpUser } from "@/app/(app)/_actions";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { TableCell } from "@/components/ui/table";
import { StatusBadge } from "@/components/app/status-badge";
import { showSuccess } from "@/lib/toast";

type EmployeeOption = { id: string; user_id: string | null; employee_code: string; name: string };

interface UserRowActionsProps {
  user: any;
  sessionUserId: string;
  employeeRows: EmployeeOption[];
  linkedEmployee?: EmployeeOption;
}

export function UserRowActions({
  user,
  sessionUserId,
  employeeRows,
  linkedEmployee,
}: UserRowActionsProps) {
  const [isPendingPass, startTransitionPass] = useTransition();
  const [isPendingLink, startTransitionLink] = useTransition();
  const [isPendingDelete, startTransitionDelete] = useTransition();

  const [passwordVal, setPasswordVal] = useState("");

  const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("user_id", user.id);

    startTransitionPass(async () => {
      try {
        await changeUserPassword(formData);
        showSuccess(`Password updated for ${user.full_name}!`);
        setPasswordVal("");
      } catch (err: any) {
        alert(err.message || "Failed to update password.");
      }
    });
  };

  const handleLinkEmployee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("user_id", user.id);

    startTransitionLink(async () => {
      try {
        await linkEmployeeUser(formData);
        showSuccess("Employee link updated successfully!");
      } catch (err: any) {
        alert(err.message || "Failed to update employee link.");
      }
    });
  };

  const handleDeleteUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransitionDelete(async () => {
      try {
        await deleteErpUser(user.id);
        showSuccess(`ERP user ${user.full_name} deleted successfully.`);
      } catch (err: any) {
        alert(err.message || "Failed to delete user.");
      }
    });
  };

  return (
    <>
      <TableCell className="font-semibold">{user.full_name}</TableCell>
      <TableCell className="font-medium">{user.email}</TableCell>
      <TableCell className="font-mono text-sm">{user.password ?? "—"}</TableCell>
      <TableCell className="min-w-64">
        <form onSubmit={handleChangePassword} className="flex gap-2">
          <input
            type="text"
            name="new_password"
            placeholder="New Password"
            value={passwordVal}
            onChange={(e) => setPasswordVal(e.target.value)}
            required
            minLength={8}
            className="h-9 w-40 rounded-md border bg-background px-3 text-xs font-mono"
            disabled={isPendingPass}
          />
          <ConfirmSubmitButton
            disabled={isPendingPass}
            size="sm"
            variant="secondary"
            confirmTitle="Change user password?"
            confirmDescription={`This will update the login password for ${user.full_name} instantly.`}
          >
            {isPendingPass ? "Updating..." : "Update"}
          </ConfirmSubmitButton>
        </form>
      </TableCell>
      <TableCell className="capitalize">{user.roles?.name}</TableCell>
      <TableCell className="min-w-72">
        <form onSubmit={handleLinkEmployee} className="flex flex-col gap-2 sm:flex-row">
          <select
            name="employee_id"
            defaultValue={linkedEmployee?.id ?? ""}
            className="h-9 w-full rounded-md border bg-background px-3 text-sm"
            disabled={isPendingLink}
          >
            <option value="">No employee link</option>
            {employeeRows.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.employee_code} - {employee.name}
              </option>
            ))}
          </select>
          <ConfirmSubmitButton
            disabled={isPendingLink}
            size="sm"
            variant="outline"
            confirmTitle="Update employee link?"
            confirmDescription="Confirm this user-to-employee attendance link before saving."
          >
            {isPendingLink ? "Linking..." : "Link"}
          </ConfirmSubmitButton>
        </form>
      </TableCell>
      <TableCell><StatusBadge value={user.status} /></TableCell>
      <TableCell className="text-center">
        {user.id !== sessionUserId ? (
          <form onSubmit={handleDeleteUser}>
            <ConfirmSubmitButton
              disabled={isPendingDelete}
              size="sm"
              variant="destructive"
              confirmTitle={`Delete user ${user.full_name}?`}
              confirmDescription="This user will be soft-deleted and immediately lose system access."
            >
              {isPendingDelete ? "Deleting..." : "Delete User"}
            </ConfirmSubmitButton>
          </form>
        ) : (
          <span className="text-xs text-muted-foreground italic">Current User</span>
        )}
      </TableCell>
    </>
  );
}
