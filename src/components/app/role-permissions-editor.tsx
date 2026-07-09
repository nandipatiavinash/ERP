"use client";

import { useTransition, useState } from "react";
import { saveRoleDetails, saveRolePermissions, deactivateRole } from "@/app/(app)/_actions";
import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/app/status-badge";
import { showSuccess } from "@/lib/toast";

const SECTION_META: Record<string, { label: string; order: number }> = {
  admin:           { label: "Admin",           order: 0 },
  fabric:          { label: "Fabric",          order: 1 },
  roto_printing:   { label: "Roto Printing",   order: 2 },
  lamination:      { label: "Lamination",      order: 3 },
  offset_printing: { label: "Offset Printing", order: 4 },
  finishing:       { label: "Finishing",       order: 5 },
  sales:           { label: "Sales",           order: 6 },
  accounts:        { label: "Accounts",        order: 7 },
  reports:         { label: "Reports",         order: 8 },
  roto_products:   { label: "Roto Products",   order: 9 },
  offset_products: { label: "Offset Products", order: 10 },
};

const ACTION_LABELS: Record<string, string> = {
  production:         "Production",
  consumption:        "Consumption",
  stock:              "Stock",
  order_confirmation: "Order Confirmation",
  delivery_entry:     "Delivery Entry",
  journal:            "Journal Entry",
  purchase:           "Purchase Entry",
  sales:              "Sales Entry",
  material:           "Material Sales",
  sales_confirmation: "Sales Confirmation",
  accounts:           "Account Reports",
  opening_balance:    "Opening Balance",
  profit_loss:        "Profit & Loss",
  balance_sheet:      "Balance Sheet",
  filter_by_date:     "Filter by Date",
};

function sectionLabel(module: string) {
  return SECTION_META[module]?.label ?? module.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function actionLabel(action: string) {
  return ACTION_LABELS[action] ?? action.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

interface RolePermissionsEditorProps {
  role: any;
  sortedModules: string[];
  groupedPermissions: Record<string, any[]>;
  assignedIdsArray: string[];
  totalPermissionsCount: number;
}

export function RolePermissionsEditor({
  role,
  sortedModules,
  groupedPermissions,
  assignedIdsArray,
  totalPermissionsCount,
}: RolePermissionsEditorProps) {
  const [isPendingDetails, startTransitionDetails] = useTransition();
  const [isPendingPerms, startTransitionPerms] = useTransition();
  const [isPendingDeactivate, startTransitionDeactivate] = useTransition();

  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [permsError, setPermsError] = useState<string | null>(null);

  const handleSaveDetails = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDetailsError(null);
    const formData = new FormData(event.currentTarget);
    formData.set("role_id", role.id);

    startTransitionDetails(async () => {
      try {
        await saveRoleDetails(formData);
        showSuccess("Role details updated successfully!");
      } catch (err: any) {
        setDetailsError(err.message || "Failed to save details.");
      }
    });
  };

  const handleSavePermissions = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPermsError(null);
    const formData = new FormData(event.currentTarget);
    formData.set("role_id", role.id);

    startTransitionPerms(async () => {
      try {
        await saveRolePermissions(formData);
        showSuccess("Permissions updated successfully!");
      } catch (err: any) {
        setPermsError(err.message || "Failed to save permissions.");
      }
    });
  };

  const handleDeactivate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("role_id", role.id);

    startTransitionDeactivate(async () => {
      try {
        await deactivateRole(formData);
        showSuccess("Role deactivated successfully!");
      } catch (err: any) {
        alert(err.message || "Failed to deactivate role.");
      }
    });
  };

  const assignedSet = new Set(assignedIdsArray);

  return (
    <div className="mt-6 space-y-6">
      {/* Edit role name / description */}
      <Card>
        <CardHeader><CardTitle>Role Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSaveDetails} className="grid gap-4 md:grid-cols-[1fr_2fr_auto] md:items-end">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name</Label>
              <Input id="name" name="name" defaultValue={role.name} required disabled={isPendingDetails} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" defaultValue={role.description ?? ""} disabled={isPendingDetails} />
            </div>
            <ConfirmSubmitButton
              disabled={isPendingDetails}
              variant="outline"
              confirmTitle="Save role changes?"
              confirmDescription="Confirm the role name and description before saving."
            >
              {isPendingDetails ? "Saving..." : "Save Details"}
            </ConfirmSubmitButton>
            {detailsError && <p className="text-sm text-destructive md:col-span-3">{detailsError}</p>}
          </form>
        </CardContent>
      </Card>

      {/* Permission assignment */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Page Permissions</CardTitle>
            <span className="text-sm text-muted-foreground font-normal">
              {assignedIdsArray.length} / {totalPermissionsCount} enabled
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSavePermissions} className="space-y-5">
            <div className="space-y-4">
              {sortedModules.map((module) => {
                const modulePerms = groupedPermissions[module];
                const checkedCount = modulePerms.filter((p: any) => assignedSet.has(p.id)).length;

                return (
                  <div key={module} className="rounded-lg border overflow-hidden">
                    {/* Section header */}
                    <div className="flex items-center justify-between bg-muted/50 px-4 py-3 border-b">
                      <span className="text-sm font-semibold tracking-wide">{sectionLabel(module)}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {checkedCount}/{modulePerms.length} enabled
                      </span>
                    </div>

                    {/* Page-level checkboxes */}
                    <div className="divide-y">
                      {modulePerms.map((permission: any) => (
                        <label
                          key={permission.id}
                          className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted/30 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            name="permission_ids"
                            value={permission.id}
                            defaultChecked={assignedSet.has(permission.id)}
                            className="h-4 w-4 accent-primary shrink-0"
                            disabled={isPendingPerms}
                          />
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium">{actionLabel(permission.action)}</span>
                            {permission.description && (
                              <span className="text-xs text-muted-foreground">{permission.description}</span>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {permsError && <p className="text-sm text-destructive">{permsError}</p>}

            <ConfirmSubmitButton
              disabled={isPendingPerms}
              confirmTitle="Save permission matrix?"
              confirmDescription="This will replace the role's current permission assignments."
            >
              {isPendingPerms ? "Saving..." : "Save Permissions"}
            </ConfirmSubmitButton>
          </form>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive text-base">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Deactivate this role</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                This role will be marked inactive and users with this role will lose access.
              </p>
            </div>
            <form onSubmit={handleDeactivate}>
              <ConfirmSubmitButton
                disabled={isPendingDeactivate}
                variant="outline"
                confirmTitle="Deactivate role?"
                confirmDescription="This role will be marked inactive. Users assigned this role will lose access."
              >
                {isPendingDeactivate ? "Deactivating..." : "Deactivate Role"}
              </ConfirmSubmitButton>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
