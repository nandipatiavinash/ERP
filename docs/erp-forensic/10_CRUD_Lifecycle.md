# 10 CRUD Lifecycle

Traces CRUD by module with initiation point and downstream effects evidenced in the same execution chain.

## Admin

### checkInAttendance

- Entry: [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:15)
- Call chain: checkInAttendance @ src/app/(app)/_actions/attendance.ts:15 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → assertValid @ src/app/(app)/_actions/helpers.ts:125 → readPayload @ src/app/(app)/_actions/helpers.ts:49 → sanitizeText @ src/app/(app)/_actions/helpers.ts:25 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → assertAttendanceAccess @ src/app/(app)/_actions/helpers.ts:131 → getSessionPermissions @ src/lib/auth.ts:102 → todayInIndia @ src/app/(app)/_actions/helpers.ts:40 → todayInIndia @ src/lib/utils.ts:28
- Tables: select@attendance, update@attendance, insert@attendance, select@employees
- Cache invalidation: /attendance, /dashboard

### checkOutAttendance

- Entry: [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:57)
- Call chain: checkOutAttendance @ src/app/(app)/_actions/attendance.ts:57 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → assertValid @ src/app/(app)/_actions/helpers.ts:125 → readPayload @ src/app/(app)/_actions/helpers.ts:49 → sanitizeText @ src/app/(app)/_actions/helpers.ts:25 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → assertAttendanceAccess @ src/app/(app)/_actions/helpers.ts:131 → getSessionPermissions @ src/lib/auth.ts:102 → todayInIndia @ src/app/(app)/_actions/helpers.ts:40 → todayInIndia @ src/lib/utils.ts:28
- Tables: select@attendance, update@attendance, select@employees
- Cache invalidation: /attendance, /dashboard

### linkEmployeeUser

- Entry: [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:87)
- Call chain: linkEmployeeUser @ src/app/(app)/_actions/attendance.ts:87 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → getSessionPermissions @ src/lib/auth.ts:102 → assertValid @ src/app/(app)/_actions/helpers.ts:125 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: update@employees
- Cache invalidation: /users, /employees, /attendance

### createErpUser

- Entry: [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:14)
- Call chain: createErpUser @ src/app/(app)/_actions/users-roles.ts:14 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createAdminClient @ src/lib/supabase/admin.ts:5
- Tables: upsert@users
- Cache invalidation: /users, /admin/credentials

### changeUserPassword

- Entry: [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:85)
- Call chain: changeUserPassword @ src/app/(app)/_actions/users-roles.ts:85 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createAdminClient @ src/lib/supabase/admin.ts:5
- Tables: update@users
- Cache invalidation: /admin/credentials

### deleteErpUser

- Entry: [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:66)
- Call chain: deleteErpUser @ src/app/(app)/_actions/users-roles.ts:66 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: update@users
- Cache invalidation: /users, /admin/credentials

### createRole

- Entry: [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:123)
- Call chain: createRole @ src/app/(app)/_actions/users-roles.ts:123 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → assertValid @ src/app/(app)/_actions/helpers.ts:125 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: insert@roles
- Cache invalidation: /roles

### saveRoleDetails

- Entry: [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:139)
- Call chain: saveRoleDetails @ src/app/(app)/_actions/users-roles.ts:139 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → assertValid @ src/app/(app)/_actions/helpers.ts:125 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: update@roles
- Cache invalidation: /roles, /admin/permissions, /admin/permissions/${roleId}

### saveRolePermissions

- Entry: [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:174)
- Call chain: saveRolePermissions @ src/app/(app)/_actions/users-roles.ts:174 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → assertValid @ src/app/(app)/_actions/helpers.ts:125 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: delete@role_permissions, insert@role_permissions
- Cache invalidation: /roles, /admin/permissions, /admin/permissions/${roleId}

### deactivateRole

