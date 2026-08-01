# 16 End to End Workflows

## Fabric Production → Roll → Stock

```
- `saveProduction` [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:14)
  - DB: `select` on `loom_production_entries`
  - DB: `update` on `loom_production_entries`
  - DB: `insert` on `loom_production_entries`
  - revalidatePath: `/fabric/production`, `/rolls`, `/dashboard`, `/fabric/stock`
  - throws: `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `assertValid` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:125)
    - throws: `parsed.error.issues[0]?.message ?? "Invalid form data."`
  - `readPayload` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:49)
    - `sanitizeText` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:25)
  - `createAdminClient` [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:5)
    - throws: `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABA`
```

- Tables written/read: loom_production_entries
- Paths revalidated: /fabric/production, /rolls, /dashboard, /fabric/stock

## Sales Order → Delivery → Roll Allocation → Billing

```
- `createSalesOrder` [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:38)
  - DB: `select` on `sales_orders`
  - DB: `insert` on `sales_orders`
  - DB: `insert` on `sales_order_items`
  - DB: `rpc` on `get_next_order_no`
  - revalidatePath: `/sales/order-confirmation`
  - throws: `headerError.message`; `"Invalid items payload format."`; `itemsError.message`
  - `requireAnyPermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:116)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `todayInIndia` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:40)
  - `todayInIndia` [src/lib/utils.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/utils.ts:28)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

- Tables written/read: sales_orders, sales_order_items, get_next_order_no
- Paths revalidated: /sales/order-confirmation

## Sales Delivery Confirmation

```
- `confirmSalesDelivery` [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:183)
```

- Tables written/read: 
- Paths revalidated: 

## Sales Billing (Draft → Finalize)

```
- `prepareSalesOrderDraftBilling` [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:425)
  - DB: `select` on `sales_order_items`
  - DB: `select` on `sales_order_items`
  - DB: `insert` on `sales_orders`
  - DB: `update` on `sales_order_items`
  - DB: `update` on `sales_orders`
  - revalidatePath: `/accounts/sales`
  - throws: `"At least one item must be selected."`; `"Selected sales order items not found."`; `"All selected items must belong to the same customer to be billed together."`; ``Failed to fetch items for order ${oId}``; ``Failed to split order: ${newOrderError?.message}``
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

- Tables written/read: sales_order_items, sales_orders
- Paths revalidated: /accounts/sales

## Journal Entry

```
- `saveJournalEntry` [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:8)
  - DB: `update` on `accounts_journal`
  - DB: `select` on `customers`
  - DB: `insert` on `accounts_journal`
  - revalidatePath: `/accounts/journal`, `/accounts/sales`
  - throws: `"Missing required journal fields."`; `"At least 2 rows are required for a journal entry."`; `"Account name is required on all rows."`; `"A row cannot contain both Debit and Credit."`; `"Either Debit or Credit must be entered on all rows."`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `revalidateAllReports` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:29)
    - revalidatePath: `/reports`, `/reports/accounts`, `/reports/opening-balance`, `/reports/closing-stock`, `/reports/profit-loss`, `/reports/balance-sheet`, `/reports/sales-confirmation`, `/reports/stock`
```

- Tables written/read: accounts_journal, customers
- Paths revalidated: /accounts/journal, /accounts/sales, /reports, /reports/accounts, /reports/opening-balance, /reports/closing-stock, /reports/profit-loss, /reports/balance-sheet, /reports/sales-confirmation, /reports/stock

## Raw Material Purchase → Stock

```
- `saveRawMaterialPurchase` [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:8)
  - DB: `insert` on `raw_material_purchases`
  - DB: `select` on `customers`
  - DB: `select` on `customers`
  - DB: `insert` on `accounts_journal`
  - revalidatePath: `/`
  - throws: `"Purchase date, client, and bill number are required."`; `"Total bill value must be a positive amount."`; `"At least one raw material item must be added."`; `"Every purchase item must have a material, positive quantity, and positive rate.`; `error.message`
  - `requireAnyPermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:116)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `generateNextJournalNo` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:166)
    - DB: `select` on `accounts_journal`
    - DB: `rpc` on `get_next_journal_no`
```

- Tables written/read: raw_material_purchases, customers, accounts_journal, get_next_journal_no
- Paths revalidated: /

## Product Purchase → Journal

