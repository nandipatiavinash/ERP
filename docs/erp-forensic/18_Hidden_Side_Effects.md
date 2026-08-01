# 18 Hidden Side Effects

Side effects not obvious from UI labels: cache revalidation, journal creation, stock adjustments, roll status changes.

### checkInAttendance

- Entry: [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:15)
- Revalidates: /attendance, /dashboard
- Tables touched: attendance, employees

### checkOutAttendance

- Entry: [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:57)
- Revalidates: /attendance, /dashboard
- Tables touched: attendance, employees

### linkEmployeeUser

- Entry: [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:87)
- Revalidates: /users, /employees, /attendance
- Tables touched: employees

### saveProduction

- Entry: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:14)
- Revalidates: /fabric/production, /rolls, /dashboard, /fabric/stock
- Tables touched: loom_production_entries

### softDeleteProduction

- Entry: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:73)
- Revalidates: /fabric/production, /rolls, /dashboard, /fabric/stock
- Tables touched: fabric_rolls, loom_production_entries

### saveRotoFilmProduction

- Entry: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:110)
- Revalidates: /roto-printing/production, /roto-printing/stock, /lamination/production
- Tables touched: roto_products, roto_colors, roto_film_rolls

### deleteRotoFilmProduction

- Entry: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:190)
- Revalidates: /roto-printing/production, /roto-printing/stock, /lamination/production
- Tables touched: roto_film_rolls, roto_metallic_rolls

### saveRotoMetallicProduction

- Entry: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:215)
- Revalidates: /roto-printing/production, /roto-printing/stock, /lamination/production
- Tables touched: roto_film_rolls, roto_metallic_rolls

### deleteRotoMetallicProduction

- Entry: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:276)
- Revalidates: /roto-printing/production, /roto-printing/stock, /lamination/production
- Tables touched: roto_metallic_rolls, lamination_rolls

### saveLaminationProduction

- Entry: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:301)
- Revalidates: /lamination/production, /lamination/stock, /offset-printing/production, /finishing/production
- Tables touched: fabric_types, roto_film_rolls, roto_metallic_rolls, roto_products, lamination_rolls

### deleteLaminationProduction

- Entry: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:431)
- Revalidates: /lamination/production, /lamination/stock, /offset-printing/production, /finishing/production
- Tables touched: lamination_rolls, offset_rolls, finishing_bundles

### saveOffsetProduction

- Entry: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:460)
- Revalidates: /offset-printing/production, /offset-printing/stock, /finishing/production
- Tables touched: offset_products, fabric_types, offset_rolls

### deleteOffsetProduction

- Entry: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:530)
- Revalidates: /offset-printing/production, /offset-printing/stock, /finishing/production
- Tables touched: offset_rolls, finishing_bundles

### saveFinishingBundle

- Entry: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:555)
- Revalidates: /finishing/production, /finishing/stock
- Tables touched: fabric_types, lamination_rolls, offset_rolls, finishing_bundles

### deleteFinishingBundle

- Entry: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:637)
- Revalidates: /finishing/production, /finishing/stock
- Tables touched: finishing_bundles, lamination_rolls, fabric_rolls, offset_rolls

### saveStageProduction

- Entry: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:675)
- Revalidates: /roto-printing/production, /roto-printing/stock, /lamination/production, /lamination/stock, /offset-printing/production, /offset-printing/stock, /finishing/production, /finishing/stock, /rolls, /dashboard, /reports
- Tables touched: stage_production_entries

### softDeleteStageProduction

- Entry: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:738)
- Revalidates: /roto-printing/production, /roto-printing/stock, /lamination/production, /lamination/stock, /offset-printing/production, /offset-printing/stock, /finishing/production, /finishing/stock, /rolls, /dashboard, /reports
- Tables touched: stage_production_entries

### saveSale

- Entry: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:15)
- Revalidates: /sales, /rolls, /dashboard
- Tables touched: sales_orders

### createSalesOrder

- Entry: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:38)
- Revalidates: /sales/order-confirmation
- Tables touched: sales_orders, sales_order_items, get_next_order_no

### deleteSalesOrderItem

- Entry: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:124)
- Revalidates: /sales/delivery-entry, /rolls, /fabric/stock, /accounts/sales
- Tables touched: sales_order_items, sales_orders

### prepareSalesOrderDraftBilling

- Entry: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:425)
- Revalidates: /accounts/sales
- Tables touched: sales_order_items, sales_orders

### finalizeSalesOrderBilling

- Entry: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:554)
- Revalidates: /accounts/sales, /accounts/journal, /sales/delivery-entry, /reports
- Tables touched: sales_orders, customers, accounts_journal, get_next_journal_no

### deleteSalesOrderCompletely

- Entry: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:694)
- Revalidates: /sales/order-confirmation, /sales/delivery-entry, /accounts/sales, /accounts/journal, /rolls, /fabric/stock, /reports, /reports/accounts, /reports/opening-balance, /reports/closing-stock, /reports/profit-loss, /reports/balance-sheet, /reports/sales-confirmation, /reports/stock
- Tables touched: sales_orders, fabric_rolls, accounts_journal, sales_order_items