- Entry: [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:161)
- Call chain: deactivateRole @ src/app/(app)/_actions/users-roles.ts:161 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → assertValid @ src/app/(app)/_actions/helpers.ts:125 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: delete@roles
- Cache invalidation: /roles

### saveRotoProduct

- Entry: [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:8)
- Call chain: saveRotoProduct @ src/app/(app)/_actions/products.ts:8 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → createAdminClient @ src/lib/supabase/admin.ts:5
- Tables: access@products, update@roto_products, insert@roto_products, select@roto_product_colors, delete@roto_product_colors, upsert@roto_product_colors
- Cache invalidation: /admin/products

### deactivateRotoProduct

- Entry: [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:135)
- Call chain: deactivateRotoProduct @ src/app/(app)/_actions/products.ts:135 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: update@roto_products
- Cache invalidation: /admin/products

### saveOffsetProduct

- Entry: [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:147)
- Call chain: saveOffsetProduct @ src/app/(app)/_actions/products.ts:147 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → createAdminClient @ src/lib/supabase/admin.ts:5
- Tables: access@products, update@offset_products, insert@offset_products
- Cache invalidation: /admin/products

### deactivateOffsetProduct

- Entry: [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:209)
- Call chain: deactivateOffsetProduct @ src/app/(app)/_actions/products.ts:209 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: update@offset_products
- Cache invalidation: /admin/products

### saveCatalogProduct

- Entry: [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:221)
- Call chain: saveCatalogProduct @ src/app/(app)/_actions/products.ts:221 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → createAdminClient @ src/lib/supabase/admin.ts:5
- Tables: access@products, update@fabric_types, insert@fabric_types, update@finishing_products, insert@finishing_products
- Cache invalidation: /admin/catalog, /portal/catalog

## Accounts

### saveJournalEntry

- Entry: [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:8)
- Call chain: saveJournalEntry @ src/app/(app)/_actions/journal.ts:8 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → revalidateAllReports @ src/app/(app)/_actions/helpers.ts:29
- Tables: update@accounts_journal, select@customers, insert@accounts_journal
- Cache invalidation: /accounts/journal, /accounts/sales, /reports, /reports/accounts, /reports/opening-balance, /reports/closing-stock, /reports/profit-loss, /reports/balance-sheet, /reports/sales-confirmation, /reports/stock

### softDeleteJournalEntryGroup

- Entry: [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:121)
- Call chain: softDeleteJournalEntryGroup @ src/app/(app)/_actions/journal.ts:121 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → revalidateAllReports @ src/app/(app)/_actions/helpers.ts:29
- Tables: select@accounts_journal, delete@accounts_journal
- Cache invalidation: /accounts/journal, /accounts/sales, /reports, /reports/accounts, /reports/opening-balance, /reports/closing-stock, /reports/profit-loss, /reports/balance-sheet, /reports/sales-confirmation, /reports/stock

### saveAccountOpeningBalance

- Entry: [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:7)
- Call chain: saveAccountOpeningBalance @ src/app/(app)/_actions/accounts.ts:7 → requireAnyPermission @ src/lib/auth.ts:116 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: update@customers
- Cache invalidation: /reports/opening-balance, /reports/accounts

### saveClosingStock

- Entry: [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:137)
- Call chain: saveClosingStock @ src/app/(app)/_actions/accounts.ts:137 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: select@settings, update@settings, insert@settings
- Cache invalidation: /reports/closing-stock, /reports/profit-loss, /reports/balance-sheet

### saveProfitLoss

- Entry: [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:185)
- Call chain: saveProfitLoss @ src/app/(app)/_actions/accounts.ts:185 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: select@settings, update@settings, insert@settings
- Cache invalidation: /reports/profit-loss, /reports/balance-sheet

### clearSystemTransactions

