-- Migration 053: Restore Bill 73 Sales Order, Items, and bookkeeping journal entries

INSERT INTO public.customers (id, customer_name, alias, phone, gst_number, address, status, opening_debit, opening_credit, created_at, updated_at, is_internal) VALUES (
  'c96273fe-dfac-4097-85f0-a538836ada83', 'SV POLYTECH INDUSTRIES', NULL, '7200720999', NULL, 'KAKINADA', 'active', 584017, 0, '2026-06-21T01:18:12.573295+00:00', '2026-07-13T04:45:05.136282+00:00', 'client a/c'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.customers (id, customer_name, alias, phone, gst_number, address, status, opening_debit, opening_credit, created_at, updated_at, is_internal) VALUES (
  '9712f58b-5514-4acf-a837-971c46cdefa2', 'Sales A/c', NULL, NULL, NULL, NULL, 'active', 0, 0, '2026-06-25T09:12:00.000774+00:00', '2026-07-13T04:45:05.136282+00:00', 'profit and loss a/c'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.sales_orders (id, order_number, order_date, customer_id, fabric_type_id, quantity_meters, rate, selected_roll_ids, status, created_by, updated_by, created_at, updated_at, deleted_at, bill_number, bill_value, gst_rate, is_draft_billing, is_jobwork) VALUES (
  'ffdac9ce-8202-4d58-88ff-75cf13c19040', 'DP-07-12-01', '2026-07-12', 'c96273fe-dfac-4097-85f0-a538836ada83', NULL, NULL, NULL, '{}', 'confirmed', '8b199236-2f10-440a-ab7b-7edd8c1e0ccc', 'b3e61197-3ca4-446d-9f35-8767998fb0c2', '2026-07-12T04:14:31.844711+00:00', '2026-07-12T04:30:41.653915+00:00', NULL, '73', 1147814, 18, false, false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.sales_order_items (id, sales_order_id, department, product_id, quantity, selected_roll_ids, price, fabric_type_id, roto_product_id, offset_product_id, film_type, is_metallic, lamination_type, offset_type) VALUES (
  'c124cbad-8984-4ef1-921d-f766ff6f0ea9', 'ffdac9ce-8202-4d58-88ff-75cf13c19040', 'fabric', 'cee6b153-b4fc-4ef8-a462-dbdafa4efb0c', 3391, '{}', 144.4, NULL, NULL, NULL, NULL, false, NULL, NULL
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.sales_order_items (id, sales_order_id, department, product_id, quantity, selected_roll_ids, price, fabric_type_id, roto_product_id, offset_product_id, film_type, is_metallic, lamination_type, offset_type) VALUES (
  '21a709d2-a2c2-4771-b305-f8ff11992b8d', 'ffdac9ce-8202-4d58-88ff-75cf13c19040', 'fabric', 'cd934424-decb-4106-b99e-265c9c3039f4', 1655.5, '{}', 165, NULL, NULL, NULL, NULL, false, NULL, NULL
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.sales_order_items (id, sales_order_id, department, product_id, quantity, selected_roll_ids, price, fabric_type_id, roto_product_id, offset_product_id, film_type, is_metallic, lamination_type, offset_type) VALUES (
  '267f1ed9-9fda-481c-999e-dab720758bba', 'ffdac9ce-8202-4d58-88ff-75cf13c19040', 'fabric', '21bb9f5b-1f34-43d5-8668-afea1541713f', 514, '{}', 168, NULL, NULL, NULL, NULL, false, NULL, NULL
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.sales_order_items (id, sales_order_id, department, product_id, quantity, selected_roll_ids, price, fabric_type_id, roto_product_id, offset_product_id, film_type, is_metallic, lamination_type, offset_type) VALUES (
  'e7427ee4-3b3d-4142-984d-8e7338be1df3', 'ffdac9ce-8202-4d58-88ff-75cf13c19040', 'fabric', '6e8107e7-df3a-4b77-b87f-416725e0bcaf', 758, '{}', 163, NULL, NULL, NULL, NULL, false, NULL, NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.accounts_journal (id, journal_no, entry_date, account_name, entry_type, amount, description, created_by, updated_by, created_at, updated_at, deleted_at, account_id) VALUES (
  '79b07edb-a2ef-4029-987e-6742468ded9c', 'JE-000315', '2026-07-12', 'SV POLYTECH INDUSTRIES', 'debit', 1147814, 'Bill 73 for Dispatch DP-07-12-01', 'b3e61197-3ca4-446d-9f35-8767998fb0c2', 'b3e61197-3ca4-446d-9f35-8767998fb0c2', '2026-07-16T11:28:39.794432+00:00', '2026-07-16T11:28:39.794432+00:00', NULL, 'c96273fe-dfac-4097-85f0-a538836ada83'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.accounts_journal (id, journal_no, entry_date, account_name, entry_type, amount, description, created_by, updated_by, created_at, updated_at, deleted_at, account_id) VALUES (
  '3834b39a-a2e2-4e2f-a32c-82d98459e292', 'JE-000315', '2026-07-12', 'Sales A/c', 'credit', 1147814, 'Bill 73 for Dispatch DP-07-12-01 (SV POLYTECH INDUSTRIES)', 'b3e61197-3ca4-446d-9f35-8767998fb0c2', 'b3e61197-3ca4-446d-9f35-8767998fb0c2', '2026-07-16T11:28:39.794432+00:00', '2026-07-16T11:28:39.794432+00:00', NULL, '9712f58b-5514-4acf-a837-971c46cdefa2'
) ON CONFLICT (id) DO NOTHING;
