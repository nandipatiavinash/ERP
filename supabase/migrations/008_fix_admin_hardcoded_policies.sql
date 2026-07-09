-- Migration: Replace hardcoded admin role checks with dynamic has_permission checks across system tables, and seed missing product permissions.

-- 1. SEED MISSING PRODUCT PERMISSIONS
INSERT INTO public.permissions (module, action, description)
VALUES
  ('roto_products', 'create', 'Create roto products'),
  ('roto_products', 'delete', 'Deactivate roto products'),
  ('offset_products', 'create', 'Create offset products'),
  ('offset_products', 'delete', 'Deactivate offset products')
ON CONFLICT (module, action) DO NOTHING;

-- 2. USERS TABLE
DROP POLICY IF EXISTS "users admin insert" ON public.users;
CREATE POLICY "users insert permitted" ON public.users
FOR INSERT WITH CHECK (
  public.is_admin()
  OR public.has_permission('users.create')
);

DROP POLICY IF EXISTS "users admin update" ON public.users;
CREATE POLICY "users update permitted" ON public.users
FOR UPDATE USING (
  public.is_admin()
  OR public.has_permission('users.edit')
  OR public.has_permission('users.delete')
) WITH CHECK (
  public.is_admin()
  OR public.has_permission('users.create')
  OR public.has_permission('users.edit')
  OR public.has_permission('users.delete')
);

-- 3. ROTO PRODUCTS TABLE
DROP POLICY IF EXISTS "Allow write access to admins on roto_products" ON public.roto_products;
CREATE POLICY "roto_products write permitted" ON public.roto_products
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('roto_products.create')
  OR public.has_permission('roto_products.delete')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('roto_products.create')
);

-- 4. OFFSET PRODUCTS TABLE
DROP POLICY IF EXISTS "Allow write access to admins on offset_products" ON public.offset_products;
CREATE POLICY "offset_products write permitted" ON public.offset_products
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('offset_products.create')
  OR public.has_permission('offset_products.delete')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('offset_products.create')
);

-- 5. ROTO PRODUCT COLORS TABLE
DROP POLICY IF EXISTS "Allow write access to admins on roto_product_colors" ON public.roto_product_colors;
CREATE POLICY "roto_product_colors write permitted" ON public.roto_product_colors
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('roto_products.create')
  OR public.has_permission('roto_products.delete')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('roto_products.create')
);

-- 6. SALES ORDERS TABLE
DROP POLICY IF EXISTS "sales permission write" ON public.sales_orders;
CREATE POLICY "sales permission write" ON public.sales_orders
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('sales.edit')
  OR public.has_permission('sales.order_confirmation')
  OR public.has_permission('sales.delivery_entry')
  OR public.has_permission('accounts.sales')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('sales.create')
  OR public.has_permission('sales.edit')
  OR public.has_permission('sales.order_confirmation')
  OR public.has_permission('sales.delivery_entry')
  OR public.has_permission('accounts.sales')
);

-- 7. SALES ORDER ITEMS TABLE
DROP POLICY IF EXISTS "Allow write access to authenticated users on sales_order_items" ON public.sales_order_items;
DROP POLICY IF EXISTS "sales_order_items write permitted" ON public.sales_order_items;
CREATE POLICY "sales_order_items write permitted" ON public.sales_order_items
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('sales.edit')
  OR public.has_permission('sales.create')
  OR public.has_permission('sales.order_confirmation')
  OR public.has_permission('sales.delivery_entry')
  OR public.has_permission('accounts.sales')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('sales.edit')
  OR public.has_permission('sales.create')
  OR public.has_permission('sales.order_confirmation')
  OR public.has_permission('sales.delivery_entry')
  OR public.has_permission('accounts.sales')
);

-- 8. FABRIC ROLLS TABLE
DROP POLICY IF EXISTS "rolls permission write" ON public.fabric_rolls;
CREATE POLICY "rolls permission write" ON public.fabric_rolls
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('sales.edit')
  OR public.has_permission('sales.order_confirmation')
  OR public.has_permission('sales.delivery_entry')
  OR public.has_permission('accounts.sales')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('production.create')
  OR public.has_permission('production.edit')
  OR public.has_permission('sales.create')
  OR public.has_permission('sales.edit')
  OR public.has_permission('sales.order_confirmation')
  OR public.has_permission('sales.delivery_entry')
  OR public.has_permission('accounts.sales')
);