- Entry: [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:38)
- Call chain: clearSystemTransactions @ src/app/(app)/_actions/accounts.ts:38 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: update@fabric_rolls, select@raw_materials, update@raw_materials, select@customers, insert@customers
- Cache invalidation: /admin/raw-materials, /fabric/stock, /accounts/sales, /accounts/purchase, /accounts/consumption, /accounts/journal, /reports/stock, /reports/closing-stock, /reports/accounts, /dashboard

### softDeleteJournalEntry

- Entry: [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:105)
- Call chain: softDeleteJournalEntry @ src/app/(app)/_actions/journal.ts:105 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → revalidateAllReports @ src/app/(app)/_actions/helpers.ts:29
- Tables: update@accounts_journal
- Cache invalidation: /accounts/journal, /accounts/sales, /reports, /reports/accounts, /reports/opening-balance, /reports/closing-stock, /reports/profit-loss, /reports/balance-sheet, /reports/sales-confirmation, /reports/stock

## Sales

### saveSale

- Entry: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:15)
- Call chain: saveSale @ src/app/(app)/_actions/sales.ts:15 → requireAnyPermission @ src/lib/auth.ts:116 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → assertValid @ src/app/(app)/_actions/helpers.ts:125 → readPayload @ src/app/(app)/_actions/helpers.ts:49 → sanitizeText @ src/app/(app)/_actions/helpers.ts:25
- Tables: update@sales_orders, insert@sales_orders
- Cache invalidation: /sales, /rolls, /dashboard

### createSalesOrder

- Entry: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:38)
- Call chain: createSalesOrder @ src/app/(app)/_actions/sales.ts:38 → requireAnyPermission @ src/lib/auth.ts:116 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → todayInIndia @ src/app/(app)/_actions/helpers.ts:40 → todayInIndia @ src/lib/utils.ts:28 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: select@sales_orders, insert@sales_orders, insert@sales_order_items, rpc@get_next_order_no
- Cache invalidation: /sales/order-confirmation

### deleteSalesOrderItem

- Entry: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:124)
- Call chain: deleteSalesOrderItem @ src/app/(app)/_actions/sales.ts:124 → requireAnyPermission @ src/lib/auth.ts:116 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: select@sales_order_items, delete@sales_order_items, delete@sales_orders
- Cache invalidation: /sales/delivery-entry, /rolls, /fabric/stock, /accounts/sales

### prepareSalesOrderDraftBilling

- Entry: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:425)
- Call chain: prepareSalesOrderDraftBilling @ src/app/(app)/_actions/sales.ts:425 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: select@sales_order_items, insert@sales_orders, update@sales_order_items, update@sales_orders
- Cache invalidation: /accounts/sales

### finalizeSalesOrderBilling

- Entry: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:554)
- Call chain: finalizeSalesOrderBilling @ src/app/(app)/_actions/sales.ts:554 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → todayInIndia @ src/app/(app)/_actions/helpers.ts:40 → todayInIndia @ src/lib/utils.ts:28 → generateNextJournalNo @ src/app/(app)/_actions/helpers.ts:166
- Tables: select@sales_orders, update@sales_orders, select@customers, insert@accounts_journal, delete@accounts_journal, select@accounts_journal, rpc@get_next_journal_no
- Cache invalidation: /accounts/sales, /accounts/journal, /sales/delivery-entry, /reports

### discardSalesOrderDraftBilling

- Entry: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:675)
- Call chain: discardSalesOrderDraftBilling @ src/app/(app)/_actions/sales.ts:675 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: update@sales_orders
- Cache invalidation: /accounts/sales

### deleteSalesOrderCompletely

- Entry: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:694)
- Call chain: deleteSalesOrderCompletely @ src/app/(app)/_actions/sales.ts:694 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → revalidateAllReports @ src/app/(app)/_actions/helpers.ts:29
- Tables: select@sales_orders, update@fabric_rolls, select@accounts_journal, delete@accounts_journal, delete@sales_order_items, delete@sales_orders
- Cache invalidation: /sales/order-confirmation, /sales/delivery-entry, /accounts/sales, /accounts/journal, /rolls, /fabric/stock, /reports, /reports/accounts, /reports/opening-balance, /reports/closing-stock, /reports/profit-loss, /reports/balance-sheet, /reports/sales-confirmation, /reports/stock