### saveSalesConfirmationRates

- Entry: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:773)
- Revalidates: /reports/sales-confirmation, /accounts/journal, /reports/accounts
- Tables touched: sales_orders, sales_order_items, fabric_rolls, lamination_rolls, offset_rolls, finishing_bundles, roto_film_rolls, roto_metallic_rolls, accounts_journal, customers, get_next_journal_no

### saveMaterialSalesEntry

- Entry: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:957)
- Revalidates: /accounts/material, /accounts/journal, /reports, /reports/accounts, /reports/opening-balance, /reports/closing-stock, /reports/profit-loss, /reports/balance-sheet, /reports/sales-confirmation, /reports/stock
- Tables touched: raw_materials, customers, accounts_journal, material_sales, get_next_journal_no

### deleteMaterialSalesEntry

- Entry: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1089)
- Revalidates: /accounts/material, /accounts/journal, /reports, /reports/accounts, /reports/opening-balance, /reports/closing-stock, /reports/profit-loss, /reports/balance-sheet, /reports/sales-confirmation, /reports/stock
- Tables touched: material_sales, accounts_journal

### saveSalesOrderBillingDirect

- Entry: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1407)
- Revalidates: /accounts/sales, /accounts/journal, /sales/delivery-entry, /reports, /reports/accounts, /reports/opening-balance, /reports/closing-stock, /reports/profit-loss, /reports/balance-sheet, /reports/sales-confirmation, /reports/stock
- Tables touched: sales_orders, customers, accounts_journal, get_next_journal_no

### saveRawMaterialPurchase

- Entry: [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:8)
- Revalidates: /
- Tables touched: raw_material_purchases, customers, accounts_journal, get_next_journal_no

### deleteRawMaterialPurchase

- Entry: [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:104)
- Revalidates: /
- Tables touched: raw_material_purchases, accounts_journal

### createErpUser

- Entry: [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:14)
- Revalidates: /users, /admin/credentials
- Tables touched: users

### deleteErpUser

- Entry: [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:66)
- Revalidates: /users, /admin/credentials
- Tables touched: users

### saveRoleDetails

- Entry: [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:139)
- Revalidates: /roles, /admin/permissions, /admin/permissions/${roleId}
- Tables touched: roles

### saveRolePermissions

- Entry: [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:174)
- Revalidates: /roles, /admin/permissions, /admin/permissions/${roleId}
- Tables touched: role_permissions

### updateCriticalLevel

- Entry: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:11)
- Revalidates: /admin/critical-levels, /admin/raw-materials
- Tables touched: raw_materials

### saveRawMaterialConsumption

- Entry: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:27)
- Revalidates: /fabric/consumption, /roto-printing/consumption, /lamination/consumption, /offset-printing/consumption, /finishing/consumption, /raw-materials, /dashboard, /reports
- Tables touched: raw_material_consumptions

### softDeleteRawMaterialConsumption

- Entry: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:79)
- Revalidates: /fabric/consumption, /roto-printing/consumption, /lamination/consumption, /offset-printing/consumption, /finishing/consumption, /raw-materials, /dashboard, /reports
- Tables touched: raw_material_consumptions

### consumeFabricRoll

- Entry: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:130)
- Revalidates: /fabric/stock, /lamination/consumption, /offset-printing/consumption, /finishing/consumption
- Tables touched: fabric_rolls

### revertFabricRollConsumption

- Entry: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:153)
- Revalidates: /fabric/stock, /lamination/consumption, /offset-printing/consumption, /finishing/consumption
- Tables touched: fabric_rolls

### consumeMetallicRoll

- Entry: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:182)
- Revalidates: /roto-printing/stock, /lamination/consumption
- Tables touched: roto_metallic_rolls

### revertMetallicRollConsumption

- Entry: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:197)
- Revalidates: /roto-printing/stock, /lamination/consumption
- Tables touched: roto_metallic_rolls

### consumeRotoFilmRoll

- Entry: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:212)
- Revalidates: /roto-printing/stock, /lamination/consumption
- Tables touched: roto_film_rolls

### revertRotoFilmRollConsumption

- Entry: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:227)
- Revalidates: /roto-printing/stock, /lamination/consumption
- Tables touched: roto_film_rolls

### consumeLaminationRoll

- Entry: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:242)
- Revalidates: /lamination/stock, /offset-printing/consumption, /finishing/consumption
- Tables touched: lamination_rolls

### revertLaminationRollConsumption

- Entry: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:259)
- Revalidates: /lamination/stock, /offset-printing/consumption, /finishing/consumption
- Tables touched: lamination_rolls

### consumeOffsetRoll

- Entry: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:276)
- Revalidates: /offset-printing/stock, /finishing/consumption
- Tables touched: offset_rolls

### revertOffsetRollConsumption

