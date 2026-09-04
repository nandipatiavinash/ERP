-- Make is_admin() SQL function case-insensitive and support admin variations (admin, Admin, SUPERADMIN, etc.)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ 
  SELECT lower(coalesce(public.current_role_name(), '')) IN ('admin', 'administrator', 'superadmin', 'super admin', 'system admin'); 
$$;