### saveSalesConfirmationRates

- Entry: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:773)
- Call chain: saveSalesConfirmationRates @ src/app/(app)/_actions/sales.ts:773 → requireAnyPermission @ src/lib/auth.ts:116 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → generateNextJournalNo @ src/app/(app)/_actions/helpers.ts:166 → todayInIndia @ src/app/(app)/_actions/helpers.ts:40 → todayInIndia @ src/lib/utils.ts:28
- Tables: select@sales_orders, update@sales_orders, update@sales_order_items, select@fabric_rolls, select@lamination_rolls, select@offset_rolls, select@finishing_bundles, select@roto_film_rolls, select@roto_metallic_rolls, delete@accounts_journal, select@customers, insert@accounts_journal, select@accounts_journal, rpc@get_next_journal_no
- Cache invalidation: /reports/sales-confirmation, /accounts/journal, /reports/accounts

### saveMaterialSalesEntry

- Entry: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:957)
- Call chain: saveMaterialSalesEntry @ src/app/(app)/_actions/sales.ts:957 → requireAnyPermission @ src/lib/auth.ts:116 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → todayInIndia @ src/app/(app)/_actions/helpers.ts:40 → todayInIndia @ src/lib/utils.ts:28 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → generateNextJournalNo @ src/app/(app)/_actions/helpers.ts:166 → revalidateAllReports @ src/app/(app)/_actions/helpers.ts:29
- Tables: select@raw_materials, select@customers, insert@accounts_journal, insert@material_sales, delete@accounts_journal, select@accounts_journal, rpc@get_next_journal_no
- Cache invalidation: /accounts/material, /accounts/journal, /reports, /reports/accounts, /reports/opening-balance, /reports/closing-stock, /reports/profit-loss, /reports/balance-sheet, /reports/sales-confirmation, /reports/stock

### deleteMaterialSalesEntry

- Entry: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1089)
- Call chain: deleteMaterialSalesEntry @ src/app/(app)/_actions/sales.ts:1089 → requireAnyPermission @ src/lib/auth.ts:116 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → revalidateAllReports @ src/app/(app)/_actions/helpers.ts:29
- Tables: delete@material_sales, delete@accounts_journal
- Cache invalidation: /accounts/material, /accounts/journal, /reports, /reports/accounts, /reports/opening-balance, /reports/closing-stock, /reports/profit-loss, /reports/balance-sheet, /reports/sales-confirmation, /reports/stock

### saveSalesOrderBillingDirect

- Entry: [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:1407)
- Call chain: saveSalesOrderBillingDirect @ src/app/(app)/_actions/sales.ts:1407 → requireAnyPermission @ src/lib/auth.ts:116 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → todayInIndia @ src/app/(app)/_actions/helpers.ts:40 → todayInIndia @ src/lib/utils.ts:28 → revalidateAllReports @ src/app/(app)/_actions/helpers.ts:29 → generateNextJournalNo @ src/app/(app)/_actions/helpers.ts:166
- Tables: select@sales_orders, update@sales_orders, select@customers, insert@accounts_journal, delete@accounts_journal, select@accounts_journal, rpc@get_next_journal_no
- Cache invalidation: /accounts/sales, /accounts/journal, /sales/delivery-entry, /reports, /reports/accounts, /reports/opening-balance, /reports/closing-stock, /reports/profit-loss, /reports/balance-sheet, /reports/sales-confirmation, /reports/stock

### approveClientOrder

- Entry: [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:100)
- Call chain: approveClientOrder @ src/app/(app)/_actions/client-orders.ts:100 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → createAdminClient @ src/lib/supabase/admin.ts:5
- Tables: select@client_orders, insert@sales_orders, insert@sales_order_items, delete@sales_orders, update@client_orders, rpc@get_next_order_no
- Cache invalidation: /sales/client-orders, /sales/order-confirmation, /portal/dashboard