- Entry: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:291)
- Revalidates: /offset-printing/stock, /finishing/consumption
- Tables touched: offset_rolls

### saveRotoProduct

- Entry: [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:8)
- Revalidates: /admin/products
- Tables touched: products, roto_products, roto_product_colors

### saveOffsetProduct

- Entry: [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:147)
- Revalidates: /admin/products
- Tables touched: products, offset_products

### saveCatalogProduct

- Entry: [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:221)
- Revalidates: /admin/catalog, /portal/catalog
- Tables touched: products, fabric_types, finishing_products

### deleteCatalogProduct

- Entry: [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:333)
- Revalidates: /admin/catalog, /portal/catalog
- Tables touched: 

### saveJournalEntry

- Entry: [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:8)
- Revalidates: /accounts/journal, /accounts/sales, /reports, /reports/accounts, /reports/opening-balance, /reports/closing-stock, /reports/profit-loss, /reports/balance-sheet, /reports/sales-confirmation, /reports/stock
- Tables touched: accounts_journal, customers

### softDeleteJournalEntryGroup

- Entry: [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:121)
- Revalidates: /accounts/journal, /accounts/sales, /reports, /reports/accounts, /reports/opening-balance, /reports/closing-stock, /reports/profit-loss, /reports/balance-sheet, /reports/sales-confirmation, /reports/stock
- Tables touched: accounts_journal

### saveAccountOpeningBalance

- Entry: [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:7)
- Revalidates: /reports/opening-balance, /reports/accounts
- Tables touched: customers

### saveClosingStock

- Entry: [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:137)
- Revalidates: /reports/closing-stock, /reports/profit-loss, /reports/balance-sheet
- Tables touched: settings

### saveProfitLoss

- Entry: [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:185)
- Revalidates: /reports/profit-loss, /reports/balance-sheet
- Tables touched: settings

### clearSystemTransactions

- Entry: [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:38)
- Revalidates: /admin/raw-materials, /fabric/stock, /accounts/sales, /accounts/purchase, /accounts/consumption, /accounts/journal, /reports/stock, /reports/closing-stock, /reports/accounts, /dashboard
- Tables touched: fabric_rolls, raw_materials, customers

### approveClientOrder

- Entry: [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:100)
- Revalidates: /sales/client-orders, /sales/order-confirmation, /portal/dashboard
- Tables touched: client_orders, sales_orders, sales_order_items, get_next_order_no

### cancelClientOrder

- Entry: [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:181)
- Revalidates: /sales/client-orders, /portal/dashboard
- Tables touched: client_orders

### createClientOrder

- Entry: [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:24)
- Revalidates: /portal/dashboard
- Tables touched: users, client_orders, client_order_items, next_client_order_no

### createClientSalesOrder

- Entry: [src/app/(app)/_actions/client-sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-sales.ts:12)
- Revalidates: /client/dashboard, /accounts/sales
- Tables touched: users, sales_orders, sales_order_items, get_next_order_no

### revalidateAllReports

- Entry: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:29)
- Revalidates: /reports, /reports/accounts, /reports/opening-balance, /reports/closing-stock, /reports/profit-loss, /reports/balance-sheet, /reports/sales-confirmation, /reports/stock
- Tables touched: 

### softDeleteJournalEntry

- Entry: [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:105)
- Revalidates: /accounts/journal, /accounts/sales, /reports, /reports/accounts, /reports/opening-balance, /reports/closing-stock, /reports/profit-loss, /reports/balance-sheet, /reports/sales-confirmation, /reports/stock
- Tables touched: accounts_journal

### saveProductPurchase

- Entry: [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:8)
- Revalidates: /accounts/product-purchase
- Tables touched: product_purchases, fabric_types, fabric_rolls, roto_products, roto_colors, roto_film_rolls, roto_metallic_rolls, lamination_rolls, offset_products, offset_rolls, finishing_bundles, product_purchase_items, customers, accounts_journal, next_year_number, get_next_journal_no

### deleteProductPurchase

- Entry: [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:541)
- Revalidates: /accounts/product-purchase
- Tables touched: product_purchases, product_purchase_items, fabric_rolls, lamination_rolls, offset_rolls, finishing_bundles, roto_metallic_rolls, roto_film_rolls, accounts_journal

## revalidatePath / router.refresh Evidence

- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:29): `* **\`sales_orders\`**: Sales orders and confirmed deliveries (\`order_number\`, \`customer_id\`, \`order_date\`, \`status\` [pending, confirmed], \`bill_number\`, \`bill_value\`).`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:31): `* **\`raw_materials\`**: Catalog of raw materials (\`material_name\`, \`unit\`, \`opening_stock\`, \`current_stock\`, \`critical_level\`, \`status\`).`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:32): `* **\`raw_material_purchases\`**: Inventory purchases ledger (\`purchase_date\`, \`raw_material_id\`, \`supplier_name\`, \`bill_number\`, \`quantity\`, \`rate\`, \`total_amount\`).`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:35): `* **\`accounts_journal\`**: Balanced bookkeeping transaction lines (Debits/Credits).`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:36): `- Columns: \`id\`, \`journal_no\` (e.g., JE-000001), \`entry_date\`, \`account_id\` (references \`customers.id\`), \`account_name\` (legacy text fallback), \`entry_type\` (\`debit\`, \`credit\`), \`amount\`, \`description\`.`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:42): `The ERP enforces double-entry accounting constraints. Transactions auto-generate balancing debit/credit journal entries in \`accounts_journal\`:`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:78): `- \`idx_accounts_journal_account_id\` (optimize ledger queries).`
- [DOCS_SCHEMA_MIGRATIONS.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/DOCS_SCHEMA_MIGRATIONS.md:82): `* **What we did:** Added \`account_id\` column referencing \`customers.id\` to \`accounts_journal\`.`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:56): `numeric current_stock`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:64): `text bill_number`
- [docs/ER_DIAGRAM.md](C:/Users/spsch/Downloads/ERP-main/ERP-main/docs/ER_DIAGRAM.md:121): `text order_number`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:55): `measure("Fetch journal entries (eq date)", supabase.from("accounts_journal").select("*").eq("entry_date", "2026-07-13").is("deleted_at", null)),`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:69): `measure("Fetch product purchases (gte date)", supabase.from("product_purchases").select("id, purchase_date, supplier_name, bill_number, total_amount, remarks, product_purchase_items(id, department, quantity, weight, rate, amount, created_stock_id, supplier_roll_id)").gte("purchase_date", "2026-07-13").is("deleted_at", null)),`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:179): `measure("Fetch ledger journal entries", supabase.from("accounts_journal").select("entry_date, amount, entry_type, description").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:185): `measure("Fetch ledger journal entries", supabase.from("accounts_journal").select("entry_date, amount, entry_type, description").is("deleted_at", null))`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:197): `measure("Fetch raw materials status", supabase.from("raw_materials").select("id, material_name, unit, current_stock, department").is("deleted_at", null)),`
- [scratch/check_order_items.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_order_items.mjs:17): `.select("order_number, status, sales_order_items(*)")`
- [scratch/check_order_items.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_order_items.mjs:26): `console.log("Orders:", orders.map(o => ({ num: o.order_number, status: o.status, items: o.sales_order_items })));`
- [scratch/check-rls-as-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-rls-as-user.mjs:40): `.select("id, order_number, order_date, customer_id, status, bill_number, bill_value, customers(customer_name, alias, phone, address, gst_number), sales_order_items(id, department, product_id, quantity, selected_roll_ids)")`
- [scratch/check-rls-as-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-rls-as-user.mjs:42): `.is("bill_number", null)`
- [scratch/check-rls-as-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-rls-as-user.mjs:53): `const targetOrder = pendingOrders?.find(o => o.order_number === "DP-06-28-34");`
- [scratch/check-sales-order-anon.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-anon.mjs:11): `.select("id, order_number, order_date, customer_id, status, bill_number, bill_value, customers(customer_name, alias, phone, address, gst_number), sales_order_items(id, department, product_id, quantity, selected_roll_ids)")`
- [scratch/check-sales-order-anon.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-anon.mjs:13): `.is("bill_number", null)`
- [scratch/check-sales-order-anon.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-anon.mjs:24): `const targetOrder = pendingOrders.find(o => o.order_number === "DP-06-28-03");`
- [scratch/check-sales-order-items-keys.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-items-keys.mjs:11): `.select("id, order_number, order_date, customer_id, status, bill_number, bill_value, customers(customer_name, alias, phone, address, gst_number), sales_order_items(id, department, product_id, quantity, selected_roll_ids)")`
- [scratch/check-sales-order-items-keys.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-items-keys.mjs:13): `.is("bill_number", null)`
- [scratch/check-sales-order-items-keys.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-items-keys.mjs:23): `const target = data?.find(o => o.order_number === "DP-06-28-03");`
- [scratch/check-sales-order.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order.mjs:11): `.select("id, order_number, status, selected_roll_ids, sales_order_items(id, department, product_id, quantity, selected_roll_ids)")`
- [scratch/check-sales-order.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order.mjs:12): `.eq("order_number", "DP-06-28-34");`
- [scratch/clear-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear-sales.mjs:53): `.from("accounts_journal")`
- [scratch/clear-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear-sales.mjs:54): `.select("journal_no")`
- [scratch/clear-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear-sales.mjs:57): `const journalNos = (journalRows || []).map((r) => r.journal_no);`
- [scratch/clear-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear-sales.mjs:61): `.from("accounts_journal")`
- [scratch/clear-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear-sales.mjs:63): `.in("journal_no", journalNos);`
- [scratch/find-duplicates.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-duplicates.mjs:20): `.select("id, purchase_date, supplier_name, bill_number, raw_material_id, quantity, rate, created_at")`
- [scratch/find-duplicates.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-duplicates.mjs:30): `const key = \`${p.purchase_date}|${p.supplier_name}|${p.bill_number}|${p.raw_material_id}|${Number(p.quantity).toFixed(2)}|${Number(p.rate).toFixed(2)}\`;`
- [scratch/find-ft-references.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-ft-references.mjs:51): `.select("id, order_number, status")`
- [scratch/find-journal-gaps.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-journal-gaps.mjs:19): `.from("accounts_journal")`
- [scratch/find-journal-gaps.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-journal-gaps.mjs:20): `.select("journal_no")`
- [scratch/find-journal-gaps.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-journal-gaps.mjs:21): `.order("journal_no");`
- [scratch/find-journal-gaps.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-journal-gaps.mjs:28): `// Extract all numbers from journal_no in the format JE-XXXX`
- [scratch/find-journal-gaps.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-journal-gaps.mjs:31): `const match = j.journal_no ? j.journal_no.match(/JE-(\d+)/) : null;`
- [scratch/find-journal-gaps.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-journal-gaps.mjs:50): `console.log("Gaps found in journal_no sequence:", gaps.length);`
- [scratch/find-polysquare-lldp.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-polysquare-lldp.mjs:24): `.from("accounts_journal")`
- [scratch/inspect_all_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_all_73.mjs:21): `console.log("1. Checking raw_material_purchases for bill_number = '73'...");`
- [scratch/inspect_all_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_all_73.mjs:22): `const { data: rm } = await supabase.from("raw_material_purchases").select("*").eq("bill_number", "73");`
- [scratch/inspect_all_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_all_73.mjs:25): `console.log("\n2. Checking sales_orders for order_number or id matching '73'...");`
- [scratch/inspect_all_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_all_73.mjs:26): `const { data: so } = await supabase.from("sales_orders").select("*").ilike("order_number", "%73%");`
- [scratch/inspect_all_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_all_73.mjs:30): `const { data: sd } = await supabase.from("sales_orders").select("*").ilike("order_number", "DP-%73%");`
- [scratch/inspect_all_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_all_73.mjs:33): `console.log("\n4. Checking all accounts_journal lines with description '73'...");`
- [scratch/inspect_all_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_all_73.mjs:34): `const { data: aj } = await supabase.from("accounts_journal").select("*").eq("description", "73");`
- [scratch/inspect_all_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_all_73.mjs:37): `console.log("\n5. Checking all accounts_journal lines with description '73 (something)'...");`
- [scratch/inspect_all_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_all_73.mjs:38): `const { data: aj2 } = await supabase.from("accounts_journal").select("*").ilike("description", "73 (%");`
- [scratch/inspect_all_purchases_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_all_purchases_73.mjs:21): `console.log("Checking raw_material_purchases (including deleted) for bill_number = '73'...");`
- [scratch/inspect_all_purchases_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_all_purchases_73.mjs:25): `.eq("bill_number", "73");`
- [scratch/inspect_all_purchases_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_all_purchases_73.mjs:33): `console.log("Checking raw_material_purchases (including deleted) for bill_number like '%73%'...");`
- [scratch/inspect_all_purchases_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_all_purchases_73.mjs:37): `.ilike("bill_number", "%73%");`
- [scratch/inspect_customer.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_customer.mjs:25): `.eq("order_number", "DP-07-12-01")`
- [scratch/inspect_deliveries_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_deliveries_73.mjs:24): `.select("*, sales_orders(order_number), customers(customer_name)")`
- [scratch/inspect_exact_order_journal.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_exact_order_journal.mjs:23): `.from("accounts_journal")`
- [scratch/inspect_is_draft_billing.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_is_draft_billing.mjs:24): `.select("id, order_number, bill_number, bill_value, is_draft_billing, status, created_at")`
- [scratch/inspect_is_draft_billing.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_is_draft_billing.mjs:25): `.eq("order_number", "DP-07-12-01")`
- [scratch/inspect_journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_journals.mjs:23): `.from("accounts_journal")`
- [scratch/inspect_journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_journals.mjs:25): `.or("description.ilike.%73%,journal_no.ilike.%73%");`
- [scratch/inspect_journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_journals.mjs:37): `.or("bill_number.ilike.%73%,supplier_name.ilike.%73%");`
- [scratch/inspect_material_purchases.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_material_purchases.mjs:25): `.ilike("bill_number", "%73%");`
- [scratch/inspect_material_sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_material_sales.mjs:21): `console.log("Checking material_sales for bill_number containing '73'...");`
- [scratch/inspect_material_sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_material_sales.mjs:25): `.ilike("bill_number", "%73%");`
- [scratch/inspect_order_2_journal.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_order_2_journal.mjs:22): `const { data: list1 } = await supabase.from("accounts_journal").select("*").eq("amount", 1147814);`
- [scratch/inspect_order_2_journal.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_order_2_journal.mjs:26): `const { data: list2 } = await supabase.from("accounts_journal").select("*").eq("entry_date", "2026-07-12");`
- [scratch/inspect_order_73_pricing.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_order_73_pricing.mjs:21): `console.log("Checking sales_orders where bill_number or order_number contains '73'...");`
- [scratch/inspect_order_73_pricing.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_order_73_pricing.mjs:25): `.or("bill_number.eq.73,order_number.ilike.%73%");`
- [scratch/inspect_order_73_pricing.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_order_73_pricing.mjs:31): `console.log(\`Order ID: ${o.id} | Order No: ${o.order_number} | Date: ${o.order_date} | Bill No: ${o.bill_number} | Bill Value: ${o.bill_value} | GST: ${o.gst_rate} | Status: ${o.status}\`);`
- [scratch/inspect_updated_at.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_updated_at.mjs:23): `.select("order_number, created_at, updated_at, updated_by")`
- [scratch/inspect_updated_at.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_updated_at.mjs:24): `.eq("order_number", "DP-07-12-01")`
- [scratch/inspect-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-journals.mjs:20): `.select("id, purchase_date, supplier_name, bill_number, total_amount");`
- [scratch/inspect-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-journals.mjs:23): `.from("accounts_journal")`
- [scratch/inspect-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-journals.mjs:24): `.select("journal_no, entry_date, description, account_name, entry_type, amount");`
- [scratch/inspect-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-journals.mjs:27): `console.error("Supabase error for accounts_journal:", error);`
- [scratch/inspect-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-journals.mjs:34): `// Group journals by journal_no`
- [scratch/inspect-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-journals.mjs:37): `if (!journalsByNo[j.journal_no]) {`
- [scratch/inspect-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-journals.mjs:38): `journalsByNo[j.journal_no] = [];`
- [scratch/inspect-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-journals.mjs:40): `journalsByNo[j.journal_no].push(j);`
- [scratch/inspect-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-journals.mjs:55): `const bill = (p.bill_number || "").toLowerCase();`
- [scratch/inspect-kankariya.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-kankariya.mjs:21): `.rpc("get_accounts_journal_summary_by_date", { p_date: "2026-07-02" });`
- [scratch/inspect-kankariya.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-kankariya.mjs:28): `.from("accounts_journal")`
- [scratch/inspect-purchases.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-purchases.mjs:20): `.select("purchase_date, total_amount, id, supplier_name, bill_number");`
- [scratch/list_billed_orders.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/list_billed_orders.mjs:28): `.select("id, order_number, order_date, status, bill_number, bill_value, is_draft_billing, deleted_at")`
- [scratch/list_billed_orders.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/list_billed_orders.mjs:29): `.not("bill_number", "is", null);`
- [scratch/list_recent_purchases.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/list_recent_purchases.mjs:33): `console.log(\`ID: ${p.id} | Date: ${p.purchase_date} | Supplier: ${p.supplier_name} | Bill: ${p.bill_number} | Quantity: ${p.quantity} | Total: ${p.total_amount} | Created: ${p.created_at}\`);`
- [scratch/restore-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/restore-journals.mjs:17): `async function generateNextJournalNo() {`
- [scratch/restore-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/restore-journals.mjs:18): `const { data, error } = await supabase.rpc("get_next_journal_no");`
- [scratch/restore-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/restore-journals.mjs:25): `.from("accounts_journal")`
- [scratch/restore-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/restore-journals.mjs:26): `.select("journal_no")`
- [scratch/restore-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/restore-journals.mjs:31): `const match = j.journal_no ? j.journal_no.match(/^JE-(\d+)$/) : null;`
- [scratch/restore-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/restore-journals.mjs:47): `bill_number: '2241',`
- [scratch/restore-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/restore-journals.mjs:54): `bill_number: '541',`
- [scratch/restore-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/restore-journals.mjs:73): `console.log(\`Restoring journals for purchase ${p.id} (${p.supplier_name}, Bill ${p.bill_number})...\`);`
- [scratch/restore-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/restore-journals.mjs:88): `const journalNo = await generateNextJournalNo();`
- [scratch/restore-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/restore-journals.mjs:93): `journal_no: journalNo,`
- [scratch/restore-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/restore-journals.mjs:99): `description: \`[PURCHASE_REF:${p.id}] ${p.bill_number} (${supplierAc.customer_name})\`,`
- [scratch/restore-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/restore-journals.mjs:102): `journal_no: journalNo,`
- [scratch/restore-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/restore-journals.mjs:108): `description: \`[PURCHASE_REF:${p.id}] ${p.bill_number}\`,`
- [scratch/restore-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/restore-journals.mjs:113): `.from("accounts_journal")`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:41): `order_number: string;`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:45): `bill_number?: string;`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:198): `fd.append("bill_number", finalBillNumber.trim());`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:224): `const billNo = order.bill_number;`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:231): `order_number: order.order_number,`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:232): `order_numbers: [order.order_number],`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:237): `groups[billNo].order_numbers.push(order.order_number);`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:240): `if (!groups[billNo].order_numbers.includes(order.order_number)) {`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:241): `groups[billNo].order_number = groups[billNo].order_numbers.join(", ");`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:255): `if (billed && billed.bill_number) {`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:256): `const siblings = billedOrders.filter((o) => o.bill_number === billed.bill_number);`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:259): `order_number: Array.from(new Set(siblings.map((o) => o.order_number))).join(", "),`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:392): `Order #{order.order_number}`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:538): `<TableCell className="text-sm font-mono">{order.bill_number}</TableCell>`
- [scratch/test_journal_insert.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_journal_insert.mjs:20): `async function generateNextJournalNo() {`
- [scratch/test_journal_insert.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_journal_insert.mjs:22): `.from("accounts_journal")`
- [scratch/test_journal_insert.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_journal_insert.mjs:23): `.select("journal_no")`
- [scratch/test_journal_insert.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_journal_insert.mjs:26): `.map((j) => j.journal_no)`
- [scratch/test_journal_insert.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_journal_insert.mjs:49): `const journalNo = await generateNextJournalNo();`
- [scratch/test_journal_insert.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_journal_insert.mjs:52): `journal_no: journalNo,`
- [scratch/test_journal_insert.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_journal_insert.mjs:63): `journal_no: journalNo,`
- [scratch/test_journal_insert.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_journal_insert.mjs:76): `const { data, error } = await supabase.from("accounts_journal").insert(journalInserts).select();`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:146): `order_number: \`SO-TEST-${suffix}\`,`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:216): `current_stock: 100,`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:231): `bill_number: \`BILL-${suffix}\`,`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:553): `.from("accounts_journal")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:555): `journal_no: \`JE-TEST-${suffix}\`,`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:571): `await supabase.from("accounts_journal").delete().eq("id", journal.id);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:578): `.from("accounts_journal")`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:584): `await supabase.from("accounts_journal").delete().eq("id", journal.id);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:589): `await supabase.from("accounts_journal").delete().eq("id", journal.id);`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:595): `const { error: jdErr } = await supabase.from("accounts_journal").delete().eq("id", journal.id);`
- [scripts/analyze_inconsistencies.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/analyze_inconsistencies.mjs:29): `id, purchase_date, supplier_name, bill_number, total_amount, created_at,`
- [scripts/analyze_inconsistencies.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/analyze_inconsistencies.mjs:58): `console.log(\`- Date: ${p.purchase_date}, Supplier: ${p.supplier_name}, Bill: ${p.bill_number}, Amount: ₹${p.total_amount}, Created: ${p.created_at}\`);`
- [scripts/analyze_inconsistencies.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/analyze_inconsistencies.mjs:63): `console.log(\`- Date: ${m.purchase.purchase_date}, Bill: ${m.purchase.bill_number}, Header Amount: ₹${m.purchase.total_amount}, Items Sum: ₹${m.itemsSum}\`);`
- [scripts/analyze_inconsistencies.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/analyze_inconsistencies.mjs:69): `const descExact = \`Product Purchase: ${p.bill_number}\`;`
- [scripts/analyze_inconsistencies.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/analyze_inconsistencies.mjs:70): `const descPrefix = \`Product Purchase: ${p.bill_number} (%\`;`
- [scripts/analyze_inconsistencies.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/analyze_inconsistencies.mjs:72): `.from("accounts_journal")`
- [scripts/analyze_inconsistencies.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/analyze_inconsistencies.mjs:73): `.select("id, journal_no, entry_date, account_name, entry_type, amount, description")`
- [scripts/analyze_inconsistencies.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/analyze_inconsistencies.mjs:77): `console.log(\`- MISSING JOURNAL: Bill ${p.bill_number} (${p.supplier_name}, Amount: ₹${p.total_amount}) has NO journal entries!\`);`
- [scripts/analyze_inconsistencies.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/analyze_inconsistencies.mjs:82): `console.log(\`- UNBALANCED JOURNAL for Bill ${p.bill_number}: Debit sum ₹${debitSum} !== Credit sum ₹${creditSum}\`);`
- [scripts/generate-enterprise-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-enterprise-forensic-docs.mjs:255): `const revalidations = [...body.matchAll(/revalidatePath\(["'\`]([^"'\`]+)["'\`]/g)].map((m) => m[1]);`
- [scripts/generate-enterprise-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-enterprise-forensic-docs.mjs:302): `out += \`${"  ".repeat(depth + 1)}- revalidatePath: ${trace.revalidations.map((p) => \`\\`${p}\\`\`).join(", ")}\n\`;`
- [scripts/generate-enterprise-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-enterprise-forensic-docs.mjs:329): `seq += \`  ServerAction->>Cache: revalidatePath(${p})\n\`;`
- [scripts/generate-enterprise-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-enterprise-forensic-docs.mjs:367): `const uiRows = evidence(source, (t) => /<Table|<table|Dialog|searchParams|filter|sort|order\(|limit\(|range\(|ilike\(|gte\(|lte\(|loading|toast|router\.refresh|revalidatePath|useSearchParams|pagination/i.test(t));`
- [scripts/generate-enterprise-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-enterprise-forensic-docs.mjs:368): `const sideEffectRows = evidence(source, (t) => /revalidatePath|router\.refresh|revalidateAllReports|generateNextJournalNo|current_stock|accounts_journal|journal_no|bill_number|order_number|dispatch_number/i.test(t));`
- [scripts/generate-enterprise-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-enterprise-forensic-docs.mjs:679): `cross += "Evidence from \`revalidatePath\` and shared tables in server actions:\n\n";`
- [scripts/generate-enterprise-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-enterprise-forensic-docs.mjs:683): `{ from: "Accounts", tables: ["accounts_journal"], to: "Reports" },`
- [scripts/generate-enterprise-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-enterprise-forensic-docs.mjs:693): `cross += heading("Shared Helper: revalidateAllReports");`
- [scripts/generate-enterprise-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-enterprise-forensic-docs.mjs:694): `cross += bullets(evidence(source.filter((r) => r.rel.includes("_actions/helpers.ts")), (t) => /revalidateAllReports|revalidatePath/.test(t)));`
- [scripts/generate-enterprise-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-enterprise-forensic-docs.mjs:696): `cross += bullets(evidence(source.filter((r) => r.rel.includes("_actions/helpers.ts")), (t) => /generateNextJournalNo|get_next_journal_no/.test(t)));`
- [scripts/generate-enterprise-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-enterprise-forensic-docs.mjs:712): `hidden += heading("revalidatePath / router.refresh Evidence");`
- [scripts/generate-enterprise-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-enterprise-forensic-docs.mjs:720): `risks += bullets(evidence(source, (t) => /journal_no|bill_number|order_number|dispatch_number|get_next|next_year_number|unique|max\(/.test(t)));`
- [scripts/generate-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-forensic-docs.mjs:188): `{ name: "cache", re: /revalidatePath|cache|unstable_|noStore|dynamic\s*=/ },`
- [scripts/generate-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-forensic-docs.mjs:357): `crud += \`Side effects, logs, notifications, cache invalidation, stock/ledger/balance/history updates:\n\n${fencedEvidence(evidence.filter((e) => e.text.includes(table) && /revalidatePath|toast|audit|journal|ledger|stock|balance|history|notification|updated_at|deleted_at/i.test(e.text)))}\`;`
- [scripts/generate-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-forensic-docs.mjs:379): `const pk = create.text.split(/\r?\n/).filter((l) => /primary key|unique|bill_number|invoice|order_number|journal_no/i.test(l));`
- [scripts/generate-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-forensic-docs.mjs:385): `impact += fencedEvidence(evidence.filter((e) => e.text.includes(table) && /delete|deleted_at|cascade|set null|on delete|unique|bill_number|order_number|journal_no|stock|balance|journal|audit|history/i.test(e.text)));`
- [scripts/test-db.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/test-db.mjs:24): `const { data, error } = await supabase.from("accounts_journal").insert({`
- [scripts/test-db.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/test-db.mjs:25): `journal_no: "JE-000123",`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:3): `import { revalidatePath } from "next/cache";`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:34): `revalidatePath("/reports/opening-balance");`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:35): `revalidatePath("/reports/accounts");`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:50): `"accounts_journal",`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:88): `.update({ current_stock: rm.opening_stock, updated_by: user.id })`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:125): `revalidatePath("/admin/raw-materials");`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:126): `revalidatePath("/fabric/stock");`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:127): `revalidatePath("/accounts/sales");`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:128): `revalidatePath("/accounts/purchase");`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:129): `revalidatePath("/accounts/consumption");`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:130): `revalidatePath("/accounts/journal");`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:131): `revalidatePath("/reports/stock");`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:132): `revalidatePath("/reports/closing-stock");`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:133): `revalidatePath("/reports/accounts");`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:134): `revalidatePath("/dashboard");`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:180): `revalidatePath("/reports/closing-stock");`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:181): `revalidatePath("/reports/profit-loss");`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:182): `revalidatePath("/reports/balance-sheet");`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:224): `revalidatePath("/reports/profit-loss");`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:225): `revalidatePath("/reports/balance-sheet");`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:3): `import { revalidatePath } from "next/cache";`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:53): `revalidatePath("/attendance");`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:54): `revalidatePath("/dashboard");`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:83): `revalidatePath("/attendance");`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:84): `revalidatePath("/dashboard");`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:110): `revalidatePath("/users");`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:111): `revalidatePath("/employees");`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:112): `revalidatePath("/attendance");`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:5): `import { revalidatePath } from "next/cache";`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:56): `order_number: orderNumber,`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:92): `revalidatePath("/portal/dashboard");`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:134): `order_number: orderNumber,`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:176): `revalidatePath("/sales/client-orders");`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:177): `revalidatePath("/sales/order-confirmation");`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:178): `revalidatePath("/portal/dashboard");`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:195): `revalidatePath("/sales/client-orders");`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:196): `revalidatePath("/portal/dashboard");`

