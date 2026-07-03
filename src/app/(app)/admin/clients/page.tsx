import { MasterPage } from "@/components/app/master-page";
import { requirePermission } from "@/lib/auth";
import { modules } from "@/lib/modules";
import { fetchMasterRows } from "@/lib/master-query";
import { createClient } from "@/lib/supabase/server";

type Params = { search?: string; page?: string; sort?: string; direction?: "asc" | "desc" };

export default async function ClientsPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requirePermission("admin.clients");
  const supabase = await createClient();
  const params = await searchParams;

  // Fetch active customers to populate the linked accounts dropdown select
  const { data: activeCustomers } = await supabase
    .from("customers")
    .select("id, customer_name")
    .is("deleted_at", null)
    .order("customer_name");

  const customersConfig = {
    ...modules.customers,
    fields: modules.customers.fields.map((field) => {
      if (field.name === "linked_customer_id") {
        return {
          ...field,
          options: [
            { label: "-- None (Main Account) --", value: "" },
            ...(activeCustomers as any[] ?? []).map((c) => ({
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
      page={result.page}
      sort={result.sort}
      direction={result.direction}
      totalRows={result.totalRows}
    />
  );
}