### cancelClientOrder

- Entry: [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:181)
- Call chain: cancelClientOrder @ src/app/(app)/_actions/client-orders.ts:181 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → createAdminClient @ src/lib/supabase/admin.ts:5
- Tables: update@client_orders
- Cache invalidation: /sales/client-orders, /portal/dashboard

### createClientOrder

- Entry: [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:24)
- Call chain: createClientOrder @ src/app/(app)/_actions/client-orders.ts:24 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → createAdminClient @ src/lib/supabase/admin.ts:5
- Tables: select@users, insert@client_orders, insert@client_order_items, rpc@next_client_order_no
- Cache invalidation: /portal/dashboard

### createClientSalesOrder

- Entry: [src/app/(app)/_actions/client-sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-sales.ts:12)
- Call chain: createClientSalesOrder @ src/app/(app)/_actions/client-sales.ts:12 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: select@users, insert@sales_orders, insert@sales_order_items, rpc@get_next_order_no
- Cache invalidation: /client/dashboard, /accounts/sales

## Inventory

### saveRawMaterialPurchase

- Entry: [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:8)
- Call chain: saveRawMaterialPurchase @ src/app/(app)/_actions/purchases.ts:8 → requireAnyPermission @ src/lib/auth.ts:116 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → generateNextJournalNo @ src/app/(app)/_actions/helpers.ts:166
- Tables: insert@raw_material_purchases, select@customers, insert@accounts_journal, select@accounts_journal, rpc@get_next_journal_no
- Cache invalidation: /

### deleteRawMaterialPurchase

- Entry: [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:104)
- Call chain: deleteRawMaterialPurchase @ src/app/(app)/_actions/purchases.ts:104 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → todayInIndia @ src/app/(app)/_actions/helpers.ts:40 → todayInIndia @ src/lib/utils.ts:28
- Tables: select@raw_material_purchases, update@raw_material_purchases, delete@raw_material_purchases, select@accounts_journal, delete@accounts_journal
- Cache invalidation: /

### updateCriticalLevel

- Entry: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:11)
- Call chain: updateCriticalLevel @ src/app/(app)/_actions/raw-materials.ts:11 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: update@raw_materials
- Cache invalidation: /admin/critical-levels, /admin/raw-materials

### saveRawMaterialConsumption

- Entry: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:27)
- Call chain: saveRawMaterialConsumption @ src/app/(app)/_actions/raw-materials.ts:27 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: update@raw_material_consumptions, insert@raw_material_consumptions
- Cache invalidation: /fabric/consumption, /roto-printing/consumption, /lamination/consumption, /offset-printing/consumption, /finishing/consumption, /raw-materials, /dashboard, /reports

### softDeleteRawMaterialConsumption

- Entry: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:79)
- Call chain: softDeleteRawMaterialConsumption @ src/app/(app)/_actions/raw-materials.ts:79 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → todayInIndia @ src/app/(app)/_actions/helpers.ts:40 → todayInIndia @ src/lib/utils.ts:28
- Tables: select@raw_material_consumptions, update@raw_material_consumptions
- Cache invalidation: /fabric/consumption, /roto-printing/consumption, /lamination/consumption, /offset-printing/consumption, /finishing/consumption, /raw-materials, /dashboard, /reports

### consumeFabricRoll

- Entry: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:130)
- Call chain: consumeFabricRoll @ src/app/(app)/_actions/raw-materials.ts:130 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: update@fabric_rolls
- Cache invalidation: /fabric/stock, /lamination/consumption, /offset-printing/consumption, /finishing/consumption

### revertFabricRollConsumption

- Entry: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:153)
- Call chain: revertFabricRollConsumption @ src/app/(app)/_actions/raw-materials.ts:153 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: select@fabric_rolls, update@fabric_rolls
- Cache invalidation: /fabric/stock, /lamination/consumption, /offset-printing/consumption, /finishing/consumption

