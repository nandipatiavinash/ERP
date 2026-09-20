-- Migration 065: Add vehicle_number to sales_orders table
ALTER TABLE sales_orders ADD COLUMN IF NOT EXISTS vehicle_number TEXT;
