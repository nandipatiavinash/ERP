import { MasterPage } from "@/components/app/master-page";
import { requirePermission } from "@/lib/auth";
import { modules } from "@/lib/modules";
import { fetchMasterRows } from "@/lib/master-query";
import { createClient } from "@/lib/supabase/server";

type Params = { search?: string; sort?: string; direction?: "asc" | "desc" };

export default async function ClientsPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requirePermission("admin.clients");
  const supabase = await createClient();
  const params = await searchParams;

  // Only "reference a/c" accounts appear in the Linked Account dropdown
  const { data: referenceAccounts } = await supabase
    .from("customers")
    .select("id, customer_name")
    .eq("is_internal", "reference a/c")
    .is("deleted_at", null)
    .order("customer_name");

  const customersConfig = {
    ...modules.customers,
    profilePath: "/admin/clients",
    fields: modules.customers.fields.map((field) => {
      if (field.name === "linked_customer_id") {
        return {
          ...field,
          options: [
            { label: "-- None (Main Account) --", value: "" },
            ...(referenceAccounts as any[] ?? []).map((c) => ({
              label: c.customer_name,
              value: c.id,
            })),
          ],
        };
      }
      return field;
    }),
  };

  const result = await fetchMasterRows({
    supabase,
    config: customersConfig,
    select: "id, customer_name, linked_customer_id, phone, gst_number, address, is_internal, status",
    params,
    defaultSort: "customer_name",
  });

  return (
    <MasterPage
      config={customersConfig}
      rows={result.rows as never}
      search={params.search ?? ""}
      sort={result.sort}
      direction={result.direction}
    />
  );
}