### consumeMetallicRoll

- Entry: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:182)
- Call chain: consumeMetallicRoll @ src/app/(app)/_actions/raw-materials.ts:182 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: update@roto_metallic_rolls
- Cache invalidation: /roto-printing/stock, /lamination/consumption

### revertMetallicRollConsumption

- Entry: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:197)
- Call chain: revertMetallicRollConsumption @ src/app/(app)/_actions/raw-materials.ts:197 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: update@roto_metallic_rolls
- Cache invalidation: /roto-printing/stock, /lamination/consumption

### consumeRotoFilmRoll

- Entry: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:212)
- Call chain: consumeRotoFilmRoll @ src/app/(app)/_actions/raw-materials.ts:212 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: update@roto_film_rolls
- Cache invalidation: /roto-printing/stock, /lamination/consumption

### revertRotoFilmRollConsumption

- Entry: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:227)
- Call chain: revertRotoFilmRollConsumption @ src/app/(app)/_actions/raw-materials.ts:227 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: update@roto_film_rolls
- Cache invalidation: /roto-printing/stock, /lamination/consumption

### consumeLaminationRoll

- Entry: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:242)
- Call chain: consumeLaminationRoll @ src/app/(app)/_actions/raw-materials.ts:242 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: update@lamination_rolls
- Cache invalidation: /lamination/stock, /offset-printing/consumption, /finishing/consumption

### revertLaminationRollConsumption

- Entry: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:259)
- Call chain: revertLaminationRollConsumption @ src/app/(app)/_actions/raw-materials.ts:259 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: update@lamination_rolls
- Cache invalidation: /lamination/stock, /offset-printing/consumption, /finishing/consumption

### consumeOffsetRoll

- Entry: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:276)
- Call chain: consumeOffsetRoll @ src/app/(app)/_actions/raw-materials.ts:276 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: update@offset_rolls
- Cache invalidation: /offset-printing/stock, /finishing/consumption

### revertOffsetRollConsumption

- Entry: [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:291)
- Call chain: revertOffsetRollConsumption @ src/app/(app)/_actions/raw-materials.ts:291 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5
- Tables: update@offset_rolls
- Cache invalidation: /offset-printing/stock, /finishing/consumption

### saveProductPurchase

- Entry: [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:8)
- Call chain: saveProductPurchase @ src/app/(app)/_actions/product-purchase.ts:8 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createAdminClient @ src/lib/supabase/admin.ts:5 → generateNextJournalNo @ src/app/(app)/_actions/helpers.ts:166
- Tables: insert@product_purchases, select@fabric_types, insert@fabric_rolls, select@roto_products, select@roto_colors, select@roto_film_rolls, insert@roto_film_rolls, insert@roto_metallic_rolls, select@fabric_rolls, select@lamination_rolls, insert@lamination_rolls, update@fabric_rolls, select@offset_products, select@offset_rolls, insert@offset_rolls, update@lamination_rolls, select@finishing_bundles, insert@finishing_bundles, update@offset_rolls, insert@product_purchase_items, delete@product_purchases, select@customers, insert@accounts_journal, rpc@next_year_number, select@accounts_journal, rpc@get_next_journal_no
- Cache invalidation: /accounts/product-purchase

### deleteProductPurchase

- Entry: [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:541)
- Call chain: deleteProductPurchase @ src/app/(app)/_actions/product-purchase.ts:541 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createAdminClient @ src/lib/supabase/admin.ts:5
- Tables: select@product_purchases, select@product_purchase_items, update@fabric_rolls, update@lamination_rolls, update@offset_rolls, delete@fabric_rolls, delete@lamination_rolls, delete@offset_rolls, delete@finishing_bundles, select@roto_metallic_rolls, delete@roto_metallic_rolls, delete@roto_film_rolls, select@accounts_journal, delete@accounts_journal, delete@product_purchases
- Cache invalidation: /accounts/product-purchase