```
- `saveProductPurchase` [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:8)
  - DB: `insert` on `product_purchases`
  - DB: `select` on `fabric_types`
  - DB: `insert` on `fabric_rolls`
  - DB: `select` on `roto_products`
  - DB: `select` on `roto_colors`
  - DB: `select` on `roto_film_rolls`
  - DB: `insert` on `roto_film_rolls`
  - DB: `insert` on `roto_film_rolls`
  - DB: `insert` on `roto_metallic_rolls`
  - DB: `select` on `fabric_rolls`
  - DB: `select` on `roto_products`
  - DB: `select` on `lamination_rolls`
  - DB: `insert` on `lamination_rolls`
  - DB: `update` on `fabric_rolls`
  - DB: `select` on `lamination_rolls`
  - DB: `select` on `offset_products`
  - DB: `select` on `offset_rolls`
  - DB: `insert` on `offset_rolls`
  - DB: `update` on `lamination_rolls`
  - DB: `select` on `fabric_rolls`
  - DB: `select` on `lamination_rolls`
  - DB: `select` on `offset_rolls`
  - DB: `select` on `finishing_bundles`
  - DB: `insert` on `finishing_bundles`
  - DB: `update` on `fabric_rolls`
  - DB: `update` on `lamination_rolls`
  - DB: `update` on `offset_rolls`
  - DB: `insert` on `product_purchase_items`
  - DB: `delete` on `product_purchases`
  - DB: `select` on `customers`
  - DB: `select` on `customers`
  - DB: `insert` on `accounts_journal`
  - DB: `rpc` on `next_year_number`
  - revalidatePath: `/accounts/product-purchase`
  - throws: `"Purchase date, supplier, and bill number are required."`; `"Total bill value must be a positive amount."`; `"At least one purchase item must be added."`; `headerError?.message || "Failed to create product purchase record."`; ``Fabric roll stock insert failed: ${stockErr.message}``
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createAdminClient` [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:5)
    - throws: `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABA`
  - `generateNextJournalNo` [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:166)
    - DB: `select` on `accounts_journal`
    - DB: `rpc` on `get_next_journal_no`
```

- Tables written/read: product_purchases, fabric_types, fabric_rolls, roto_products, roto_colors, roto_film_rolls, roto_metallic_rolls, lamination_rolls, offset_products, offset_rolls, finishing_bundles, product_purchase_items, customers, accounts_journal, next_year_number, get_next_journal_no
- Paths revalidated: /accounts/product-purchase

## Client Portal Order → Approval → Sales Order

```
- `createClientOrder` [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:24)
  - DB: `select` on `users`
  - DB: `insert` on `client_orders`
  - DB: `insert` on `client_order_items`
  - DB: `rpc` on `next_client_order_no`
  - revalidatePath: `/portal/dashboard`
  - throws: `"Unauthorized"`; `"No items in order."`; `"Quantity must be greater than zero."`; `"Your account is not linked to a customer firm. Please contact your administrato`; ``Failed to create order: ${orderErr.message}``
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
  - `createAdminClient` [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:5)
    - throws: `"Supabase admin credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABA`
```

- Tables written/read: users, client_orders, client_order_items, next_client_order_no
- Paths revalidated: /portal/dashboard

## Closing Stock Report Save

```
- `saveClosingStock` [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:137)
  - DB: `select` on `settings`
  - DB: `update` on `settings`
  - DB: `insert` on `settings`
  - revalidatePath: `/reports/closing-stock`, `/reports/profit-loss`, `/reports/balance-sheet`
  - throws: `error.message`; `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

- Tables written/read: settings
- Paths revalidated: /reports/closing-stock, /reports/profit-loss, /reports/balance-sheet

## Profit & Loss Save

```
- `saveProfitLoss` [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:185)
  - DB: `select` on `settings`
  - DB: `update` on `settings`
  - DB: `insert` on `settings`
  - revalidatePath: `/reports/profit-loss`, `/reports/balance-sheet`
  - throws: `error.message`; `error.message`
  - `requirePermission` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:108)
    - `requireUser` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:31)
    - `getSessionPermissions` [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:102)
  - `createClient` [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:6)
  - `createClient` [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:5)
```

- Tables written/read: settings
- Paths revalidated: /reports/profit-loss, /reports/balance-sheet