-- 9. RAW MATERIALS TABLE
DROP POLICY IF EXISTS "raw materials permission write" ON public.raw_materials;
CREATE POLICY "raw materials permission write" ON public.raw_materials
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('raw_materials.edit')
  OR public.has_permission('raw_materials.delete')
  OR public.has_permission('accounts.purchase')
  OR public.has_permission('accounts.material')
  OR public.has_permission('fabric.consumption')
  OR public.has_permission('roto_printing.consumption')
  OR public.has_permission('lamination.consumption')
  OR public.has_permission('offset_printing.consumption')
  OR public.has_permission('finishing.consumption')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('raw_materials.create')
  OR public.has_permission('raw_materials.edit')
  OR public.has_permission('accounts.purchase')
  OR public.has_permission('accounts.material')
  OR public.has_permission('fabric.consumption')
  OR public.has_permission('roto_printing.consumption')
  OR public.has_permission('lamination.consumption')
  OR public.has_permission('offset_printing.consumption')
  OR public.has_permission('finishing.consumption')
);

-- 10. RAW MATERIAL CONSUMPTIONS TABLE
DROP POLICY IF EXISTS "Allow read access to permitted users on raw_material_consumptions" ON public.raw_material_consumptions;
CREATE POLICY "raw_material_consumptions read permitted" ON public.raw_material_consumptions
FOR SELECT TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('production.view')
  OR public.has_permission('raw_materials.view')
  OR public.has_permission('reports.view')
  OR public.has_permission('fabric.consumption')
  OR public.has_permission('roto_printing.consumption')
  OR public.has_permission('lamination.consumption')
  OR public.has_permission('offset_printing.consumption')
  OR public.has_permission('finishing.consumption')
);

DROP POLICY IF EXISTS "Allow write access to permitted users on raw_material_consumptions" ON public.raw_material_consumptions;
CREATE POLICY "raw_material_consumptions write permitted" ON public.raw_material_consumptions
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('raw_materials.edit')
  OR public.has_permission('fabric.consumption')
  OR public.has_permission('roto_printing.consumption')
  OR public.has_permission('lamination.consumption')
  OR public.has_permission('offset_printing.consumption')
  OR public.has_permission('finishing.consumption')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('production.edit')
  OR public.has_permission('raw_materials.edit')
  OR public.has_permission('fabric.consumption')
  OR public.has_permission('roto_printing.consumption')
  OR public.has_permission('lamination.consumption')
  OR public.has_permission('offset_printing.consumption')
  OR public.has_permission('finishing.consumption')
);

-- 11. ACCOUNTS JOURNAL TABLE
DROP POLICY IF EXISTS "Allow read access to permitted users on accounts_journal" ON public.accounts_journal;
CREATE POLICY "accounts_journal read permitted" ON public.accounts_journal
FOR SELECT TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('accounts.journal')
  OR public.has_permission('accounts.purchase')
  OR public.has_permission('accounts.sales')
  OR public.has_permission('accounts.material')
  OR public.has_permission('sales.view')
  OR public.has_permission('reports.view')
);

DROP POLICY IF EXISTS "Allow write access to permitted users on accounts_journal" ON public.accounts_journal;
CREATE POLICY "accounts_journal write permitted" ON public.accounts_journal
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('accounts.journal')
  OR public.has_permission('accounts.purchase')
  OR public.has_permission('accounts.sales')
  OR public.has_permission('accounts.material')
  OR public.has_permission('sales.edit')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('accounts.journal')
  OR public.has_permission('accounts.purchase')
  OR public.has_permission('accounts.sales')
  OR public.has_permission('accounts.material')
  OR public.has_permission('sales.edit')
);

-- 12. MATERIAL SALES TABLE
DROP POLICY IF EXISTS "Allow read access to permitted users on material_sales" ON public.material_sales;
CREATE POLICY "material_sales read permitted" ON public.material_sales
FOR SELECT TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('sales.view')
  OR public.has_permission('accounts.material')
  OR public.has_permission('reports.view')
);

DROP POLICY IF EXISTS "Allow write access to permitted users on material_sales" ON public.material_sales;
CREATE POLICY "material_sales write permitted" ON public.material_sales
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('sales.create')
  OR public.has_permission('sales.edit')
  OR public.has_permission('accounts.material')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('sales.create')
  OR public.has_permission('sales.edit')
  OR public.has_permission('accounts.material')
);

-- 13. CUSTOMERS TABLE
DROP POLICY IF EXISTS "customers permission write" ON public.customers;
CREATE POLICY "customers permission write" ON public.customers
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('customers.edit')
  OR public.has_permission('customers.delete')
  OR public.has_permission('reports.opening_balance')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('customers.create')
  OR public.has_permission('customers.edit')
  OR public.has_permission('reports.opening_balance')
);

-- 14. SETTINGS TABLE
DROP POLICY IF EXISTS "settings admin write" ON public.settings;
CREATE POLICY "settings write permitted" ON public.settings
FOR ALL TO authenticated
USING (
  public.is_admin()
  OR public.has_permission('reports.view')
)
WITH CHECK (
  public.is_admin()
  OR public.has_permission('reports.view')
);