## Production

### saveProduction

- Entry: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:14)
- Call chain: saveProduction @ src/app/(app)/_actions/production.ts:14 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → getSessionPermissions @ src/lib/auth.ts:102 → assertValid @ src/app/(app)/_actions/helpers.ts:125 → readPayload @ src/app/(app)/_actions/helpers.ts:49 → sanitizeText @ src/app/(app)/_actions/helpers.ts:25 → createAdminClient @ src/lib/supabase/admin.ts:5
- Tables: select@loom_production_entries, update@loom_production_entries, insert@loom_production_entries
- Cache invalidation: /fabric/production, /rolls, /dashboard, /fabric/stock

### softDeleteProduction

- Entry: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:73)
- Call chain: softDeleteProduction @ src/app/(app)/_actions/production.ts:73 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → createAdminClient @ src/lib/supabase/admin.ts:5
- Tables: select@fabric_rolls, delete@loom_production_entries
- Cache invalidation: /fabric/production, /rolls, /dashboard, /fabric/stock

### saveRotoFilmProduction

- Entry: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:110)
- Call chain: saveRotoFilmProduction @ src/app/(app)/_actions/production.ts:110 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → todayInIndia @ src/app/(app)/_actions/helpers.ts:40 → todayInIndia @ src/lib/utils.ts:28 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → createAdminClient @ src/lib/supabase/admin.ts:5
- Tables: select@roto_products, select@roto_colors, select@roto_film_rolls, insert@roto_film_rolls
- Cache invalidation: /roto-printing/production, /roto-printing/stock, /lamination/production

### deleteRotoFilmProduction

- Entry: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:190)
- Call chain: deleteRotoFilmProduction @ src/app/(app)/_actions/production.ts:190 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → createAdminClient @ src/lib/supabase/admin.ts:5
- Tables: select@roto_film_rolls, select@roto_metallic_rolls, delete@roto_film_rolls
- Cache invalidation: /roto-printing/production, /roto-printing/stock, /lamination/production

### saveRotoMetallicProduction

- Entry: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:215)
- Call chain: saveRotoMetallicProduction @ src/app/(app)/_actions/production.ts:215 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → todayInIndia @ src/app/(app)/_actions/helpers.ts:40 → todayInIndia @ src/lib/utils.ts:28 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → createAdminClient @ src/lib/supabase/admin.ts:5
- Tables: select@roto_film_rolls, insert@roto_metallic_rolls, update@roto_film_rolls
- Cache invalidation: /roto-printing/production, /roto-printing/stock, /lamination/production

### deleteRotoMetallicProduction

- Entry: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:276)
- Call chain: deleteRotoMetallicProduction @ src/app/(app)/_actions/production.ts:276 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → createAdminClient @ src/lib/supabase/admin.ts:5
- Tables: select@roto_metallic_rolls, select@lamination_rolls, delete@roto_metallic_rolls
- Cache invalidation: /roto-printing/production, /roto-printing/stock, /lamination/production

### saveLaminationProduction

- Entry: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:301)
- Call chain: saveLaminationProduction @ src/app/(app)/_actions/production.ts:301 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → todayInIndia @ src/app/(app)/_actions/helpers.ts:40 → todayInIndia @ src/lib/utils.ts:28 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → createAdminClient @ src/lib/supabase/admin.ts:5
- Tables: select@fabric_types, select@roto_film_rolls, select@roto_metallic_rolls, select@roto_products, select@lamination_rolls, insert@lamination_rolls, update@roto_metallic_rolls
- Cache invalidation: /lamination/production, /lamination/stock, /offset-printing/production, /finishing/production

### deleteLaminationProduction

- Entry: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:431)
- Call chain: deleteLaminationProduction @ src/app/(app)/_actions/production.ts:431 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → createAdminClient @ src/lib/supabase/admin.ts:5
- Tables: select@lamination_rolls, select@offset_rolls, select@finishing_bundles, delete@lamination_rolls
- Cache invalidation: /lamination/production, /lamination/stock, /offset-printing/production, /finishing/production

### saveOffsetProduction

- Entry: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:460)
- Call chain: saveOffsetProduction @ src/app/(app)/_actions/production.ts:460 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → todayInIndia @ src/app/(app)/_actions/helpers.ts:40 → todayInIndia @ src/lib/utils.ts:28 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → createAdminClient @ src/lib/supabase/admin.ts:5
- Tables: select@offset_products, select@fabric_types, select@offset_rolls, insert@offset_rolls
- Cache invalidation: /offset-printing/production, /offset-printing/stock, /finishing/production

### deleteOffsetProduction

- Entry: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:530)
- Call chain: deleteOffsetProduction @ src/app/(app)/_actions/production.ts:530 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → createAdminClient @ src/lib/supabase/admin.ts:5
- Tables: select@offset_rolls, select@finishing_bundles, delete@offset_rolls
- Cache invalidation: /offset-printing/production, /offset-printing/stock, /finishing/production

### saveFinishingBundle

- Entry: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:555)
- Call chain: saveFinishingBundle @ src/app/(app)/_actions/production.ts:555 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → todayInIndia @ src/app/(app)/_actions/helpers.ts:40 → todayInIndia @ src/lib/utils.ts:28 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → createAdminClient @ src/lib/supabase/admin.ts:5
- Tables: select@fabric_types, select@lamination_rolls, select@offset_rolls, insert@finishing_bundles
- Cache invalidation: /finishing/production, /finishing/stock

### deleteFinishingBundle

- Entry: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:637)
- Call chain: deleteFinishingBundle @ src/app/(app)/_actions/production.ts:637 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createClient @ src/lib/supabase/client.ts:6 → createClient @ src/lib/supabase/server.ts:5 → createAdminClient @ src/lib/supabase/admin.ts:5
- Tables: select@finishing_bundles, delete@finishing_bundles, update@lamination_rolls, update@fabric_rolls, update@offset_rolls
- Cache invalidation: /finishing/production, /finishing/stock

### saveStageProduction

- Entry: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:675)
- Call chain: saveStageProduction @ src/app/(app)/_actions/production.ts:675 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102 → createAdminClient @ src/lib/supabase/admin.ts:5
- Tables: update@stage_production_entries, insert@stage_production_entries
- Cache invalidation: /roto-printing/production, /roto-printing/stock, /lamination/production, /lamination/stock, /offset-printing/production, /offset-printing/stock, /finishing/production, /finishing/stock, /rolls, /dashboard, /reports

### softDeleteStageProduction

- Entry: [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:738)
- Call chain: softDeleteStageProduction @ src/app/(app)/_actions/production.ts:738 → createAdminClient @ src/lib/supabase/admin.ts:5 → requirePermission @ src/lib/auth.ts:108 → requireUser @ src/lib/auth.ts:31 → getSessionPermissions @ src/lib/auth.ts:102
- Tables: select@stage_production_entries, delete@stage_production_entries
- Cache invalidation: /roto-printing/production, /roto-printing/stock, /lamination/production, /lamination/stock, /offset-printing/production, /offset-printing/stock, /finishing/production, /finishing/stock, /rolls, /dashboard, /reports

## Reports

## Dashboard

## Portal

## Core

### assertAttendanceAccess

- Entry: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:131)
- Call chain: assertAttendanceAccess @ src/app/(app)/_actions/helpers.ts:131 → getSessionPermissions @ src/lib/auth.ts:102
- Tables: select@employees
- Cache invalidation: none evidenced

### generateNextJournalNo

- Entry: [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:166)
- Call chain: generateNextJournalNo @ src/app/(app)/_actions/helpers.ts:166
- Tables: select@accounts_journal, rpc@get_next_journal_no
- Cache invalidation: none evidenced

