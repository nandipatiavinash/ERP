# 13 Dependency Graph

## Admin

```mermaid
graph TD
  Admin["Admin"]
  Admin --> "{ revalidatePath } from 'next/cache'"
  Admin --> "{ requirePermission, getSessionPermissions } from '@/lib/auth'"
  Admin --> "{ createClient } from '@/lib/supabase/server'"
  Admin --> "{"
  Admin --> "{ revalidatePath } from 'next/cache'"
  Admin --> "{ requirePermission } from '@/lib/auth'"
  Admin --> "{ modules } from '@/lib/modules'"
  Admin --> "{ createClient } from '@/lib/supabase/server'"
  Admin --> "{"
  Admin --> "{ z } from 'zod'"
  Admin --> "{ revalidatePath } from 'next/cache'"
  Admin --> "{ requirePermission } from '@/lib/auth'"
  Admin --> "{ createAdminClient } from '@/lib/supabase/admin'"
  Admin --> "{ createClient } from '@/lib/supabase/server'"
  Admin --> "{"
  Admin --> "{ checkInAttendance, checkOutAttendance } from '@/app/(app)/_actions'"
  Admin --> "{ ConfirmSubmitButton } from '@/components/app/confirm-submit-button'"
  Admin --> "{ PageHeader } from '@/components/app/page-header'"
  Admin --> "{ StatusBadge } from '@/components/app/status-badge'"
  Admin --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Admin --> "{ EmptyState } from '@/components/ui/empty-state'"
  Admin --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Admin --> "{ getSessionPermissions, requirePermission } from '@/lib/auth'"
  Admin --> "{ createClient } from '@/lib/supabase/server'"
  Admin --> "{ formatDate, formatNumber } from '@/lib/utils'"
  Admin --> "{ useState, useTransition, useMemo } from 'react'"
  Admin --> "{ saveCatalogProduct, deleteCatalogProduct } from '@/app/(app)/_actions'"
  Admin --> "{ Button } from '@/components/ui/button'"
  Admin --> "{ Input } from '@/components/ui/input'"
  Admin --> "{ Label } from '@/components/ui/label'"
  Admin --> "{ Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'"
  Admin --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Admin --> "{ Badge } from '@/components/ui/badge'"
  Admin --> "{ Plus, Edit2, Trash2, Layers, Search, Image as ImageIcon, X } from 'lucide-react'"
  Admin --> "{ showSuccess } from '@/lib/toast'"
  Admin --> "PageSkeleton from '@/components/app/page-skeleton'"
  Admin --> "{ getSessionUser, requirePermission } from '@/lib/auth'"
  Admin --> "{ createClient } from '@/lib/supabase/server'"
  Admin --> "{ CatalogClient } from './CatalogClient'"
  Admin --> "Link from 'next/link'"
  Admin --> "{ notFound } from 'next/navigation'"
  Admin --> "{ ArrowLeft, Building2, Phone, MapPin, FileText, Hash, TrendingUp } from 'lucide-react'"
  Admin --> "{ createClient } from '@/lib/supabase/server'"
  Admin --> "{ requirePermission } from '@/lib/auth'"
  Admin --> "{ formatDate, formatNumber } from '@/lib/utils'"
  Admin --> "PageSkeleton from '@/components/app/page-skeleton'"
  Admin --> "{ MasterPage } from '@/components/app/master-page'"
  Admin --> "{ requirePermission } from '@/lib/auth'"
  Admin --> "{ modules } from '@/lib/modules'"
  Admin --> "{ fetchMasterRows } from '@/lib/master-query'"
  Admin --> "{ createClient } from '@/lib/supabase/server'"
  Admin --> "{ MasterPage } from '@/components/app/master-page'"
  Admin --> "{ requirePermission } from '@/lib/auth'"
  Admin --> "{ modules } from '@/lib/modules'"
  Admin --> "{ fetchMasterRows } from '@/lib/master-query'"
  Admin --> "{ createClient } from '@/lib/supabase/server'"
  Admin --> "{ PageHeader } from '@/components/app/page-header'"
  Admin --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Admin --> "{ EmptyState } from '@/components/ui/empty-state'"
  Admin --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Admin --> "{ UserForm } from '@/components/app/user-form'"
  Admin --> "{ UserRowActions } from '@/components/app/user-row-actions'"
  Admin --> "{ getSessionUser, requirePermission } from '@/lib/auth'"
  Admin --> "{ createClient } from '@/lib/supabase/server'"
  Admin --> "{ updateCriticalLevel } from '@/app/(app)/_actions'"
  Admin --> "{ ConfirmSubmitButton } from '@/components/app/confirm-submit-button'"
  Admin --> "{ PageHeader } from '@/components/app/page-header'"
  Admin --> "{ StatusBadge } from '@/components/app/status-badge'"
  Admin --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Admin --> "{ EmptyState } from '@/components/ui/empty-state'"
  Admin --> "{ Input } from '@/components/ui/input'"
  Admin --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Admin --> "{ requirePermission } from '@/lib/auth'"
  Admin --> "{ createClient } from '@/lib/supabase/server'"
  Admin --> "{ formatNumber } from '@/lib/utils'"
  Admin --> "{ MasterPage } from '@/components/app/master-page'"
  Admin --> "{ requirePermission } from '@/lib/auth'"
  Admin --> "{ modules } from '@/lib/modules'"
  Admin --> "{ fetchMasterRows } from '@/lib/master-query'"
  Admin --> "{ createClient } from '@/lib/supabase/server'"
  Admin --> "{ MasterPage } from '@/components/app/master-page'"
  Admin --> "{ requirePermission } from '@/lib/auth'"
  Admin --> "{ modules } from '@/lib/modules'"
  Admin --> "{ fetchMasterRows } from '@/lib/master-query'"
  Admin --> "{ createClient } from '@/lib/supabase/server'"
  Admin --> "{ requirePermission } from '@/lib/auth'"
  Admin --> "{ createClient } from '@/lib/supabase/server'"
  Admin --> "{ ArrowLeft } from 'lucide-react'"
  Admin --> "Link from 'next/link'"
  Admin --> "{ notFound } from 'next/navigation'"
  Admin --> "{ PageHeader } from '@/components/app/page-header'"
  Admin --> "{ StatusBadge } from '@/components/app/status-badge'"
  Admin --> "{ RolePermissionsEditor } from '@/components/app/role-permissions-editor'"
  Admin --> "{ CreateRoleForm } from '@/components/app/create-role-form'"
  Admin --> "{ PageHeader } from '@/components/app/page-header'"
  Admin --> "{ StatusBadge } from '@/components/app/status-badge'"
  Admin --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Admin --> "{ EmptyState } from '@/components/ui/empty-state'"
  Admin --> "{ requirePermission } from '@/lib/auth'"
  Admin --> "{ createClient } from '@/lib/supabase/server'"
  Admin --> "{ ChevronRight, Users } from 'lucide-react'"
  Admin --> "Link from 'next/link'"
  Admin --> "PageSkeleton from '@/components/app/page-skeleton'"
  Admin --> "{ useState, useTransition } from 'react'"
  Admin --> "{ useRouter } from 'next/navigation'"
  Admin --> "{ Edit, Eye, Power } from 'lucide-react'"
  Admin --> "{ saveOffsetProduct, deactivateOffsetProduct } from '@/app/(app)/_actions'"
  Admin --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Admin --> "{ Input } from '@/components/ui/input'"
  Admin --> "{ Label } from '@/components/ui/label'"
  Admin --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Admin --> "{ Badge } from '@/components/ui/badge'"
  Admin --> "{ Button } from '@/components/ui/button'"
  Admin --> "{ Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'"
  Admin --> "{ StatusBadge } from '@/components/app/status-badge'"
  Admin --> "Link from 'next/link'"
  Admin --> "{ saveRotoProduct, deactivateRotoProduct, saveOffsetProduct, deactivateOffsetProduct } fro"
  Admin --> "{ MasterPage } from '@/components/app/master-page'"
  Admin --> "{ ConfirmSubmitButton } from '@/components/app/confirm-submit-button'"
  Admin --> "{ PageHeader } from '@/components/app/page-header'"
```

### Import Evidence

- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:3): `import { revalidatePath } from "next/cache";`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:4): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:5): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/_actions/attendance.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/attendance.ts:6): `import {`
- [src/app/(app)/_actions/master.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/master.ts:3): `import { revalidatePath } from "next/cache";`
- [src/app/(app)/_actions/master.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/master.ts:4): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/_actions/master.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/master.ts:5): `import { modules } from "@/lib/modules";`
- [src/app/(app)/_actions/master.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/master.ts:6): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/_actions/master.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/master.ts:7): `import {`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:3): `import { z } from "zod";`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:4): `import { revalidatePath } from "next/cache";`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:5): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:6): `import { createAdminClient } from "@/lib/supabase/admin";`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:7): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/_actions/users-roles.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/users-roles.ts:8): `import {`
- [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:1): `import { checkInAttendance, checkOutAttendance } from "@/app/(app)/_actions";`
- [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:2): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:3): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:4): `import { StatusBadge } from "@/components/app/status-badge";`
- [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:5): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:6): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:7): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:8): `import { getSessionPermissions, requirePermission } from "@/lib/auth";`
- [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:9): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/admin/attendance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/attendance/page.tsx:10): `import { formatDate, formatNumber } from "@/lib/utils";`
- [src/app/(app)/admin/catalog/CatalogClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/catalog/CatalogClient.tsx:3): `import { useState, useTransition, useMemo } from "react";`
- [src/app/(app)/admin/catalog/CatalogClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/catalog/CatalogClient.tsx:4): `import { saveCatalogProduct, deleteCatalogProduct } from "@/app/(app)/_actions";`
- [src/app/(app)/admin/catalog/CatalogClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/catalog/CatalogClient.tsx:5): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/admin/catalog/CatalogClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/catalog/CatalogClient.tsx:6): `import { Input } from "@/components/ui/input";`
- [src/app/(app)/admin/catalog/CatalogClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/catalog/CatalogClient.tsx:7): `import { Label } from "@/components/ui/label";`
- [src/app/(app)/admin/catalog/CatalogClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/catalog/CatalogClient.tsx:8): `import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";`
- [src/app/(app)/admin/catalog/CatalogClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/catalog/CatalogClient.tsx:9): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/admin/catalog/CatalogClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/catalog/CatalogClient.tsx:10): `import { Badge } from "@/components/ui/badge";`
- [src/app/(app)/admin/catalog/CatalogClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/catalog/CatalogClient.tsx:11): `import { Plus, Edit2, Trash2, Layers, Search, Image as ImageIcon, X } from "lucide-react";`
- [src/app/(app)/admin/catalog/CatalogClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/catalog/CatalogClient.tsx:12): `import { showSuccess } from "@/lib/toast";`
- [src/app/(app)/admin/catalog/loading.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/catalog/loading.tsx:1): `import PageSkeleton from "@/components/app/page-skeleton";`
- [src/app/(app)/admin/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/catalog/page.tsx:1): `import { getSessionUser, requirePermission } from "@/lib/auth";`
- [src/app/(app)/admin/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/catalog/page.tsx:2): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/admin/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/catalog/page.tsx:3): `import { CatalogClient } from "./CatalogClient";`
- [src/app/(app)/admin/clients/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/[id]/page.tsx:1): `import Link from "next/link";`
- [src/app/(app)/admin/clients/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/[id]/page.tsx:2): `import { notFound } from "next/navigation";`
- [src/app/(app)/admin/clients/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/[id]/page.tsx:3): `import { ArrowLeft, Building2, Phone, MapPin, FileText, Hash, TrendingUp } from "lucide-react";`
- [src/app/(app)/admin/clients/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/[id]/page.tsx:4): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/admin/clients/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/[id]/page.tsx:5): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/admin/clients/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/[id]/page.tsx:6): `import { formatDate, formatNumber } from "@/lib/utils";`
- [src/app/(app)/admin/clients/loading.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/loading.tsx:1): `import PageSkeleton from "@/components/app/page-skeleton";`
- [src/app/(app)/admin/clients/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/page.tsx:1): `import { MasterPage } from "@/components/app/master-page";`
- [src/app/(app)/admin/clients/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/page.tsx:2): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/admin/clients/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/page.tsx:3): `import { modules } from "@/lib/modules";`
- [src/app/(app)/admin/clients/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/page.tsx:4): `import { fetchMasterRows } from "@/lib/master-query";`
- [src/app/(app)/admin/clients/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/clients/page.tsx:5): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/admin/colors/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/colors/page.tsx:1): `import { MasterPage } from "@/components/app/master-page";`
- [src/app/(app)/admin/colors/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/colors/page.tsx:2): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/admin/colors/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/colors/page.tsx:3): `import { modules } from "@/lib/modules";`
- [src/app/(app)/admin/colors/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/colors/page.tsx:4): `import { fetchMasterRows } from "@/lib/master-query";`
- [src/app/(app)/admin/colors/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/colors/page.tsx:5): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/admin/credentials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/credentials/page.tsx:1): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/admin/credentials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/credentials/page.tsx:2): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/admin/credentials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/credentials/page.tsx:3): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/admin/credentials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/credentials/page.tsx:4): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/admin/credentials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/credentials/page.tsx:5): `import { UserForm } from "@/components/app/user-form";`
- [src/app/(app)/admin/credentials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/credentials/page.tsx:6): `import { UserRowActions } from "@/components/app/user-row-actions";`
- [src/app/(app)/admin/credentials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/credentials/page.tsx:7): `import { getSessionUser, requirePermission } from "@/lib/auth";`
- [src/app/(app)/admin/credentials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/credentials/page.tsx:8): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:1): `import { updateCriticalLevel } from "@/app/(app)/_actions";`
- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:2): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:3): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:4): `import { StatusBadge } from "@/components/app/status-badge";`
- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:5): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:6): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:7): `import { Input } from "@/components/ui/input";`
- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:8): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:9): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:10): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/admin/critical-levels/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/critical-levels/page.tsx:11): `import { formatNumber } from "@/lib/utils";`
- [src/app/(app)/admin/employees/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/employees/page.tsx:1): `import { MasterPage } from "@/components/app/master-page";`
- [src/app/(app)/admin/employees/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/employees/page.tsx:2): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/admin/employees/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/employees/page.tsx:3): `import { modules } from "@/lib/modules";`
- [src/app/(app)/admin/employees/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/employees/page.tsx:4): `import { fetchMasterRows } from "@/lib/master-query";`
- [src/app/(app)/admin/employees/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/employees/page.tsx:5): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/admin/looms/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/looms/page.tsx:1): `import { MasterPage } from "@/components/app/master-page";`
- [src/app/(app)/admin/looms/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/looms/page.tsx:2): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/admin/looms/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/looms/page.tsx:3): `import { modules } from "@/lib/modules";`
- [src/app/(app)/admin/looms/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/looms/page.tsx:4): `import { fetchMasterRows } from "@/lib/master-query";`
- [src/app/(app)/admin/looms/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/looms/page.tsx:5): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/admin/permissions/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/[id]/page.tsx:1): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/admin/permissions/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/[id]/page.tsx:2): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/admin/permissions/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/[id]/page.tsx:3): `import { ArrowLeft } from "lucide-react";`
- [src/app/(app)/admin/permissions/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/[id]/page.tsx:4): `import Link from "next/link";`
- [src/app/(app)/admin/permissions/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/[id]/page.tsx:5): `import { notFound } from "next/navigation";`
- [src/app/(app)/admin/permissions/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/[id]/page.tsx:6): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/admin/permissions/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/[id]/page.tsx:7): `import { StatusBadge } from "@/components/app/status-badge";`
- [src/app/(app)/admin/permissions/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/[id]/page.tsx:8): `import { RolePermissionsEditor } from "@/components/app/role-permissions-editor";`
- [src/app/(app)/admin/permissions/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/page.tsx:1): `import { CreateRoleForm } from "@/components/app/create-role-form";`
- [src/app/(app)/admin/permissions/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/page.tsx:2): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/admin/permissions/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/page.tsx:3): `import { StatusBadge } from "@/components/app/status-badge";`
- [src/app/(app)/admin/permissions/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/page.tsx:4): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/admin/permissions/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/page.tsx:5): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/admin/permissions/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/page.tsx:6): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/admin/permissions/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/page.tsx:7): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/admin/permissions/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/page.tsx:8): `import { ChevronRight, Users } from "lucide-react";`
- [src/app/(app)/admin/permissions/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/permissions/page.tsx:9): `import Link from "next/link";`
- [src/app/(app)/admin/products/loading.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/loading.tsx:1): `import PageSkeleton from "@/components/app/page-skeleton";`
- [src/app/(app)/admin/products/OffsetProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/OffsetProductsClient.tsx:3): `import { useState, useTransition } from "react";`
- [src/app/(app)/admin/products/OffsetProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/OffsetProductsClient.tsx:4): `import { useRouter } from "next/navigation";`
- [src/app/(app)/admin/products/OffsetProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/OffsetProductsClient.tsx:5): `import { Edit, Eye, Power } from "lucide-react";`
- [src/app/(app)/admin/products/OffsetProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/OffsetProductsClient.tsx:6): `import { saveOffsetProduct, deactivateOffsetProduct } from "@/app/(app)/_actions";`
- [src/app/(app)/admin/products/OffsetProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/OffsetProductsClient.tsx:7): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/admin/products/OffsetProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/OffsetProductsClient.tsx:8): `import { Input } from "@/components/ui/input";`
- [src/app/(app)/admin/products/OffsetProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/OffsetProductsClient.tsx:9): `import { Label } from "@/components/ui/label";`
- [src/app/(app)/admin/products/OffsetProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/OffsetProductsClient.tsx:10): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/admin/products/OffsetProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/OffsetProductsClient.tsx:11): `import { Badge } from "@/components/ui/badge";`
- [src/app/(app)/admin/products/OffsetProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/OffsetProductsClient.tsx:12): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/admin/products/OffsetProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/OffsetProductsClient.tsx:13): `import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";`
- [src/app/(app)/admin/products/OffsetProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/OffsetProductsClient.tsx:14): `import { StatusBadge } from "@/components/app/status-badge";`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:1): `import Link from "next/link";`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:2): `import { saveRotoProduct, deactivateRotoProduct, saveOffsetProduct, deactivateOffsetProduct } from "@/app/(app)/_actions";`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:3): `import { MasterPage } from "@/components/app/master-page";`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:4): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:5): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:6): `import { StatusBadge } from "@/components/app/status-badge";`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:7): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:8): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:9): `import { Input } from "@/components/ui/input";`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:10): `import { Label } from "@/components/ui/label";`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:11): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:12): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:13): `import { fetchMasterRows } from "@/lib/master-query";`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:14): `import { modules } from "@/lib/modules";`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:15): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:16): `import { cn } from "@/lib/utils";`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:17): `import { RotoColorsPreview } from "./RotoColorsPreview";`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:18): `import { RotoProductsClient } from "./RotoProductsClient";`
- [src/app/(app)/admin/products/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/page.tsx:19): `import { OffsetProductsClient } from "./OffsetProductsClient";`
- [src/app/(app)/admin/products/RotoColorsPreview.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/RotoColorsPreview.tsx:3): `import { useState } from "react";`
- [src/app/(app)/admin/products/RotoColorsPreview.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/RotoColorsPreview.tsx:4): `import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";`
- [src/app/(app)/admin/products/RotoProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/RotoProductsClient.tsx:3): `import { useState, useTransition, useMemo } from "react";`
- [src/app/(app)/admin/products/RotoProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/RotoProductsClient.tsx:4): `import { useRouter } from "next/navigation";`
- [src/app/(app)/admin/products/RotoProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/RotoProductsClient.tsx:5): `import { Printer, Plus, Trash2, Edit, X, Eye, Power } from "lucide-react";`
- [src/app/(app)/admin/products/RotoProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/RotoProductsClient.tsx:6): `import { saveRotoProduct, deactivateRotoProduct } from "@/app/(app)/_actions";`
- [src/app/(app)/admin/products/RotoProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/RotoProductsClient.tsx:7): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/admin/products/RotoProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/RotoProductsClient.tsx:8): `import { Input } from "@/components/ui/input";`
- [src/app/(app)/admin/products/RotoProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/RotoProductsClient.tsx:9): `import { Label } from "@/components/ui/label";`
- [src/app/(app)/admin/products/RotoProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/RotoProductsClient.tsx:10): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/admin/products/RotoProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/RotoProductsClient.tsx:11): `import { Badge } from "@/components/ui/badge";`
- [src/app/(app)/admin/products/RotoProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/RotoProductsClient.tsx:12): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/admin/products/RotoProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/RotoProductsClient.tsx:13): `import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";`
- [src/app/(app)/admin/products/RotoProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/RotoProductsClient.tsx:14): `import { StatusBadge } from "@/components/app/status-badge";`
- [src/app/(app)/admin/products/RotoProductsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/products/RotoProductsClient.tsx:15): `import { RotoColorsPreview } from "./RotoColorsPreview";`
- [src/app/(app)/admin/reset/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/reset/page.tsx:1): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/admin/reset/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/reset/page.tsx:2): `import { ResetClient } from "./ResetClient";`
- [src/app/(app)/admin/reset/ResetClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/reset/ResetClient.tsx:3): `import { useState, useTransition } from "react";`
- [src/app/(app)/admin/reset/ResetClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/reset/ResetClient.tsx:4): `import { AlertTriangle, ShieldAlert, CheckCircle2, RefreshCw } from "lucide-react";`
- [src/app/(app)/admin/reset/ResetClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/reset/ResetClient.tsx:5): `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/admin/reset/ResetClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/reset/ResetClient.tsx:6): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/admin/reset/ResetClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/reset/ResetClient.tsx:7): `import { Input } from "@/components/ui/input";`
- [src/app/(app)/admin/reset/ResetClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/reset/ResetClient.tsx:8): `import { Label } from "@/components/ui/label";`
- [src/app/(app)/admin/reset/ResetClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/reset/ResetClient.tsx:9): `import { clearSystemTransactions } from "@/app/(app)/_actions";`
- [src/app/(app)/admin/reset/ResetClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/reset/ResetClient.tsx:10): `import { PageHeader } from "@/components/app/page-header";`
- [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:1): `import "server-only";`
- [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:2): `import { createClient } from "@supabase/supabase-js";`
- [src/lib/supabase/admin.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/admin.ts:3): `import type { Database } from "@/lib/database.types";`

## Accounts

```mermaid
graph TD
  Accounts["Accounts"]
  Accounts --> "{ revalidatePath } from 'next/cache'"
  Accounts --> "{ requirePermission, requireAnyPermission } from '@/lib/auth'"
  Accounts --> "{ createClient } from '@/lib/supabase/server'"
  Accounts --> "{ revalidatePath } from 'next/cache'"
  Accounts --> "{ requirePermission } from '@/lib/auth'"
  Accounts --> "{ createClient } from '@/lib/supabase/server'"
  Accounts --> "{ revalidateAllReports } from './helpers'"
  Accounts --> "PageSkeleton from '@/components/app/page-skeleton'"
  Accounts --> "{ JournalEntryForm } from '@/components/app/journal-entry-form'"
  Accounts --> "{ ConfirmSubmitButton } from '@/components/app/confirm-submit-button'"
  Accounts --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Accounts --> "{ EmptyState } from '@/components/ui/empty-state'"
  Accounts --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Accounts --> "{ PageHeader } from '@/components/app/page-header'"
  Accounts --> "{ softDeleteJournalEntryGroup } from '@/app/(app)/_actions'"
  Accounts --> "{ requirePermission, getSessionPermissions } from '@/lib/auth'"
  Accounts --> "{ createClient } from '@/lib/supabase/server'"
  Accounts --> "{ formatDate, formatNumber, todayInIndia } from '@/lib/utils'"
  Accounts --> "{ DateFilter } from '@/components/app/date-filter'"
  Accounts --> "Link from 'next/link'"
  Accounts --> "PageSkeleton from '@/components/app/page-skeleton'"
  Accounts --> "{ useState, useRef } from 'react'"
  Accounts --> "{ Trash2 } from 'lucide-react'"
  Accounts --> "{ saveMaterialSalesEntry, deleteMaterialSalesEntry } from '@/app/(app)/_actions'"
  Accounts --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Accounts --> "{ Input } from '@/components/ui/input'"
  Accounts --> "{ Label } from '@/components/ui/label'"
  Accounts --> "{ Button } from '@/components/ui/button'"
  Accounts --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Accounts --> "{ EmptyState } from '@/components/ui/empty-state'"
  Accounts --> "{ ConfirmSubmitButton } from '@/components/app/confirm-submit-button'"
  Accounts --> "{ formatNumber } from '@/lib/utils'"
  Accounts --> "{ requirePermission, getSessionPermissions } from '@/lib/auth'"
  Accounts --> "{ createClient } from '@/lib/supabase/server'"
  Accounts --> "{ todayInIndia } from '@/lib/utils'"
  Accounts --> "{ PageHeader } from '@/components/app/page-header'"
  Accounts --> "{ DateFilter } from '@/components/app/date-filter'"
  Accounts --> "{ MaterialSalesForm } from './MaterialSalesForm'"
  Accounts --> "{ useState } from 'react'"
  Accounts --> "{ Trash2, Loader2 } from 'lucide-react'"
  Accounts --> "{ deleteProductPurchase } from '@/app/(app)/_actions/product-purchase'"
  Accounts --> "PageSkeleton from '@/components/app/page-skeleton'"
  Accounts --> "{ PageHeader } from '@/components/app/page-header'"
  Accounts --> "{ EmptyState } from '@/components/ui/empty-state'"
  Accounts --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Accounts --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Accounts --> "{ requirePermission, getSessionPermissions } from '@/lib/auth'"
  Accounts --> "{ createClient } from '@/lib/supabase/server'"
  Accounts --> "{ formatDate, formatNumber, todayInIndia } from '@/lib/utils'"
  Accounts --> "{ DateFilter } from '@/components/app/date-filter'"
  Accounts --> "{ ProductPurchaseForm } from './ProductPurchaseForm'"
  Accounts --> "{ DeleteProductPurchaseButton } from './delete-button'"
  Accounts --> "{ useRef, useState, useMemo } from 'react'"
  Accounts --> "{ Plus, Trash2, PackagePlus } from 'lucide-react'"
  Accounts --> "{ saveProductPurchase } from '@/app/(app)/_actions/product-purchase'"
  Accounts --> "{ ConfirmSubmitButton } from '@/components/app/confirm-submit-button'"
  Accounts --> "{ Input } from '@/components/ui/input'"
  Accounts --> "{ Label } from '@/components/ui/label'"
  Accounts --> "{ Button } from '@/components/ui/button'"
  Accounts --> "{ formatNumber } from '@/lib/utils'"
  Accounts --> "{ useState } from 'react'"
  Accounts --> "{ Trash2, Loader2 } from 'lucide-react'"
  Accounts --> "{ deleteRawMaterialPurchase } from '@/app/(app)/_actions'"
  Accounts --> "PageSkeleton from '@/components/app/page-skeleton'"
  Accounts --> "{ PurchaseForm } from '@/components/app/purchase-form'"
  Accounts --> "{ PageHeader } from '@/components/app/page-header'"
  Accounts --> "{ EmptyState } from '@/components/ui/empty-state'"
  Accounts --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Accounts --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Accounts --> "{ requirePermission, getSessionPermissions } from '@/lib/auth'"
  Accounts --> "{ createClient } from '@/lib/supabase/server'"
  Accounts --> "{ formatDate, formatNumber, todayInIndia } from '@/lib/utils'"
  Accounts --> "{ DateFilter } from '@/components/app/date-filter'"
  Accounts --> "{ DeletePurchaseButton } from './delete-purchase-button'"
  Accounts --> "PageSkeleton from '@/components/app/page-skeleton'"
  Accounts --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Accounts --> "{ EmptyState } from '@/components/ui/empty-state'"
  Accounts --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Accounts --> "{ PageHeader } from '@/components/app/page-header'"
  Accounts --> "{ requirePermission, getSessionPermissions } from '@/lib/auth'"
  Accounts --> "{ createClient } from '@/lib/supabase/server'"
  Accounts --> "{ formatDate, formatNumber, todayInIndia } from '@/lib/utils'"
  Accounts --> "{ Badge } from '@/components/ui/badge'"
  Accounts --> "{ SalesEntryClient } from './SalesEntryClient'"
  Accounts --> "{ DateFilter } from '@/components/app/date-filter'"
  Accounts --> "{ useState, useTransition, useMemo } from 'react'"
  Accounts --> "{ Printer, FileText, ChevronDown, ChevronRight, Receipt, Package } from 'lucide-react'"
  Accounts --> "{ saveSalesOrderBillingDirect } from '@/app/(app)/_actions'"
  Accounts --> "{ showSuccess } from '@/lib/toast'"
  Accounts --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Accounts --> "{ EmptyState } from '@/components/ui/empty-state'"
  Accounts --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Accounts --> "{ Badge } from '@/components/ui/badge'"
  Accounts --> "{ Button } from '@/components/ui/button'"
  Accounts --> "{ Input } from '@/components/ui/input'"
  Accounts --> "{ Label } from '@/components/ui/label'"
  Accounts --> "{ formatDate, formatNumber, todayInIndia } from '@/lib/utils'"
  Accounts --> "{ SalesPrintView } from '@/components/app/sales-print-view'"
  Accounts --> "{ useMemo, useTransition } from 'react'"
  Accounts --> "{ useRouter } from 'next/navigation'"
  Accounts --> "{ PageHeader } from '@/components/app/page-header'"
  Accounts --> "{ DateRangeFilter } from '@/components/app/date-range-filter'"
  Accounts --> "{ Card, CardContent } from '@/components/ui/card'"
  Accounts --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Accounts --> "{ EmptyState } from '@/components/ui/empty-state'"
  Accounts --> "{ Label } from '@/components/ui/label'"
  Accounts --> "{ formatNumber, cn } from '@/lib/utils'"
  Accounts --> "PageSkeleton from '@/components/app/page-skeleton'"
  Accounts --> "{ requirePermission } from '@/lib/auth'"
  Accounts --> "{ createClient } from '@/lib/supabase/server'"
  Accounts --> "{ todayInIndia } from '@/lib/utils'"
  Accounts --> "{ AccountReportsClient } from './AccountReportsClient'"
```

### Import Evidence

- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:3): `import { revalidatePath } from "next/cache";`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:4): `import { requirePermission, requireAnyPermission } from "@/lib/auth";`
- [src/app/(app)/_actions/accounts.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/accounts.ts:5): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:3): `import { revalidatePath } from "next/cache";`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:4): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:5): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/_actions/journal.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/journal.ts:6): `import { revalidateAllReports } from "./helpers";`
- [src/app/(app)/accounts/journal/loading.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/loading.tsx:1): `import PageSkeleton from "@/components/app/page-skeleton";`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:1): `import { JournalEntryForm } from "@/components/app/journal-entry-form";`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:2): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:3): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:4): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:5): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:6): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:7): `import { softDeleteJournalEntryGroup } from "@/app/(app)/_actions";`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:8): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:9): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:10): `import { formatDate, formatNumber, todayInIndia } from "@/lib/utils";`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:11): `import { DateFilter } from "@/components/app/date-filter";`
- [src/app/(app)/accounts/journal/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/journal/page.tsx:12): `import Link from "next/link";`
- [src/app/(app)/accounts/material/loading.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/loading.tsx:1): `import PageSkeleton from "@/components/app/page-skeleton";`
- [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:3): `import { useState, useRef } from "react";`
- [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:4): `import { Trash2 } from "lucide-react";`
- [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:5): `import { saveMaterialSalesEntry, deleteMaterialSalesEntry } from "@/app/(app)/_actions";`
- [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:6): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:7): `import { Input } from "@/components/ui/input";`
- [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:8): `import { Label } from "@/components/ui/label";`
- [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:9): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:10): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:11): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:12): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/app/(app)/accounts/material/MaterialSalesForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/MaterialSalesForm.tsx:13): `import { formatNumber } from "@/lib/utils";`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:1): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:2): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:3): `import { todayInIndia } from "@/lib/utils";`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:4): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:5): `import { DateFilter } from "@/components/app/date-filter";`
- [src/app/(app)/accounts/material/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/material/page.tsx:6): `import { MaterialSalesForm } from "./MaterialSalesForm";`
- [src/app/(app)/accounts/product-purchase/delete-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/delete-button.tsx:3): `import { useState } from "react";`
- [src/app/(app)/accounts/product-purchase/delete-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/delete-button.tsx:4): `import { Trash2, Loader2 } from "lucide-react";`
- [src/app/(app)/accounts/product-purchase/delete-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/delete-button.tsx:5): `import { deleteProductPurchase } from "@/app/(app)/_actions/product-purchase";`
- [src/app/(app)/accounts/product-purchase/loading.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/loading.tsx:1): `import PageSkeleton from "@/components/app/page-skeleton";`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:1): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:2): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:3): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:4): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:5): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:6): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:7): `import { formatDate, formatNumber, todayInIndia } from "@/lib/utils";`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:8): `import { DateFilter } from "@/components/app/date-filter";`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:9): `import { ProductPurchaseForm } from "./ProductPurchaseForm";`
- [src/app/(app)/accounts/product-purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/page.tsx:10): `import { DeleteProductPurchaseButton } from "./delete-button";`
- [src/app/(app)/accounts/product-purchase/ProductPurchaseForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/ProductPurchaseForm.tsx:3): `import { useRef, useState, useMemo } from "react";`
- [src/app/(app)/accounts/product-purchase/ProductPurchaseForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/ProductPurchaseForm.tsx:4): `import { Plus, Trash2, PackagePlus } from "lucide-react";`
- [src/app/(app)/accounts/product-purchase/ProductPurchaseForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/ProductPurchaseForm.tsx:5): `import { saveProductPurchase } from "@/app/(app)/_actions/product-purchase";`
- [src/app/(app)/accounts/product-purchase/ProductPurchaseForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/ProductPurchaseForm.tsx:6): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/app/(app)/accounts/product-purchase/ProductPurchaseForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/ProductPurchaseForm.tsx:7): `import { Input } from "@/components/ui/input";`
- [src/app/(app)/accounts/product-purchase/ProductPurchaseForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/ProductPurchaseForm.tsx:8): `import { Label } from "@/components/ui/label";`
- [src/app/(app)/accounts/product-purchase/ProductPurchaseForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/ProductPurchaseForm.tsx:9): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/accounts/product-purchase/ProductPurchaseForm.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/product-purchase/ProductPurchaseForm.tsx:10): `import { formatNumber } from "@/lib/utils";`
- [src/app/(app)/accounts/purchase/delete-purchase-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/delete-purchase-button.tsx:3): `import { useState } from "react";`
- [src/app/(app)/accounts/purchase/delete-purchase-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/delete-purchase-button.tsx:4): `import { Trash2, Loader2 } from "lucide-react";`
- [src/app/(app)/accounts/purchase/delete-purchase-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/delete-purchase-button.tsx:5): `import { deleteRawMaterialPurchase } from "@/app/(app)/_actions";`
- [src/app/(app)/accounts/purchase/loading.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/loading.tsx:1): `import PageSkeleton from "@/components/app/page-skeleton";`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:1): `import { PurchaseForm } from "@/components/app/purchase-form";`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:2): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:3): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:4): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:5): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:6): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:7): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:8): `import { formatDate, formatNumber, todayInIndia } from "@/lib/utils";`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:9): `import { DateFilter } from "@/components/app/date-filter";`
- [src/app/(app)/accounts/purchase/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/purchase/page.tsx:10): `import { DeletePurchaseButton } from "./delete-purchase-button";`
- [src/app/(app)/accounts/sales/loading.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/loading.tsx:1): `import PageSkeleton from "@/components/app/page-skeleton";`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:1): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:2): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:3): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:4): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:5): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:6): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:7): `import { formatDate, formatNumber, todayInIndia } from "@/lib/utils";`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:8): `import { Badge } from "@/components/ui/badge";`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:9): `import { SalesEntryClient } from "./SalesEntryClient";`
- [src/app/(app)/accounts/sales/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/page.tsx:10): `import { DateFilter } from "@/components/app/date-filter";`
- [src/app/(app)/accounts/sales/SalesEntryClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/SalesEntryClient.tsx:3): `import { useState, useTransition, useMemo } from "react";`
- [src/app/(app)/accounts/sales/SalesEntryClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/SalesEntryClient.tsx:4): `import { Printer, FileText, ChevronDown, ChevronRight, Receipt, Package } from "lucide-react";`
- [src/app/(app)/accounts/sales/SalesEntryClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/SalesEntryClient.tsx:5): `import { saveSalesOrderBillingDirect } from "@/app/(app)/_actions";`
- [src/app/(app)/accounts/sales/SalesEntryClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/SalesEntryClient.tsx:6): `import { showSuccess } from "@/lib/toast";`
- [src/app/(app)/accounts/sales/SalesEntryClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/SalesEntryClient.tsx:7): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/accounts/sales/SalesEntryClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/SalesEntryClient.tsx:8): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/accounts/sales/SalesEntryClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/SalesEntryClient.tsx:9): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/accounts/sales/SalesEntryClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/SalesEntryClient.tsx:10): `import { Badge } from "@/components/ui/badge";`
- [src/app/(app)/accounts/sales/SalesEntryClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/SalesEntryClient.tsx:11): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/accounts/sales/SalesEntryClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/SalesEntryClient.tsx:12): `import { Input } from "@/components/ui/input";`
- [src/app/(app)/accounts/sales/SalesEntryClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/SalesEntryClient.tsx:13): `import { Label } from "@/components/ui/label";`
- [src/app/(app)/accounts/sales/SalesEntryClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/SalesEntryClient.tsx:14): `import { formatDate, formatNumber, todayInIndia } from "@/lib/utils";`
- [src/app/(app)/accounts/sales/SalesEntryClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/accounts/sales/SalesEntryClient.tsx:15): `import { SalesPrintView } from "@/components/app/sales-print-view";`
- [src/app/(app)/reports/accounts/AccountReportsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/AccountReportsClient.tsx:3): `import { useMemo, useTransition } from "react";`
- [src/app/(app)/reports/accounts/AccountReportsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/AccountReportsClient.tsx:4): `import { useRouter } from "next/navigation";`
- [src/app/(app)/reports/accounts/AccountReportsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/AccountReportsClient.tsx:5): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/reports/accounts/AccountReportsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/AccountReportsClient.tsx:6): `import { DateRangeFilter } from "@/components/app/date-range-filter";`
- [src/app/(app)/reports/accounts/AccountReportsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/AccountReportsClient.tsx:7): `import { Card, CardContent } from "@/components/ui/card";`
- [src/app/(app)/reports/accounts/AccountReportsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/AccountReportsClient.tsx:8): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/reports/accounts/AccountReportsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/AccountReportsClient.tsx:9): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/reports/accounts/AccountReportsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/AccountReportsClient.tsx:10): `import { Label } from "@/components/ui/label";`
- [src/app/(app)/reports/accounts/AccountReportsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/AccountReportsClient.tsx:11): `import { formatNumber, cn } from "@/lib/utils";`
- [src/app/(app)/reports/accounts/loading.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/loading.tsx:1): `import PageSkeleton from "@/components/app/page-skeleton";`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:1): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:2): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:3): `import { todayInIndia } from "@/lib/utils";`
- [src/app/(app)/reports/accounts/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/accounts/page.tsx:4): `import { AccountReportsClient } from "./AccountReportsClient";`

## Sales

```mermaid
graph TD
  Sales["Sales"]
  Sales --> "{ createClient } from '@/lib/supabase/server'"
  Sales --> "{ createAdminClient } from '@/lib/supabase/admin'"
  Sales --> "{ revalidatePath } from 'next/cache'"
  Sales --> "{ createClient } from '@/lib/supabase/server'"
  Sales --> "{ revalidatePath } from 'next/cache'"
  Sales --> "{ revalidatePath } from 'next/cache'"
  Sales --> "{ requirePermission, requireAnyPermission } from '@/lib/auth'"
  Sales --> "{ createClient } from '@/lib/supabase/server'"
  Sales --> "{"
  Sales --> "{ requirePermission, getSessionPermissions } from '@/lib/auth'"
  Sales --> "{ createClient } from '@/lib/supabase/server'"
  Sales --> "{ todayInIndia } from '@/lib/utils'"
  Sales --> "{ PageHeader } from '@/components/app/page-header'"
  Sales --> "{ SalesConfirmationReportClient } from './SalesConfirmationReportClient'"
  Sales --> "{ useEffect, useState, useMemo, useTransition } from 'react'"
  Sales --> "{ showSuccess } from '@/lib/toast'"
  Sales --> "{ useRouter } from 'next/navigation'"
  Sales --> "{ ChevronDown, ChevronRight, Percent, Check } from 'lucide-react'"
  Sales --> "{ Label } from '@/components/ui/label'"
  Sales --> "{ Input } from '@/components/ui/input'"
  Sales --> "{ Button } from '@/components/ui/button'"
  Sales --> "{ EmptyState } from '@/components/ui/empty-state'"
  Sales --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Sales --> "{ formatNumber, formatDate, cn } from '@/lib/utils'"
  Sales --> "{ saveSalesConfirmationRates } from '@/app/(app)/_actions'"
  Sales --> "{ DateRangeFilter } from '@/components/app/date-range-filter'"
  Sales --> "{ useTransition } from 'react'"
  Sales --> "{ approveClientOrder, cancelClientOrder } from '@/app/(app)/_actions'"
  Sales --> "{ Button } from '@/components/ui/button'"
  Sales --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Sales --> "{ Badge } from '@/components/ui/badge'"
  Sales --> "{ EmptyState } from '@/components/ui/empty-state'"
  Sales --> "{ Check, X, Clock, FileText, ShoppingBag, Layers } from 'lucide-react'"
  Sales --> "{ showSuccess } from '@/lib/toast'"
  Sales --> "{ formatDate } from '@/lib/utils'"
  Sales --> "{ PageHeader } from '@/components/app/page-header'"
  Sales --> "{ Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'"
  Sales --> "{ requirePermission } from '@/lib/auth'"
  Sales --> "{ createClient } from '@/lib/supabase/server'"
  Sales --> "{ ClientOrdersList } from './ClientOrdersList'"
  Sales --> "Link from 'next/link'"
  Sales --> "{ ArrowLeft } from 'lucide-react'"
  Sales --> "{ notFound } from 'next/navigation'"
  Sales --> "{ requirePermission, getSessionPermissions } from '@/lib/auth'"
  Sales --> "{ createClient } from '@/lib/supabase/server'"
  Sales --> "{ DeliveryEntryWorkspace } from '../DeliveryEntryWorkspace'"
  Sales --> "{ Button } from '@/components/ui/button'"
  Sales --> "{ useState, useTransition, useMemo, useEffect } from 'react'"
  Sales --> "{ useRouter } from 'next/navigation'"
  Sales --> "{ Check, Printer, ChevronRight, ChevronDown, Search, Trash2, Package, RotateCcw, ChevronLe"
  Sales --> "{ confirmMultipleSalesDeliveries, deleteSalesOrderItem } from '@/app/(app)/_actions'"
  Sales --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Sales --> "{ StatusBadge } from '@/components/app/status-badge'"
  Sales --> "{ Label } from '@/components/ui/label'"
  Sales --> "{ formatNumber, formatDate } from '@/lib/utils'"
  Sales --> "{ Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components"
  Sales --> "{ SalesPrintView } from '@/components/app/sales-print-view'"
  Sales --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Sales --> "{ Badge } from '@/components/ui/badge'"
  Sales --> "{ Button } from '@/components/ui/button'"
  Sales --> "{ DateRangeFilter } from '@/components/app/date-range-filter'"
  Sales --> "{ EmptyState } from '@/components/ui/empty-state'"
  Sales --> "{ todayInIndia } from '@/lib/utils'"
  Sales --> "{ requirePermission, getSessionPermissions } from '@/lib/auth'"
  Sales --> "{ createClient } from '@/lib/supabase/server'"
  Sales --> "{ todayInIndia } from '@/lib/utils'"
  Sales --> "{ DeliveryEntryWorkspace } from './DeliveryEntryWorkspace'"
  Sales --> "PageSkeleton from '@/components/app/page-skeleton'"
  Sales --> "{ DeliveryEntryForm } from '@/components/app/delivery-entry-form'"
  Sales --> "{ PageHeader } from '@/components/app/page-header'"
  Sales --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Sales --> "{ EmptyState } from '@/components/ui/empty-state'"
  Sales --> "{ requirePermission, getSessionPermissions } from '@/lib/auth'"
  Sales --> "{ createClient } from '@/lib/supabase/server'"
  Sales --> "{ todayInIndia } from '@/lib/utils'"
  Sales --> "{ DateFilter } from '@/components/app/date-filter'"
  Sales --> "{ RecentOrdersTable } from '@/components/app/recent-orders-table'"
  Sales --> "{ useMemo, useState } from 'react'"
  Sales --> "{ saveSale } from '@/app/(app)/_actions'"
  Sales --> "{ ConfirmSubmitButton } from '@/components/app/confirm-submit-button'"
  Sales --> "{ Input } from '@/components/ui/input'"
  Sales --> "{ Label } from '@/components/ui/label'"
  Sales --> "{ salesStatuses } from '@/lib/modules'"
  Sales --> "{ useMemo } from 'react'"
  Sales --> "{ Printer } from 'lucide-react'"
  Sales --> "{ Button } from '@/components/ui/button'"
  Sales --> "{ formatNumber, formatDate } from '@/lib/utils'"
```

### Import Evidence

- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:3): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:4): `import { createAdminClient } from "@/lib/supabase/admin";`
- [src/app/(app)/_actions/client-orders.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-orders.ts:5): `import { revalidatePath } from "next/cache";`
- [src/app/(app)/_actions/client-sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-sales.ts:3): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/_actions/client-sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/client-sales.ts:4): `import { revalidatePath } from "next/cache";`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:3): `import { revalidatePath } from "next/cache";`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:4): `import { requirePermission, requireAnyPermission } from "@/lib/auth";`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:5): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/_actions/sales.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/sales.ts:6): `import {`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:1): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:2): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:3): `import { todayInIndia } from "@/lib/utils";`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:4): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/reports/sales-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/page.tsx:5): `import { SalesConfirmationReportClient } from "./SalesConfirmationReportClient";`
- [src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx:3): `import { useEffect, useState, useMemo, useTransition } from "react";`
- [src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx:4): `import { showSuccess } from "@/lib/toast";`
- [src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx:5): `import { useRouter } from "next/navigation";`
- [src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx:6): `import { ChevronDown, ChevronRight, Percent, Check } from "lucide-react";`
- [src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx:7): `import { Label } from "@/components/ui/label";`
- [src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx:8): `import { Input } from "@/components/ui/input";`
- [src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx:9): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx:10): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx:11): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx:12): `import { formatNumber, formatDate, cn } from "@/lib/utils";`
- [src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx:13): `import { saveSalesConfirmationRates } from "@/app/(app)/_actions";`
- [src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/sales-confirmation/SalesConfirmationReportClient.tsx:14): `import { DateRangeFilter } from "@/components/app/date-range-filter";`
- [src/app/(app)/sales/client-orders/ClientOrdersList.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/ClientOrdersList.tsx:3): `import { useTransition } from "react";`
- [src/app/(app)/sales/client-orders/ClientOrdersList.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/ClientOrdersList.tsx:4): `import { approveClientOrder, cancelClientOrder } from "@/app/(app)/_actions";`
- [src/app/(app)/sales/client-orders/ClientOrdersList.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/ClientOrdersList.tsx:5): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/sales/client-orders/ClientOrdersList.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/ClientOrdersList.tsx:6): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/sales/client-orders/ClientOrdersList.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/ClientOrdersList.tsx:7): `import { Badge } from "@/components/ui/badge";`
- [src/app/(app)/sales/client-orders/ClientOrdersList.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/ClientOrdersList.tsx:8): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/sales/client-orders/ClientOrdersList.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/ClientOrdersList.tsx:9): `import { Check, X, Clock, FileText, ShoppingBag, Layers } from "lucide-react";`
- [src/app/(app)/sales/client-orders/ClientOrdersList.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/ClientOrdersList.tsx:10): `import { showSuccess } from "@/lib/toast";`
- [src/app/(app)/sales/client-orders/ClientOrdersList.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/ClientOrdersList.tsx:11): `import { formatDate } from "@/lib/utils";`
- [src/app/(app)/sales/client-orders/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/page.tsx:1): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/sales/client-orders/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/page.tsx:2): `import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";`
- [src/app/(app)/sales/client-orders/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/page.tsx:3): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/sales/client-orders/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/page.tsx:4): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/sales/client-orders/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/client-orders/page.tsx:5): `import { ClientOrdersList } from "./ClientOrdersList";`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:1): `import Link from "next/link";`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:2): `import { ArrowLeft } from "lucide-react";`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:3): `import { notFound } from "next/navigation";`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:4): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:5): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:6): `import { DeliveryEntryWorkspace } from "../DeliveryEntryWorkspace";`
- [src/app/(app)/sales/delivery-entry/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/[id]/page.tsx:7): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:3): `import { useState, useTransition, useMemo, useEffect } from "react";`
- [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:4): `import { useRouter } from "next/navigation";`
- [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:5): `import { Check, Printer, ChevronRight, ChevronDown, Search, Trash2, Package, RotateCcw, ChevronLeft } from "lucide-react";`
- [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:6): `import { confirmMultipleSalesDeliveries, deleteSalesOrderItem } from "@/app/(app)/_actions";`
- [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:7): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:8): `import { StatusBadge } from "@/components/app/status-badge";`
- [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:9): `import { Label } from "@/components/ui/label";`
- [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:10): `import { formatNumber, formatDate } from "@/lib/utils";`
- [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:11): `import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";`
- [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:12): `import { SalesPrintView } from "@/components/app/sales-print-view";`
- [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:13): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:14): `import { Badge } from "@/components/ui/badge";`
- [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:15): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:16): `import { DateRangeFilter } from "@/components/app/date-range-filter";`
- [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:17): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/DeliveryEntryWorkspace.tsx:18): `import { todayInIndia } from "@/lib/utils";`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:1): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:2): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:3): `import { todayInIndia } from "@/lib/utils";`
- [src/app/(app)/sales/delivery-entry/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/delivery-entry/page.tsx:4): `import { DeliveryEntryWorkspace } from "./DeliveryEntryWorkspace";`
- [src/app/(app)/sales/loading.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/loading.tsx:1): `import PageSkeleton from "@/components/app/page-skeleton";`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:1): `import { DeliveryEntryForm } from "@/components/app/delivery-entry-form";`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:2): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:3): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:4): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:5): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:6): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:7): `import { todayInIndia } from "@/lib/utils";`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:8): `import { DateFilter } from "@/components/app/date-filter";`
- [src/app/(app)/sales/order-confirmation/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/sales/order-confirmation/page.tsx:9): `import { RecentOrdersTable } from "@/components/app/recent-orders-table";`
- [src/components/app/sales-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/sales-form.tsx:3): `import { useMemo, useState } from "react";`
- [src/components/app/sales-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/sales-form.tsx:4): `import { saveSale } from "@/app/(app)/_actions";`
- [src/components/app/sales-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/sales-form.tsx:5): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/components/app/sales-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/sales-form.tsx:6): `import { Input } from "@/components/ui/input";`
- [src/components/app/sales-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/sales-form.tsx:7): `import { Label } from "@/components/ui/label";`
- [src/components/app/sales-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/sales-form.tsx:8): `import { salesStatuses } from "@/lib/modules";`
- [src/components/app/sales-print-view.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/sales-print-view.tsx:3): `import { useMemo } from "react";`
- [src/components/app/sales-print-view.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/sales-print-view.tsx:4): `import { Printer } from "lucide-react";`
- [src/components/app/sales-print-view.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/sales-print-view.tsx:5): `import { Button } from "@/components/ui/button";`
- [src/components/app/sales-print-view.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/sales-print-view.tsx:6): `import { formatNumber, formatDate } from "@/lib/utils";`

## Inventory

```mermaid
graph TD
  Inventory["Inventory"]
  Inventory --> "{ revalidatePath } from 'next/cache'"
  Inventory --> "{ requirePermission } from '@/lib/auth'"
  Inventory --> "{ createAdminClient } from '@/lib/supabase/admin'"
  Inventory --> "{ generateNextJournalNo } from './helpers'"
  Inventory --> "{ revalidatePath } from 'next/cache'"
  Inventory --> "{ requirePermission } from '@/lib/auth'"
  Inventory --> "{ createClient } from '@/lib/supabase/server'"
  Inventory --> "{"
  Inventory --> "{ MasterPage } from '@/components/app/master-page'"
  Inventory --> "{ requirePermission } from '@/lib/auth'"
  Inventory --> "{ modules } from '@/lib/modules'"
  Inventory --> "{ fetchMasterRows } from '@/lib/master-query'"
  Inventory --> "{ createClient } from '@/lib/supabase/server'"
  Inventory --> "Link from 'next/link'"
  Inventory --> "{ ArrowLeft } from 'lucide-react'"
  Inventory --> "{ PageHeader } from '@/components/app/page-header'"
  Inventory --> "{ requirePermission } from '@/lib/auth'"
  Inventory --> "{ createClient } from '@/lib/supabase/server'"
  Inventory --> "{ Button } from '@/components/ui/button'"
  Inventory --> "{ StockRollsClient } from './StockRollsClient'"
  Inventory --> "{ useState, useMemo } from 'react'"
  Inventory --> "{ ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'"
  Inventory --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Inventory --> "{ EmptyState } from '@/components/ui/empty-state'"
  Inventory --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Inventory --> "{ StatusBadge } from '@/components/app/status-badge'"
  Inventory --> "{ formatDate, formatNumber } from '@/lib/utils'"
  Inventory --> "{ useState, useTransition, useEffect, useMemo } from 'react'"
  Inventory --> "{ useRouter } from 'next/navigation'"
  Inventory --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Inventory --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Inventory --> "{ formatNumber } from '@/lib/utils'"
  Inventory --> "Link from 'next/link'"
  Inventory --> "{ cn } from '@/lib/utils'"
  Inventory --> "{ Loader2 } from 'lucide-react'"
  Inventory --> "PageSkeleton from '@/components/app/page-skeleton'"
  Inventory --> "{ requirePermission } from '@/lib/auth'"
  Inventory --> "{ createClient } from '@/lib/supabase/server'"
  Inventory --> "{ PageHeader } from '@/components/app/page-header'"
  Inventory --> "{ FabricStockClient } from './FabricStockClient'"
  Inventory --> "Link from 'next/link'"
  Inventory --> "{ ArrowLeft } from 'lucide-react'"
  Inventory --> "{ PageHeader } from '@/components/app/page-header'"
  Inventory --> "{ requirePermission } from '@/lib/auth'"
  Inventory --> "{ createClient } from '@/lib/supabase/server'"
  Inventory --> "{ Button } from '@/components/ui/button'"
  Inventory --> "{ StockFinishingBundlesClient } from './StockFinishingBundlesClient'"
  Inventory --> "{ useState, useMemo } from 'react'"
  Inventory --> "{ ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'"
  Inventory --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Inventory --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Inventory --> "{ EmptyState } from '@/components/ui/empty-state'"
  Inventory --> "{ StatusBadge } from '@/components/app/status-badge'"
  Inventory --> "{ Input } from '@/components/ui/input'"
  Inventory --> "{ formatDate, formatNumber } from '@/lib/utils'"
  Inventory --> "PageSkeleton from '@/components/app/page-skeleton'"
  Inventory --> "Link from 'next/link'"
  Inventory --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Inventory --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Inventory --> "{ PageHeader } from '@/components/app/page-header'"
  Inventory --> "{ requirePermission } from '@/lib/auth'"
  Inventory --> "{ createClient } from '@/lib/supabase/server'"
  Inventory --> "{ formatNumber } from '@/lib/utils'"
  Inventory --> "Link from 'next/link'"
  Inventory --> "{ ArrowLeft } from 'lucide-react'"
  Inventory --> "{ PageHeader } from '@/components/app/page-header'"
  Inventory --> "{ requirePermission } from '@/lib/auth'"
  Inventory --> "{ createClient } from '@/lib/supabase/server'"
  Inventory --> "{ Button } from '@/components/ui/button'"
  Inventory --> "{ StockLaminationRollsClient } from './StockLaminationRollsClient'"
  Inventory --> "{ useState, useMemo } from 'react'"
  Inventory --> "{ ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'"
  Inventory --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Inventory --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Inventory --> "{ EmptyState } from '@/components/ui/empty-state'"
  Inventory --> "{ StatusBadge } from '@/components/app/status-badge'"
  Inventory --> "{ Input } from '@/components/ui/input'"
  Inventory --> "{ formatDate, formatNumber } from '@/lib/utils'"
  Inventory --> "PageSkeleton from '@/components/app/page-skeleton'"
  Inventory --> "Link from 'next/link'"
  Inventory --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Inventory --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Inventory --> "{ PageHeader } from '@/components/app/page-header'"
  Inventory --> "{ requirePermission } from '@/lib/auth'"
  Inventory --> "{ createClient } from '@/lib/supabase/server'"
  Inventory --> "{ formatNumber } from '@/lib/utils'"
  Inventory --> "Link from 'next/link'"
  Inventory --> "{ ArrowLeft } from 'lucide-react'"
  Inventory --> "{ PageHeader } from '@/components/app/page-header'"
  Inventory --> "{ requirePermission } from '@/lib/auth'"
  Inventory --> "{ createClient } from '@/lib/supabase/server'"
  Inventory --> "{ Button } from '@/components/ui/button'"
  Inventory --> "{ StockOffsetRollsClient } from './StockOffsetRollsClient'"
  Inventory --> "{ useState, useMemo } from 'react'"
  Inventory --> "{ ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'"
  Inventory --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Inventory --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Inventory --> "{ EmptyState } from '@/components/ui/empty-state'"
  Inventory --> "{ StatusBadge } from '@/components/app/status-badge'"
  Inventory --> "{ Input } from '@/components/ui/input'"
  Inventory --> "{ formatDate, formatNumber } from '@/lib/utils'"
  Inventory --> "PageSkeleton from '@/components/app/page-skeleton'"
  Inventory --> "Link from 'next/link'"
  Inventory --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Inventory --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Inventory --> "{ PageHeader } from '@/components/app/page-header'"
  Inventory --> "{ requirePermission } from '@/lib/auth'"
  Inventory --> "{ createClient } from '@/lib/supabase/server'"
  Inventory --> "{ formatNumber } from '@/lib/utils'"
  Inventory --> "{ requirePermission } from '@/lib/auth'"
  Inventory --> "{ createClient } from '@/lib/supabase/server'"
  Inventory --> "{ todayInIndia, fetchPagedData } from '@/lib/utils'"
  Inventory --> "{ StockReportClient } from './StockReportClient'"
  Inventory --> "{ useState, useMemo } from 'react'"
  Inventory --> "{ ChevronDown, ChevronRight } from 'lucide-react'"
  Inventory --> "{ PageHeader } from '@/components/app/page-header'"
  Inventory --> "{ DateRangeFilter } from '@/components/app/date-range-filter'"
  Inventory --> "{ Card, CardContent } from '@/components/ui/card'"
  Inventory --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Inventory --> "{ EmptyState } from '@/components/ui/empty-state'"
```

### Import Evidence

- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:3): `import { revalidatePath } from "next/cache";`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:4): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:5): `import { createAdminClient } from "@/lib/supabase/admin";`
- [src/app/(app)/_actions/product-purchase.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/product-purchase.ts:6): `import { generateNextJournalNo } from "./helpers";`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:3): `import { revalidatePath } from "next/cache";`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:4): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:5): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/_actions/raw-materials.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/raw-materials.ts:6): `import {`
- [src/app/(app)/admin/raw-materials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/raw-materials/page.tsx:1): `import { MasterPage } from "@/components/app/master-page";`
- [src/app/(app)/admin/raw-materials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/raw-materials/page.tsx:2): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/admin/raw-materials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/raw-materials/page.tsx:3): `import { modules } from "@/lib/modules";`
- [src/app/(app)/admin/raw-materials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/raw-materials/page.tsx:4): `import { fetchMasterRows } from "@/lib/master-query";`
- [src/app/(app)/admin/raw-materials/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/admin/raw-materials/page.tsx:5): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:1): `import Link from "next/link";`
- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:2): `import { ArrowLeft } from "lucide-react";`
- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:3): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:4): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:5): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:6): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/fabric/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/page.tsx:7): `import { StockRollsClient } from "./StockRollsClient";`
- [src/app/(app)/fabric/stock/[id]/StockRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/StockRollsClient.tsx:3): `import { useState, useMemo } from "react";`
- [src/app/(app)/fabric/stock/[id]/StockRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/StockRollsClient.tsx:4): `import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";`
- [src/app/(app)/fabric/stock/[id]/StockRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/StockRollsClient.tsx:5): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/fabric/stock/[id]/StockRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/StockRollsClient.tsx:6): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/fabric/stock/[id]/StockRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/StockRollsClient.tsx:7): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/fabric/stock/[id]/StockRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/StockRollsClient.tsx:8): `import { StatusBadge } from "@/components/app/status-badge";`
- [src/app/(app)/fabric/stock/[id]/StockRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/[id]/StockRollsClient.tsx:9): `import { formatDate, formatNumber } from "@/lib/utils";`
- [src/app/(app)/fabric/stock/FabricStockClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/FabricStockClient.tsx:3): `import { useState, useTransition, useEffect, useMemo } from "react";`
- [src/app/(app)/fabric/stock/FabricStockClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/FabricStockClient.tsx:4): `import { useRouter } from "next/navigation";`
- [src/app/(app)/fabric/stock/FabricStockClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/FabricStockClient.tsx:5): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/fabric/stock/FabricStockClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/FabricStockClient.tsx:6): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/fabric/stock/FabricStockClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/FabricStockClient.tsx:7): `import { formatNumber } from "@/lib/utils";`
- [src/app/(app)/fabric/stock/FabricStockClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/FabricStockClient.tsx:8): `import Link from "next/link";`
- [src/app/(app)/fabric/stock/FabricStockClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/FabricStockClient.tsx:9): `import { cn } from "@/lib/utils";`
- [src/app/(app)/fabric/stock/FabricStockClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/FabricStockClient.tsx:10): `import { Loader2 } from "lucide-react";`
- [src/app/(app)/fabric/stock/loading.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/loading.tsx:1): `import PageSkeleton from "@/components/app/page-skeleton";`
- [src/app/(app)/fabric/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/page.tsx:1): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/fabric/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/page.tsx:2): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/fabric/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/page.tsx:3): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/fabric/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/stock/page.tsx:4): `import { FabricStockClient } from "./FabricStockClient";`
- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:1): `import Link from "next/link";`
- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:2): `import { ArrowLeft } from "lucide-react";`
- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:3): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:4): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:5): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:6): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/finishing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/page.tsx:7): `import { StockFinishingBundlesClient } from "./StockFinishingBundlesClient";`
- [src/app/(app)/finishing/stock/[id]/StockFinishingBundlesClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/StockFinishingBundlesClient.tsx:3): `import { useState, useMemo } from "react";`
- [src/app/(app)/finishing/stock/[id]/StockFinishingBundlesClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/StockFinishingBundlesClient.tsx:4): `import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";`
- [src/app/(app)/finishing/stock/[id]/StockFinishingBundlesClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/StockFinishingBundlesClient.tsx:5): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/finishing/stock/[id]/StockFinishingBundlesClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/StockFinishingBundlesClient.tsx:6): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/finishing/stock/[id]/StockFinishingBundlesClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/StockFinishingBundlesClient.tsx:7): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/finishing/stock/[id]/StockFinishingBundlesClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/StockFinishingBundlesClient.tsx:8): `import { StatusBadge } from "@/components/app/status-badge";`
- [src/app/(app)/finishing/stock/[id]/StockFinishingBundlesClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/StockFinishingBundlesClient.tsx:9): `import { Input } from "@/components/ui/input";`
- [src/app/(app)/finishing/stock/[id]/StockFinishingBundlesClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/[id]/StockFinishingBundlesClient.tsx:10): `import { formatDate, formatNumber } from "@/lib/utils";`
- [src/app/(app)/finishing/stock/loading.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/loading.tsx:1): `import PageSkeleton from "@/components/app/page-skeleton";`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:1): `import Link from "next/link";`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:2): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:3): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:4): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:5): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:6): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/finishing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/stock/page.tsx:7): `import { formatNumber } from "@/lib/utils";`
- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:1): `import Link from "next/link";`
- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:2): `import { ArrowLeft } from "lucide-react";`
- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:3): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:4): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:5): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:6): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/lamination/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/page.tsx:7): `import { StockLaminationRollsClient } from "./StockLaminationRollsClient";`
- [src/app/(app)/lamination/stock/[id]/StockLaminationRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/StockLaminationRollsClient.tsx:3): `import { useState, useMemo } from "react";`
- [src/app/(app)/lamination/stock/[id]/StockLaminationRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/StockLaminationRollsClient.tsx:4): `import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";`
- [src/app/(app)/lamination/stock/[id]/StockLaminationRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/StockLaminationRollsClient.tsx:5): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/lamination/stock/[id]/StockLaminationRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/StockLaminationRollsClient.tsx:6): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/lamination/stock/[id]/StockLaminationRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/StockLaminationRollsClient.tsx:7): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/lamination/stock/[id]/StockLaminationRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/StockLaminationRollsClient.tsx:8): `import { StatusBadge } from "@/components/app/status-badge";`
- [src/app/(app)/lamination/stock/[id]/StockLaminationRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/StockLaminationRollsClient.tsx:9): `import { Input } from "@/components/ui/input";`
- [src/app/(app)/lamination/stock/[id]/StockLaminationRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/[id]/StockLaminationRollsClient.tsx:10): `import { formatDate, formatNumber } from "@/lib/utils";`
- [src/app/(app)/lamination/stock/loading.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/loading.tsx:1): `import PageSkeleton from "@/components/app/page-skeleton";`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:1): `import Link from "next/link";`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:2): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:3): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:4): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:5): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:6): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/lamination/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/stock/page.tsx:7): `import { formatNumber } from "@/lib/utils";`
- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:1): `import Link from "next/link";`
- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:2): `import { ArrowLeft } from "lucide-react";`
- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:3): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:4): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:5): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:6): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/offset-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/page.tsx:7): `import { StockOffsetRollsClient } from "./StockOffsetRollsClient";`
- [src/app/(app)/offset-printing/stock/[id]/StockOffsetRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/StockOffsetRollsClient.tsx:3): `import { useState, useMemo } from "react";`
- [src/app/(app)/offset-printing/stock/[id]/StockOffsetRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/StockOffsetRollsClient.tsx:4): `import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";`
- [src/app/(app)/offset-printing/stock/[id]/StockOffsetRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/StockOffsetRollsClient.tsx:5): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/offset-printing/stock/[id]/StockOffsetRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/StockOffsetRollsClient.tsx:6): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/offset-printing/stock/[id]/StockOffsetRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/StockOffsetRollsClient.tsx:7): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/offset-printing/stock/[id]/StockOffsetRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/StockOffsetRollsClient.tsx:8): `import { StatusBadge } from "@/components/app/status-badge";`
- [src/app/(app)/offset-printing/stock/[id]/StockOffsetRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/StockOffsetRollsClient.tsx:9): `import { Input } from "@/components/ui/input";`
- [src/app/(app)/offset-printing/stock/[id]/StockOffsetRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/[id]/StockOffsetRollsClient.tsx:10): `import { formatDate, formatNumber } from "@/lib/utils";`
- [src/app/(app)/offset-printing/stock/loading.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/loading.tsx:1): `import PageSkeleton from "@/components/app/page-skeleton";`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:1): `import Link from "next/link";`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:2): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:3): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:4): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:5): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:6): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/offset-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/stock/page.tsx:7): `import { formatNumber } from "@/lib/utils";`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:1): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:2): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:3): `import { todayInIndia, fetchPagedData } from "@/lib/utils";`
- [src/app/(app)/reports/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/page.tsx:4): `import { StockReportClient } from "./StockReportClient";`
- [src/app/(app)/reports/stock/StockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/StockReportClient.tsx:3): `import { useState, useMemo } from "react";`
- [src/app/(app)/reports/stock/StockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/StockReportClient.tsx:4): `import { ChevronDown, ChevronRight } from "lucide-react";`
- [src/app/(app)/reports/stock/StockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/StockReportClient.tsx:5): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/reports/stock/StockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/StockReportClient.tsx:6): `import { DateRangeFilter } from "@/components/app/date-range-filter";`
- [src/app/(app)/reports/stock/StockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/StockReportClient.tsx:7): `import { Card, CardContent } from "@/components/ui/card";`
- [src/app/(app)/reports/stock/StockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/StockReportClient.tsx:8): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/reports/stock/StockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/StockReportClient.tsx:9): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/reports/stock/StockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/stock/StockReportClient.tsx:10): `import { formatNumber, todayInIndia, formatDate } from "@/lib/utils";`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:1): `import Link from "next/link";`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:2): `import { ArrowLeft } from "lucide-react";`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:3): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:4): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:5): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:6): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/roto-printing/stock/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/page.tsx:7): `import { StockRotoRollsClient } from "./StockRotoRollsClient";`
- [src/app/(app)/roto-printing/stock/[id]/StockRotoRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/StockRotoRollsClient.tsx:3): `import { useState, useMemo } from "react";`
- [src/app/(app)/roto-printing/stock/[id]/StockRotoRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/StockRotoRollsClient.tsx:4): `import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";`
- [src/app/(app)/roto-printing/stock/[id]/StockRotoRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/StockRotoRollsClient.tsx:5): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/roto-printing/stock/[id]/StockRotoRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/StockRotoRollsClient.tsx:6): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/roto-printing/stock/[id]/StockRotoRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/StockRotoRollsClient.tsx:7): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/roto-printing/stock/[id]/StockRotoRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/StockRotoRollsClient.tsx:8): `import { StatusBadge } from "@/components/app/status-badge";`
- [src/app/(app)/roto-printing/stock/[id]/StockRotoRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/StockRotoRollsClient.tsx:9): `import { Input } from "@/components/ui/input";`
- [src/app/(app)/roto-printing/stock/[id]/StockRotoRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/StockRotoRollsClient.tsx:10): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/roto-printing/stock/[id]/StockRotoRollsClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/[id]/StockRotoRollsClient.tsx:11): `import { formatDate, formatNumber } from "@/lib/utils";`
- [src/app/(app)/roto-printing/stock/loading.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/loading.tsx:1): `import PageSkeleton from "@/components/app/page-skeleton";`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:1): `import Link from "next/link";`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:2): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:3): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:4): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:5): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:6): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/roto-printing/stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/stock/page.tsx:7): `import { formatNumber } from "@/lib/utils";`

## Production

```mermaid
graph TD
  Production["Production"]
  Production --> "com.getcapacitor.BridgeActivity"
  Production --> "{ revalidatePath } from 'next/cache'"
  Production --> "{ requirePermission, getSessionPermissions } from '@/lib/auth'"
  Production --> "{ createAdminClient } from '@/lib/supabase/admin'"
  Production --> "{ createClient } from '@/lib/supabase/server'"
  Production --> "{"
  Production --> "{ ConsumptionForm } from '@/components/app/consumption-form'"
  Production --> "{ ConfirmSubmitButton } from '@/components/app/confirm-submit-button'"
  Production --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Production --> "{ EmptyState } from '@/components/ui/empty-state'"
  Production --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Production --> "{ PageHeader } from '@/components/app/page-header'"
  Production --> "{ DateFilter } from '@/components/app/date-filter'"
  Production --> "{ softDeleteRawMaterialConsumption } from '@/app/(app)/_actions'"
  Production --> "{ requirePermission, getSessionPermissions } from '@/lib/auth'"
  Production --> "{ createClient } from '@/lib/supabase/server'"
  Production --> "{ formatDate, formatNumber, todayInIndia } from '@/lib/utils'"
  Production --> "PageSkeleton from '@/components/app/page-skeleton'"
  Production --> "{ ConfirmSubmitButton } from '@/components/app/confirm-submit-button'"
  Production --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Production --> "{ EmptyState } from '@/components/ui/empty-state'"
  Production --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Production --> "{ PageHeader } from '@/components/app/page-header'"
  Production --> "{ ProductionForm } from '@/components/app/production-form'"
  Production --> "{ StatusBadge } from '@/components/app/status-badge'"
  Production --> "{ softDeleteProduction } from '@/app/(app)/_actions'"
  Production --> "{ isAdmin, requirePermission, getSessionPermissions } from '@/lib/auth'"
  Production --> "{ createClient } from '@/lib/supabase/server'"
  Production --> "{ formatDate, formatNumber } from '@/lib/utils'"
  Production --> "{ useState, useMemo } from 'react'"
  Production --> "{ showSuccess } from '@/lib/toast'"
  Production --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Production --> "{ EmptyState } from '@/components/ui/empty-state'"
  Production --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Production --> "{ ConfirmSubmitButton } from '@/components/app/confirm-submit-button'"
  Production --> "{ ConsumptionForm } from '@/components/app/consumption-form'"
  Production --> "{ Label } from '@/components/ui/label'"
  Production --> "{ Button } from '@/components/ui/button'"
  Production --> "{ formatDate, formatNumber } from '@/lib/utils'"
  Production --> "{"
  Production --> "{ Beaker, Layers, Film, Package } from 'lucide-react'"
  Production --> "{ PageHeader } from '@/components/app/page-header'"
  Production --> "{ DateFilter } from '@/components/app/date-filter'"
  Production --> "{ requirePermission, getSessionPermissions } from '@/lib/auth'"
  Production --> "{ createClient } from '@/lib/supabase/server'"
  Production --> "{ todayInIndia } from '@/lib/utils'"
  Production --> "{ FinishingConsumptionClient } from './FinishingConsumptionClient'"
  Production --> "PageSkeleton from '@/components/app/page-skeleton'"
  Production --> "{ requirePermission } from '@/lib/auth'"
  Production --> "{ createClient } from '@/lib/supabase/server'"
  Production --> "{ PageHeader } from '@/components/app/page-header'"
  Production --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Production --> "{ EmptyState } from '@/components/ui/empty-state'"
  Production --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Production --> "{ FinishingProductionForm } from '@/components/app/finishing-production-form'"
  Production --> "{ deleteFinishingBundle } from '@/app/(app)/_actions'"
  Production --> "{ ConfirmSubmitButton } from '@/components/app/confirm-submit-button'"
  Production --> "{ useState, useMemo } from 'react'"
  Production --> "{ showSuccess } from '@/lib/toast'"
  Production --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Production --> "{ EmptyState } from '@/components/ui/empty-state'"
  Production --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Production --> "{ ConfirmSubmitButton } from '@/components/app/confirm-submit-button'"
  Production --> "{ ConsumptionForm } from '@/components/app/consumption-form'"
  Production --> "{ Label } from '@/components/ui/label'"
  Production --> "{ Button } from '@/components/ui/button'"
  Production --> "{ formatDate, formatNumber } from '@/lib/utils'"
  Production --> "{"
  Production --> "{ Beaker, Layers, Film } from 'lucide-react'"
  Production --> "{ PageHeader } from '@/components/app/page-header'"
  Production --> "{ DateFilter } from '@/components/app/date-filter'"
  Production --> "{ requirePermission, getSessionPermissions } from '@/lib/auth'"
  Production --> "{ createClient } from '@/lib/supabase/server'"
  Production --> "{ todayInIndia } from '@/lib/utils'"
  Production --> "{ LaminationConsumptionClient } from './LaminationConsumptionClient'"
  Production --> "PageSkeleton from '@/components/app/page-skeleton'"
  Production --> "{ requirePermission } from '@/lib/auth'"
  Production --> "{ createClient } from '@/lib/supabase/server'"
  Production --> "{ PageHeader } from '@/components/app/page-header'"
  Production --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Production --> "{ EmptyState } from '@/components/ui/empty-state'"
  Production --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Production --> "{ LaminationProductionForm } from '@/components/app/lamination-production-form'"
  Production --> "{ deleteLaminationProduction } from '@/app/(app)/_actions'"
  Production --> "{ ConfirmSubmitButton } from '@/components/app/confirm-submit-button'"
  Production --> "{ formatDate } from '@/lib/utils'"
  Production --> "{ useState, useMemo } from 'react'"
  Production --> "{ showSuccess } from '@/lib/toast'"
  Production --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Production --> "{ EmptyState } from '@/components/ui/empty-state'"
  Production --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Production --> "{ ConfirmSubmitButton } from '@/components/app/confirm-submit-button'"
  Production --> "{ ConsumptionForm } from '@/components/app/consumption-form'"
  Production --> "{ Label } from '@/components/ui/label'"
  Production --> "{ Button } from '@/components/ui/button'"
  Production --> "{ formatDate, formatNumber } from '@/lib/utils'"
  Production --> "{"
  Production --> "{ Beaker, Layers, Film } from 'lucide-react'"
  Production --> "{ PageHeader } from '@/components/app/page-header'"
  Production --> "{ DateFilter } from '@/components/app/date-filter'"
  Production --> "{ requirePermission, getSessionPermissions } from '@/lib/auth'"
  Production --> "{ createClient } from '@/lib/supabase/server'"
  Production --> "{ todayInIndia } from '@/lib/utils'"
  Production --> "{ OffsetConsumptionClient } from './OffsetConsumptionClient'"
  Production --> "PageSkeleton from '@/components/app/page-skeleton'"
  Production --> "{ requirePermission } from '@/lib/auth'"
  Production --> "{ createClient } from '@/lib/supabase/server'"
  Production --> "{ PageHeader } from '@/components/app/page-header'"
  Production --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Production --> "{ EmptyState } from '@/components/ui/empty-state'"
  Production --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Production --> "{ OffsetProductionForm } from '@/components/app/offset-production-form'"
  Production --> "{ deleteOffsetProduction } from '@/app/(app)/_actions'"
  Production --> "{ ConfirmSubmitButton } from '@/components/app/confirm-submit-button'"
  Production --> "{ formatDate } from '@/lib/utils'"
  Production --> "{ ConsumptionForm } from '@/components/app/consumption-form'"
  Production --> "{ ConfirmSubmitButton } from '@/components/app/confirm-submit-button'"
  Production --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Production --> "{ EmptyState } from '@/components/ui/empty-state'"
  Production --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
```

### Import Evidence

- [android/app/src/main/java/com/rkglobal/fabricerp/MainActivity.java](C:/Users/spsch/Downloads/ERP-main/ERP-main/android/app/src/main/java/com/rkglobal/fabricerp/MainActivity.java:3): `import com.getcapacitor.BridgeActivity;`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:3): `import { revalidatePath } from "next/cache";`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:4): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:5): `import { createAdminClient } from "@/lib/supabase/admin";`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:6): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/_actions/production.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/production.ts:7): `import {`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:1): `import { ConsumptionForm } from "@/components/app/consumption-form";`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:2): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:3): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:4): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:5): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:6): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:7): `import { DateFilter } from "@/components/app/date-filter";`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:8): `import { softDeleteRawMaterialConsumption } from "@/app/(app)/_actions";`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:9): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:10): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/fabric/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/consumption/page.tsx:11): `import { formatDate, formatNumber, todayInIndia } from "@/lib/utils";`
- [src/app/(app)/fabric/production/loading.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/loading.tsx:1): `import PageSkeleton from "@/components/app/page-skeleton";`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:1): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:2): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:3): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:4): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:5): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:6): `import { ProductionForm } from "@/components/app/production-form";`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:7): `import { StatusBadge } from "@/components/app/status-badge";`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:8): `import { softDeleteProduction } from "@/app/(app)/_actions";`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:9): `import { isAdmin, requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:10): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/fabric/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/fabric/production/page.tsx:11): `import { formatDate, formatNumber } from "@/lib/utils";`
- [src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx:3): `import { useState, useMemo } from "react";`
- [src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx:4): `import { showSuccess } from "@/lib/toast";`
- [src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx:5): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx:6): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx:7): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx:8): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx:9): `import { ConsumptionForm } from "@/components/app/consumption-form";`
- [src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx:10): `import { Label } from "@/components/ui/label";`
- [src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx:11): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx:12): `import { formatDate, formatNumber } from "@/lib/utils";`
- [src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx:13): `import {`
- [src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/FinishingConsumptionClient.tsx:22): `import { Beaker, Layers, Film, Package } from "lucide-react";`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:1): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:2): `import { DateFilter } from "@/components/app/date-filter";`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:3): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:4): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:5): `import { todayInIndia } from "@/lib/utils";`
- [src/app/(app)/finishing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/consumption/page.tsx:6): `import { FinishingConsumptionClient } from "./FinishingConsumptionClient";`
- [src/app/(app)/finishing/production/loading.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/loading.tsx:1): `import PageSkeleton from "@/components/app/page-skeleton";`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:1): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:2): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:3): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:4): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:5): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:6): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:7): `import { FinishingProductionForm } from "@/components/app/finishing-production-form";`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:8): `import { deleteFinishingBundle } from "@/app/(app)/_actions";`
- [src/app/(app)/finishing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/finishing/production/page.tsx:9): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx:3): `import { useState, useMemo } from "react";`
- [src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx:4): `import { showSuccess } from "@/lib/toast";`
- [src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx:5): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx:6): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx:7): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx:8): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx:9): `import { ConsumptionForm } from "@/components/app/consumption-form";`
- [src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx:10): `import { Label } from "@/components/ui/label";`
- [src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx:11): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx:12): `import { formatDate, formatNumber } from "@/lib/utils";`
- [src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx:13): `import {`
- [src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/LaminationConsumptionClient.tsx:22): `import { Beaker, Layers, Film } from "lucide-react";`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:1): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:2): `import { DateFilter } from "@/components/app/date-filter";`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:3): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:4): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:5): `import { todayInIndia } from "@/lib/utils";`
- [src/app/(app)/lamination/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/consumption/page.tsx:6): `import { LaminationConsumptionClient } from "./LaminationConsumptionClient";`
- [src/app/(app)/lamination/production/loading.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/loading.tsx:1): `import PageSkeleton from "@/components/app/page-skeleton";`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:1): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:2): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:3): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:4): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:5): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:6): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:7): `import { LaminationProductionForm } from "@/components/app/lamination-production-form";`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:8): `import { deleteLaminationProduction } from "@/app/(app)/_actions";`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:9): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/app/(app)/lamination/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/lamination/production/page.tsx:10): `import { formatDate } from "@/lib/utils";`
- [src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx:3): `import { useState, useMemo } from "react";`
- [src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx:4): `import { showSuccess } from "@/lib/toast";`
- [src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx:5): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx:6): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx:7): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx:8): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx:9): `import { ConsumptionForm } from "@/components/app/consumption-form";`
- [src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx:10): `import { Label } from "@/components/ui/label";`
- [src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx:11): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx:12): `import { formatDate, formatNumber } from "@/lib/utils";`
- [src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx:13): `import {`
- [src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/OffsetConsumptionClient.tsx:20): `import { Beaker, Layers, Film } from "lucide-react";`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:1): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:2): `import { DateFilter } from "@/components/app/date-filter";`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:3): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:4): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:5): `import { todayInIndia } from "@/lib/utils";`
- [src/app/(app)/offset-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/consumption/page.tsx:6): `import { OffsetConsumptionClient } from "./OffsetConsumptionClient";`
- [src/app/(app)/offset-printing/production/loading.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/loading.tsx:1): `import PageSkeleton from "@/components/app/page-skeleton";`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:1): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:2): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:3): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:4): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:5): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:6): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:7): `import { OffsetProductionForm } from "@/components/app/offset-production-form";`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:8): `import { deleteOffsetProduction } from "@/app/(app)/_actions";`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:9): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/app/(app)/offset-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/offset-printing/production/page.tsx:10): `import { formatDate } from "@/lib/utils";`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:1): `import { ConsumptionForm } from "@/components/app/consumption-form";`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:2): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:3): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:4): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:5): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:6): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:7): `import { DateFilter } from "@/components/app/date-filter";`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:8): `import { softDeleteRawMaterialConsumption } from "@/app/(app)/_actions";`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:9): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:10): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:11): `import { formatDate, formatNumber, todayInIndia } from "@/lib/utils";`
- [src/app/(app)/roto-printing/consumption/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/page.tsx:13): `import { RotoConsumptionClient } from "./RotoConsumptionClient";`
- [src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx:3): `import { useState } from "react";`
- [src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx:4): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx:5): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx:6): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx:7): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx:8): `import { ConsumptionForm } from "@/components/app/consumption-form";`
- [src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx:9): `import { formatDate, formatNumber } from "@/lib/utils";`
- [src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx:10): `import { softDeleteRawMaterialConsumption } from "@/app/(app)/_actions";`
- [src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/consumption/RotoConsumptionClient.tsx:11): `import { Beaker } from "lucide-react";`
- [src/app/(app)/roto-printing/production/loading.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/loading.tsx:1): `import PageSkeleton from "@/components/app/page-skeleton";`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:1): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:2): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:3): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/roto-printing/production/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/page.tsx:4): `import { RotoProductionClient } from "./RotoProductionClient";`
- [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:3): `import { useState } from "react";`
- [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:4): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:5): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:6): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:7): `import { RotoFilmProductionForm } from "@/components/app/roto-film-production-form";`
- [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:8): `import { RotoMetallicProductionForm } from "@/components/app/roto-metallic-production-form";`
- [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:9): `import { deleteRotoFilmProduction, deleteRotoMetallicProduction } from "@/app/(app)/_actions";`
- [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:10): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/app/(app)/roto-printing/production/RotoProductionClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/roto-printing/production/RotoProductionClient.tsx:11): `import { formatDate } from "@/lib/utils";`
- [src/components/app/consumption-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/consumption-form.tsx:3): `import { useState, useMemo } from "react";`
- [src/components/app/consumption-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/consumption-form.tsx:4): `import { showSuccess } from "@/lib/toast";`
- [src/components/app/consumption-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/consumption-form.tsx:5): `import { saveRawMaterialConsumption } from "@/app/(app)/_actions";`
- [src/components/app/consumption-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/consumption-form.tsx:6): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/components/app/consumption-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/consumption-form.tsx:7): `import { Input } from "@/components/ui/input";`
- [src/components/app/consumption-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/consumption-form.tsx:8): `import { Label } from "@/components/ui/label";`
- [src/components/app/consumption-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/consumption-form.tsx:9): `import { Textarea } from "@/components/ui/textarea";`
- [src/components/app/consumption-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/consumption-form.tsx:10): `import { todayInIndia, formatNumber, isRedirectError } from "@/lib/utils";`
- [src/components/app/finishing-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/finishing-production-form.tsx:3): `import { useState, useTransition, useMemo } from "react";`
- [src/components/app/finishing-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/finishing-production-form.tsx:4): `import { showSuccess } from "@/lib/toast";`
- [src/components/app/finishing-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/finishing-production-form.tsx:5): `import { saveFinishingBundle } from "@/app/(app)/_actions";`
- [src/components/app/finishing-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/finishing-production-form.tsx:6): `import { Button } from "@/components/ui/button";`
- [src/components/app/finishing-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/finishing-production-form.tsx:7): `import { Input } from "@/components/ui/input";`
- [src/components/app/finishing-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/finishing-production-form.tsx:8): `import { Label } from "@/components/ui/label";`
- [src/components/app/finishing-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/finishing-production-form.tsx:9): `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";`
- [src/components/app/finishing-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/finishing-production-form.tsx:10): `import { Badge } from "@/components/ui/badge";`
- [src/components/app/finishing-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/finishing-production-form.tsx:11): `import { isRedirectError } from "@/lib/utils";`
- [src/components/app/lamination-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/lamination-production-form.tsx:3): `import { useState, useTransition, useMemo } from "react";`
- [src/components/app/lamination-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/lamination-production-form.tsx:4): `import { showSuccess } from "@/lib/toast";`
- [src/components/app/lamination-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/lamination-production-form.tsx:5): `import { saveLaminationProduction } from "@/app/(app)/_actions";`
- [src/components/app/lamination-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/lamination-production-form.tsx:6): `import { Button } from "@/components/ui/button";`
- [src/components/app/lamination-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/lamination-production-form.tsx:7): `import { Input } from "@/components/ui/input";`
- [src/components/app/lamination-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/lamination-production-form.tsx:8): `import { Label } from "@/components/ui/label";`
- [src/components/app/lamination-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/lamination-production-form.tsx:9): `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";`
- [src/components/app/lamination-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/lamination-production-form.tsx:10): `import { Badge } from "@/components/ui/badge";`
- [src/components/app/lamination-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/lamination-production-form.tsx:11): `import { isRedirectError } from "@/lib/utils";`
- [src/components/app/production-edit-dialog.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/production-edit-dialog.tsx:3): `import { useState } from "react";`
- [src/components/app/production-edit-dialog.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/production-edit-dialog.tsx:4): `import { Pencil } from "lucide-react";`
- [src/components/app/production-edit-dialog.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/production-edit-dialog.tsx:5): `import { Button } from "@/components/ui/button";`
- [src/components/app/production-edit-dialog.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/production-edit-dialog.tsx:6): `import {`
- [src/components/app/production-edit-dialog.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/production-edit-dialog.tsx:13): `import { ProductionForm } from "@/components/app/production-form";`
- [src/components/app/production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/production-form.tsx:3): `import { useMemo, useState } from "react";`
- [src/components/app/production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/production-form.tsx:4): `import { showSuccess } from "@/lib/toast";`
- [src/components/app/production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/production-form.tsx:5): `import { saveProduction } from "@/app/(app)/_actions";`
- [src/components/app/production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/production-form.tsx:6): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/components/app/production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/production-form.tsx:7): `import { isRedirectError } from "@/lib/utils";`
- [src/components/app/production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/production-form.tsx:8): `import { Input } from "@/components/ui/input";`
- [src/components/app/production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/production-form.tsx:9): `import { Label } from "@/components/ui/label";`
- [src/components/app/production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/production-form.tsx:10): `import { Textarea } from "@/components/ui/textarea";`

## Reports

```mermaid
graph TD
  Reports["Reports"]
  Reports --> "{ useState, useMemo } from 'react'"
  Reports --> "{ ChevronDown, ChevronRight, Printer } from 'lucide-react'"
  Reports --> "{ formatNumber } from '@/lib/utils'"
  Reports --> "{ Button } from '@/components/ui/button'"
  Reports --> "PageSkeleton from '@/components/app/page-skeleton'"
  Reports --> "Link from 'next/link'"
  Reports --> "{ requirePermission, getSessionPermissions } from '@/lib/auth'"
  Reports --> "{ createClient } from '@/lib/supabase/server'"
  Reports --> "{ todayInIndia } from '@/lib/utils'"
  Reports --> "{ PageHeader } from '@/components/app/page-header'"
  Reports --> "{ DateFilter } from '@/components/app/date-filter'"
  Reports --> "{ Button } from '@/components/ui/button'"
  Reports --> "{ Card, CardContent } from '@/components/ui/card'"
  Reports --> "{ AlertCircle } from 'lucide-react'"
  Reports --> "{ BalanceSheetClient } from './BalanceSheetClient'"
  Reports --> "{ useState, useMemo, useEffect, useTransition } from 'react'"
  Reports --> "{ useRouter } from 'next/navigation'"
  Reports --> "{ PageHeader } from '@/components/app/page-header'"
  Reports --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Reports --> "{ Input } from '@/components/ui/input'"
  Reports --> "{ Button } from '@/components/ui/button'"
  Reports --> "{ Label } from '@/components/ui/label'"
  Reports --> "{ formatNumber, todayInIndia, cn } from '@/lib/utils'"
  Reports --> "{ Loader2 } from 'lucide-react'"
  Reports --> "{ saveClosingStock } from '@/app/(app)/_actions'"
  Reports --> "{ requirePermission } from '@/lib/auth'"
  Reports --> "{ createClient } from '@/lib/supabase/server'"
  Reports --> "{ todayInIndia, fetchPagedData } from '@/lib/utils'"
  Reports --> "{ ClosingStockReportClient } from './ClosingStockReportClient'"
  Reports --> "{ useState } from 'react'"
  Reports --> "{ Check, Loader2 } from 'lucide-react'"
  Reports --> "{ PageHeader } from '@/components/app/page-header'"
  Reports --> "{ Card, CardContent } from '@/components/ui/card'"
  Reports --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Reports --> "{ EmptyState } from '@/components/ui/empty-state'"
  Reports --> "{ Input } from '@/components/ui/input'"
  Reports --> "{ Button } from '@/components/ui/button'"
  Reports --> "{ saveAccountOpeningBalance } from '@/app/(app)/_actions'"
  Reports --> "{ requirePermission, requireRole } from '@/lib/auth'"
  Reports --> "{ createClient } from '@/lib/supabase/server'"
  Reports --> "{ OpeningBalanceClient } from './OpeningBalanceClient'"
  Reports --> "{ PageHeader } from '@/components/app/page-header'"
  Reports --> "{ ExportButtons } from '@/components/app/export-buttons'"
  Reports --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Reports --> "{ Input } from '@/components/ui/input'"
  Reports --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Reports --> "{ requirePermission } from '@/lib/auth'"
  Reports --> "{ createClient } from '@/lib/supabase/server'"
  Reports --> "{ formatDate, formatNumber } from '@/lib/utils'"
  Reports --> "type { Database } from '@/lib/database.types'"
  Reports --> "PageSkeleton from '@/components/app/page-skeleton'"
  Reports --> "Link from 'next/link'"
  Reports --> "{ requirePermission, getSessionPermissions } from '@/lib/auth'"
  Reports --> "{ createClient } from '@/lib/supabase/server'"
  Reports --> "{ todayInIndia } from '@/lib/utils'"
  Reports --> "{ PageHeader } from '@/components/app/page-header'"
  Reports --> "{ DateFilter } from '@/components/app/date-filter'"
  Reports --> "{ Button } from '@/components/ui/button'"
  Reports --> "{ Card, CardContent } from '@/components/ui/card'"
  Reports --> "{ AlertCircle } from 'lucide-react'"
  Reports --> "{ ProfitLossReportClient } from './ProfitLossReportClient'"
  Reports --> "{ useState, useMemo, useEffect } from 'react'"
  Reports --> "{ useRouter } from 'next/navigation'"
  Reports --> "{ Button } from '@/components/ui/button'"
  Reports --> "{ Input } from '@/components/ui/input'"
  Reports --> "{ formatNumber } from '@/lib/utils'"
  Reports --> "{ saveProfitLoss } from '@/app/(app)/_actions'"
  Reports --> "{ Printer } from 'lucide-react'"
```

### Import Evidence

- [src/app/(app)/reports/balance-sheet/BalanceSheetClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/BalanceSheetClient.tsx:3): `import { useState, useMemo } from "react";`
- [src/app/(app)/reports/balance-sheet/BalanceSheetClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/BalanceSheetClient.tsx:4): `import { ChevronDown, ChevronRight, Printer } from "lucide-react";`
- [src/app/(app)/reports/balance-sheet/BalanceSheetClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/BalanceSheetClient.tsx:5): `import { formatNumber } from "@/lib/utils";`
- [src/app/(app)/reports/balance-sheet/BalanceSheetClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/BalanceSheetClient.tsx:6): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/reports/balance-sheet/loading.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/loading.tsx:1): `import PageSkeleton from "@/components/app/page-skeleton";`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:1): `import Link from "next/link";`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:2): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:3): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:4): `import { todayInIndia } from "@/lib/utils";`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:5): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:6): `import { DateFilter } from "@/components/app/date-filter";`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:7): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:8): `import { Card, CardContent } from "@/components/ui/card";`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:9): `import { AlertCircle } from "lucide-react";`
- [src/app/(app)/reports/balance-sheet/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/balance-sheet/page.tsx:10): `import { BalanceSheetClient } from "./BalanceSheetClient";`
- [src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx:3): `import { useState, useMemo, useEffect, useTransition } from "react";`
- [src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx:4): `import { useRouter } from "next/navigation";`
- [src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx:5): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx:6): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx:7): `import { Input } from "@/components/ui/input";`
- [src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx:8): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx:9): `import { Label } from "@/components/ui/label";`
- [src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx:10): `import { formatNumber, todayInIndia, cn } from "@/lib/utils";`
- [src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx:11): `import { Loader2 } from "lucide-react";`
- [src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/ClosingStockReportClient.tsx:12): `import { saveClosingStock } from "@/app/(app)/_actions";`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:1): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:2): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:3): `import { todayInIndia, fetchPagedData } from "@/lib/utils";`
- [src/app/(app)/reports/closing-stock/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/closing-stock/page.tsx:4): `import { ClosingStockReportClient } from "./ClosingStockReportClient";`
- [src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx:3): `import { useState } from "react";`
- [src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx:4): `import { Check, Loader2 } from "lucide-react";`
- [src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx:5): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx:6): `import { Card, CardContent } from "@/components/ui/card";`
- [src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx:7): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx:8): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx:9): `import { Input } from "@/components/ui/input";`
- [src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx:10): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/OpeningBalanceClient.tsx:11): `import { saveAccountOpeningBalance } from "@/app/(app)/_actions";`
- [src/app/(app)/reports/opening-balance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/page.tsx:1): `import { requirePermission, requireRole } from "@/lib/auth";`
- [src/app/(app)/reports/opening-balance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/page.tsx:2): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/reports/opening-balance/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/opening-balance/page.tsx:3): `import { OpeningBalanceClient } from "./OpeningBalanceClient";`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:1): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:2): `import { ExportButtons } from "@/components/app/export-buttons";`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:3): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:4): `import { Input } from "@/components/ui/input";`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:5): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:6): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:7): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:8): `import { formatDate, formatNumber } from "@/lib/utils";`
- [src/app/(app)/reports/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/page.tsx:9): `import type { Database } from "@/lib/database.types";`
- [src/app/(app)/reports/profit-loss/loading.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/loading.tsx:1): `import PageSkeleton from "@/components/app/page-skeleton";`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:1): `import Link from "next/link";`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:2): `import { requirePermission, getSessionPermissions } from "@/lib/auth";`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:3): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:4): `import { todayInIndia } from "@/lib/utils";`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:5): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:6): `import { DateFilter } from "@/components/app/date-filter";`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:7): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:8): `import { Card, CardContent } from "@/components/ui/card";`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:9): `import { AlertCircle } from "lucide-react";`
- [src/app/(app)/reports/profit-loss/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/page.tsx:10): `import { ProfitLossReportClient } from "./ProfitLossReportClient";`
- [src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx:3): `import { useState, useMemo, useEffect } from "react";`
- [src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx:4): `import { useRouter } from "next/navigation";`
- [src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx:5): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx:6): `import { Input } from "@/components/ui/input";`
- [src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx:7): `import { formatNumber } from "@/lib/utils";`
- [src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx:8): `import { saveProfitLoss } from "@/app/(app)/_actions";`
- [src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/reports/profit-loss/ProfitLossReportClient.tsx:9): `import { Printer } from "lucide-react";`

## Dashboard

```mermaid
graph TD
  Dashboard["Dashboard"]
  Dashboard --> "Link from 'next/link'"
  Dashboard --> "{ Plus, Package, ShoppingBag, Truck, ClipboardList } from 'lucide-react'"
  Dashboard --> "{ requireUser } from '@/lib/auth'"
  Dashboard --> "{ createClient } from '@/lib/supabase/server'"
  Dashboard --> "{ PageHeader } from '@/components/app/page-header'"
  Dashboard --> "{ Button } from '@/components/ui/button'"
  Dashboard --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Dashboard --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Dashboard --> "{ StatusBadge } from '@/components/app/status-badge'"
  Dashboard --> "{ formatDate, formatNumber } from '@/lib/utils'"
  Dashboard --> "PageSkeleton from '@/components/app/page-skeleton'"
  Dashboard --> "{ Boxes, CalendarCheck, Factory, Package, Scale, ScrollText } from 'lucide-react'"
  Dashboard --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Dashboard --> "{ DashboardChart } from '@/components/app/dashboard-chart'"
  Dashboard --> "{ PageHeader } from '@/components/app/page-header'"
  Dashboard --> "{ requirePermission } from '@/lib/auth'"
  Dashboard --> "{ createClient } from '@/lib/supabase/server'"
  Dashboard --> "{ formatNumber } from '@/lib/utils'"
  Dashboard --> "Link from 'next/link'"
  Dashboard --> "{ redirect } from 'next/navigation'"
  Dashboard --> "{ ShoppingBag, Package, Truck, CheckCircle, XCircle, Clock, Plus, LogOut } from 'lucide-re"
  Dashboard --> "{ getSessionUser } from '@/lib/auth'"
  Dashboard --> "{ createClient } from '@/lib/supabase/server'"
  Dashboard --> "{ formatDate, formatNumber } from '@/lib/utils'"
  Dashboard --> "{ signOut } from '@/app/actions'"
  Dashboard --> "{ BrandLogo } from '@/components/app/brand-logo'"
  Dashboard --> "{ Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'rechart"
```

### Import Evidence

- [src/app/(app)/client/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/dashboard/page.tsx:1): `import Link from "next/link";`
- [src/app/(app)/client/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/dashboard/page.tsx:2): `import { Plus, Package, ShoppingBag, Truck, ClipboardList } from "lucide-react";`
- [src/app/(app)/client/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/dashboard/page.tsx:3): `import { requireUser } from "@/lib/auth";`
- [src/app/(app)/client/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/dashboard/page.tsx:4): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/client/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/dashboard/page.tsx:5): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/client/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/dashboard/page.tsx:6): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/client/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/dashboard/page.tsx:7): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/client/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/dashboard/page.tsx:8): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/client/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/dashboard/page.tsx:9): `import { StatusBadge } from "@/components/app/status-badge";`
- [src/app/(app)/client/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/dashboard/page.tsx:10): `import { formatDate, formatNumber } from "@/lib/utils";`
- [src/app/(app)/dashboard/loading.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/dashboard/loading.tsx:1): `import PageSkeleton from "@/components/app/page-skeleton";`
- [src/app/(app)/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/dashboard/page.tsx:1): `import { Boxes, CalendarCheck, Factory, Package, Scale, ScrollText } from "lucide-react";`
- [src/app/(app)/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/dashboard/page.tsx:2): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/dashboard/page.tsx:3): `import { DashboardChart } from "@/components/app/dashboard-chart";`
- [src/app/(app)/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/dashboard/page.tsx:4): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/dashboard/page.tsx:5): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/dashboard/page.tsx:6): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/dashboard/page.tsx:7): `import { formatNumber } from "@/lib/utils";`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:1): `import Link from "next/link";`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:2): `import { redirect } from "next/navigation";`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:3): `import { ShoppingBag, Package, Truck, CheckCircle, XCircle, Clock, Plus, LogOut } from "lucide-react";`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:4): `import { getSessionUser } from "@/lib/auth";`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:5): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:6): `import { formatDate, formatNumber } from "@/lib/utils";`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:7): `import { signOut } from "@/app/actions";`
- [src/app/(portal)/portal/dashboard/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/dashboard/page.tsx:8): `import { BrandLogo } from "@/components/app/brand-logo";`
- [src/components/app/dashboard-chart.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/dashboard-chart.tsx:3): `import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";`

## Portal

```mermaid
graph TD
  Portal["Portal"]
  Portal --> "{ useState, useMemo } from 'react'"
  Portal --> "{ useRouter } from 'next/navigation'"
  Portal --> "{ ShoppingCart, Search, Trash2, Tag, Layers, CheckCircle2, AlertCircle } from 'lucide-reac"
  Portal --> "{ Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'"
  Portal --> "{ Input } from '@/components/ui/input'"
  Portal --> "{ Button } from '@/components/ui/button'"
  Portal --> "{ Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components"
  Portal --> "{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/ta"
  Portal --> "{ createClientSalesOrder, ClientOrderItemPayload } from '@/app/(app)/_actions/client-sales"
  Portal --> "{ formatNumber } from '@/lib/utils'"
  Portal --> "Link from 'next/link'"
  Portal --> "{ ArrowLeft } from 'lucide-react'"
  Portal --> "{ requireUser } from '@/lib/auth'"
  Portal --> "{ createClient } from '@/lib/supabase/server'"
  Portal --> "{ PageHeader } from '@/components/app/page-header'"
  Portal --> "{ Button } from '@/components/ui/button'"
  Portal --> "{ ClientCatalogView } from './ClientCatalogView'"
  Portal --> "{ requireUser } from '@/lib/auth'"
  Portal --> "{ redirect } from 'next/navigation'"
  Portal --> "Link from 'next/link'"
  Portal --> "{ ArrowLeft } from 'lucide-react'"
  Portal --> "{ redirect } from 'next/navigation'"
  Portal --> "{ getSessionUser } from '@/lib/auth'"
  Portal --> "{ createClient } from '@/lib/supabase/server'"
  Portal --> "{ PortalCatalogView } from './PortalCatalogView'"
  Portal --> "{ BrandLogo } from '@/components/app/brand-logo'"
  Portal --> "{ useState, useMemo, useTransition } from 'react'"
  Portal --> "{ useRouter } from 'next/navigation'"
  Portal --> "{"
  Portal --> "{ createClientOrder } from '@/app/(app)/_actions/client-orders'"
  Portal --> "{ showSuccess } from '@/lib/toast'"
  Portal --> "{ createBrowserClient } from '@supabase/ssr'"
  Portal --> "type { Database } from '@/lib/database.types'"
```

### Import Evidence

- [src/app/(app)/client/catalog/ClientCatalogView.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/catalog/ClientCatalogView.tsx:3): `import { useState, useMemo } from "react";`
- [src/app/(app)/client/catalog/ClientCatalogView.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/catalog/ClientCatalogView.tsx:4): `import { useRouter } from "next/navigation";`
- [src/app/(app)/client/catalog/ClientCatalogView.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/catalog/ClientCatalogView.tsx:5): `import { ShoppingCart, Search, Trash2, Tag, Layers, CheckCircle2, AlertCircle } from "lucide-react";`
- [src/app/(app)/client/catalog/ClientCatalogView.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/catalog/ClientCatalogView.tsx:6): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/client/catalog/ClientCatalogView.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/catalog/ClientCatalogView.tsx:7): `import { Input } from "@/components/ui/input";`
- [src/app/(app)/client/catalog/ClientCatalogView.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/catalog/ClientCatalogView.tsx:8): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/client/catalog/ClientCatalogView.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/catalog/ClientCatalogView.tsx:9): `import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";`
- [src/app/(app)/client/catalog/ClientCatalogView.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/catalog/ClientCatalogView.tsx:10): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/client/catalog/ClientCatalogView.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/catalog/ClientCatalogView.tsx:11): `import { createClientSalesOrder, ClientOrderItemPayload } from "@/app/(app)/_actions/client-sales";`
- [src/app/(app)/client/catalog/ClientCatalogView.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/catalog/ClientCatalogView.tsx:12): `import { formatNumber } from "@/lib/utils";`
- [src/app/(app)/client/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/catalog/page.tsx:1): `import Link from "next/link";`
- [src/app/(app)/client/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/catalog/page.tsx:2): `import { ArrowLeft } from "lucide-react";`
- [src/app/(app)/client/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/catalog/page.tsx:3): `import { requireUser } from "@/lib/auth";`
- [src/app/(app)/client/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/catalog/page.tsx:4): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/client/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/catalog/page.tsx:5): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/client/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/catalog/page.tsx:6): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/client/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/catalog/page.tsx:7): `import { ClientCatalogView } from "./ClientCatalogView";`
- [src/app/(app)/client/layout.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/layout.tsx:1): `import { requireUser } from "@/lib/auth";`
- [src/app/(app)/client/layout.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/client/layout.tsx:2): `import { redirect } from "next/navigation";`
- [src/app/(portal)/portal/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/catalog/page.tsx:1): `import Link from "next/link";`
- [src/app/(portal)/portal/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/catalog/page.tsx:2): `import { ArrowLeft } from "lucide-react";`
- [src/app/(portal)/portal/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/catalog/page.tsx:3): `import { redirect } from "next/navigation";`
- [src/app/(portal)/portal/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/catalog/page.tsx:4): `import { getSessionUser } from "@/lib/auth";`
- [src/app/(portal)/portal/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/catalog/page.tsx:5): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(portal)/portal/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/catalog/page.tsx:6): `import { PortalCatalogView } from "./PortalCatalogView";`
- [src/app/(portal)/portal/catalog/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/catalog/page.tsx:7): `import { BrandLogo } from "@/components/app/brand-logo";`
- [src/app/(portal)/portal/catalog/PortalCatalogView.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/catalog/PortalCatalogView.tsx:3): `import { useState, useMemo, useTransition } from "react";`
- [src/app/(portal)/portal/catalog/PortalCatalogView.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/catalog/PortalCatalogView.tsx:4): `import { useRouter } from "next/navigation";`
- [src/app/(portal)/portal/catalog/PortalCatalogView.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/catalog/PortalCatalogView.tsx:5): `import {`
- [src/app/(portal)/portal/catalog/PortalCatalogView.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/catalog/PortalCatalogView.tsx:9): `import { createClientOrder } from "@/app/(app)/_actions/client-orders";`
- [src/app/(portal)/portal/catalog/PortalCatalogView.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/portal/catalog/PortalCatalogView.tsx:10): `import { showSuccess } from "@/lib/toast";`
- [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:3): `import { createBrowserClient } from "@supabase/ssr";`
- [src/lib/supabase/client.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/client.ts:4): `import type { Database } from "@/lib/database.types";`

## Core

```mermaid
graph TD
  Core["Core"]
  Core --> "static org.junit.Assert.*"
  Core --> "android.content.Context"
  Core --> "androidx.test.ext.junit.runners.AndroidJUnit4"
  Core --> "androidx.test.platform.app.InstrumentationRegistry"
  Core --> "org.junit.Test"
  Core --> "org.junit.runner.RunWith"
  Core --> "static org.junit.Assert.*"
  Core --> "org.junit.Test"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ readFileSync } from 'fs'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "{ readFileSync } from 'node:fs'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "type { NextRequest } from 'next/server'"
  Core --> "{ updateSession } from '@/lib/supabase/middleware'"
  Core --> "withSerwistInit from '@serwist/next'"
  Core --> "type { NextConfig } from 'next'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "{ readFileSync } from 'fs'"
  Core --> "{ resolve } from 'path'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ readFileSync } from 'node:fs'"
  Core --> "{ resolve } from 'node:path'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "{ readFileSync } from 'node:fs'"
  Core --> "{ resolve } from 'node:path'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ readFileSync } from 'node:fs'"
  Core --> "{ resolve } from 'node:path'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "path from 'path'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "sharp from 'sharp'"
  Core --> "sharp from 'sharp'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ readFileSync } from 'node:fs'"
  Core --> "{ resolve } from 'node:path'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ readFileSync } from 'node:fs'"
  Core --> "{ resolve } from 'node:path'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "sharp from 'sharp'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "path from 'path'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "path from 'path'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
  Core --> "fs from 'fs'"
  Core --> "{ createClient } from '@supabase/supabase-js'"
```

### Import Evidence

- [android/app/src/androidTest/java/com/getcapacitor/myapp/ExampleInstrumentedTest.java](C:/Users/spsch/Downloads/ERP-main/ERP-main/android/app/src/androidTest/java/com/getcapacitor/myapp/ExampleInstrumentedTest.java:3): `import static org.junit.Assert.*;`
- [android/app/src/androidTest/java/com/getcapacitor/myapp/ExampleInstrumentedTest.java](C:/Users/spsch/Downloads/ERP-main/ERP-main/android/app/src/androidTest/java/com/getcapacitor/myapp/ExampleInstrumentedTest.java:5): `import android.content.Context;`
- [android/app/src/androidTest/java/com/getcapacitor/myapp/ExampleInstrumentedTest.java](C:/Users/spsch/Downloads/ERP-main/ERP-main/android/app/src/androidTest/java/com/getcapacitor/myapp/ExampleInstrumentedTest.java:6): `import androidx.test.ext.junit.runners.AndroidJUnit4;`
- [android/app/src/androidTest/java/com/getcapacitor/myapp/ExampleInstrumentedTest.java](C:/Users/spsch/Downloads/ERP-main/ERP-main/android/app/src/androidTest/java/com/getcapacitor/myapp/ExampleInstrumentedTest.java:7): `import androidx.test.platform.app.InstrumentationRegistry;`
- [android/app/src/androidTest/java/com/getcapacitor/myapp/ExampleInstrumentedTest.java](C:/Users/spsch/Downloads/ERP-main/ERP-main/android/app/src/androidTest/java/com/getcapacitor/myapp/ExampleInstrumentedTest.java:8): `import org.junit.Test;`
- [android/app/src/androidTest/java/com/getcapacitor/myapp/ExampleInstrumentedTest.java](C:/Users/spsch/Downloads/ERP-main/ERP-main/android/app/src/androidTest/java/com/getcapacitor/myapp/ExampleInstrumentedTest.java:9): `import org.junit.runner.RunWith;`
- [android/app/src/test/java/com/getcapacitor/myapp/ExampleUnitTest.java](C:/Users/spsch/Downloads/ERP-main/ERP-main/android/app/src/test/java/com/getcapacitor/myapp/ExampleUnitTest.java:3): `import static org.junit.Assert.*;`
- [android/app/src/test/java/com/getcapacitor/myapp/ExampleUnitTest.java](C:/Users/spsch/Downloads/ERP-main/ERP-main/android/app/src/test/java/com/getcapacitor/myapp/ExampleUnitTest.java:5): `import org.junit.Test;`
- [inspect_stock.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/inspect_stock.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [inspect_stock.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/inspect_stock.mjs:2): `import fs from "fs";`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:4): `import { readFileSync } from "fs";`
- [latency_test_suite.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/latency_test_suite.mjs:5): `import { createClient } from "@supabase/supabase-js";`
- [list-permissions.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/list-permissions.mjs:1): `import { readFileSync } from "node:fs";`
- [list-permissions.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/list-permissions.mjs:2): `import { createClient } from "@supabase/supabase-js";`
- [middleware.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/middleware.ts:1): `import type { NextRequest } from "next/server";`
- [middleware.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/middleware.ts:2): `import { updateSession } from "@/lib/supabase/middleware";`
- [next.config.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/next.config.ts:1): `import withSerwistInit from "@serwist/next";`
- [next.config.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/next.config.ts:2): `import type { NextConfig } from "next";`
- [scratch/apply-date-permission.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/apply-date-permission.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/check_columns.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_columns.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/check_columns.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_columns.mjs:2): `import fs from "fs";`
- [scratch/check_db.js](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_db.js:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/check_db.js](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_db.js:2): `import { readFileSync } from "fs";`
- [scratch/check_db.js](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_db.js:3): `import { resolve } from "path";`
- [scratch/check_fabric_types.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_fabric_types.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/check_fabric_types.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_fabric_types.mjs:2): `import fs from "fs";`
- [scratch/check_lam_rolls.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_lam_rolls.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/check_lam_rolls.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_lam_rolls.mjs:2): `import fs from "fs";`
- [scratch/check_offset_rolls.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_offset_rolls.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/check_offset_rolls.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_offset_rolls.mjs:2): `import fs from "fs";`
- [scratch/check_order_items.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_order_items.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/check_order_items.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_order_items.mjs:2): `import fs from "fs";`
- [scratch/check_roto_products.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_roto_products.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/check_roto_products.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check_roto_products.mjs:2): `import fs from "fs";`
- [scratch/check-has-permission.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-has-permission.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/check-materials.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-materials.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/check-materials.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-materials.mjs:2): `import fs from "fs";`
- [scratch/check-new-roll-lpe.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-new-roll-lpe.mjs:1): `import { readFileSync } from "node:fs";`
- [scratch/check-new-roll-lpe.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-new-roll-lpe.mjs:2): `import { resolve } from "node:path";`
- [scratch/check-new-roll-lpe.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-new-roll-lpe.mjs:3): `import { createClient } from "@supabase/supabase-js";`
- [scratch/check-permissions.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-permissions.mjs:1): `import { readFileSync } from "node:fs";`
- [scratch/check-permissions.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-permissions.mjs:2): `import { resolve } from "node:path";`
- [scratch/check-permissions.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-permissions.mjs:3): `import { createClient } from "@supabase/supabase-js";`
- [scratch/check-policies.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-policies.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/check-rls-as-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-rls-as-user.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/check-rolls-status.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-rolls-status.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/check-sales-order-anon.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-anon.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/check-sales-order-items-keys.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order-items-keys.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/check-sales-order.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-sales-order.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/check-user-columns.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-user-columns.mjs:1): `import { createClient } from '@supabase/supabase-js';`
- [scratch/check-user-columns.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-user-columns.mjs:2): `import fs from 'fs';`
- [scratch/check-user-details.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-user-details.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/check-user-permissions.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/check-user-permissions.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/clear_stock.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear_stock.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/clear_stock.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear_stock.mjs:2): `import fs from "fs";`
- [scratch/clear-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear-sales.mjs:1): `import { readFileSync } from "node:fs";`
- [scratch/clear-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear-sales.mjs:2): `import { resolve } from "node:path";`
- [scratch/clear-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/clear-sales.mjs:3): `import { createClient } from "@supabase/supabase-js";`
- [scratch/create-placeholders.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/create-placeholders.mjs:1): `import fs from 'fs';`
- [scratch/create-placeholders.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/create-placeholders.mjs:2): `import path from 'path';`
- [scratch/create-test-client.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/create-test-client.mjs:5): `import { createClient } from "@supabase/supabase-js";`
- [scratch/create-test-client.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/create-test-client.mjs:6): `import fs from "fs";`
- [scratch/crop-logo-centered.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/crop-logo-centered.mjs:1): `import sharp from "sharp";`
- [scratch/crop-logo.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/crop-logo.mjs:1): `import sharp from "sharp";`
- [scratch/diagnose-login-error.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/diagnose-login-error.mjs:1): `import { createClient } from '@supabase/supabase-js';`
- [scratch/diagnose-login-error.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/diagnose-login-error.mjs:2): `import fs from 'fs';`
- [scratch/execute-merge-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/execute-merge-w24.mjs:1): `import { readFileSync } from "node:fs";`
- [scratch/execute-merge-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/execute-merge-w24.mjs:2): `import { resolve } from "node:path";`
- [scratch/execute-merge-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/execute-merge-w24.mjs:3): `import { createClient } from "@supabase/supabase-js";`
- [scratch/find-duplicates.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-duplicates.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/find-duplicates.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-duplicates.mjs:2): `import fs from "fs";`
- [scratch/find-ft-references.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-ft-references.mjs:1): `import { readFileSync } from "node:fs";`
- [scratch/find-ft-references.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-ft-references.mjs:2): `import { resolve } from "node:path";`
- [scratch/find-ft-references.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-ft-references.mjs:3): `import { createClient } from "@supabase/supabase-js";`
- [scratch/find-journal-gaps.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-journal-gaps.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/find-journal-gaps.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-journal-gaps.mjs:2): `import fs from "fs";`
- [scratch/find-logo-bounds.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-logo-bounds.mjs:1): `import sharp from "sharp";`
- [scratch/find-polysquare-lldp.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-polysquare-lldp.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/find-polysquare-lldp.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-polysquare-lldp.mjs:3): `import fs from "fs";`
- [scratch/find-polysquare-lldp.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/find-polysquare-lldp.mjs:4): `import path from "path";`
- [scratch/inspect_all_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_all_73.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/inspect_all_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_all_73.mjs:2): `import fs from "fs";`
- [scratch/inspect_all_purchases_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_all_purchases_73.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/inspect_all_purchases_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_all_purchases_73.mjs:2): `import fs from "fs";`
- [scratch/inspect_customer.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_customer.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/inspect_customer.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_customer.mjs:2): `import fs from "fs";`
- [scratch/inspect_deliveries_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_deliveries_73.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/inspect_deliveries_73.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_deliveries_73.mjs:2): `import fs from "fs";`
- [scratch/inspect_exact_order_journal.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_exact_order_journal.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/inspect_exact_order_journal.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_exact_order_journal.mjs:2): `import fs from "fs";`
- [scratch/inspect_is_draft_billing.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_is_draft_billing.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/inspect_is_draft_billing.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_is_draft_billing.mjs:2): `import fs from "fs";`
- [scratch/inspect_journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_journals.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/inspect_journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_journals.mjs:2): `import fs from "fs";`
- [scratch/inspect_material_purchases.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_material_purchases.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/inspect_material_purchases.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_material_purchases.mjs:2): `import fs from "fs";`
- [scratch/inspect_material_sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_material_sales.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/inspect_material_sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_material_sales.mjs:2): `import fs from "fs";`
- [scratch/inspect_order_2_journal.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_order_2_journal.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/inspect_order_2_journal.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_order_2_journal.mjs:2): `import fs from "fs";`
- [scratch/inspect_order_73_pricing.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_order_73_pricing.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/inspect_order_73_pricing.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_order_73_pricing.mjs:2): `import fs from "fs";`
- [scratch/inspect_sales_ac.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_sales_ac.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/inspect_sales_ac.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_sales_ac.mjs:2): `import fs from "fs";`
- [scratch/inspect_sv_polytech_rows.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_sv_polytech_rows.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/inspect_sv_polytech_rows.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_sv_polytech_rows.mjs:2): `import fs from "fs";`
- [scratch/inspect_updated_at.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_updated_at.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/inspect_updated_at.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect_updated_at.mjs:2): `import fs from "fs";`
- [scratch/inspect-created-times.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-created-times.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/inspect-created-times.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-created-times.mjs:2): `import fs from "fs";`
- [scratch/inspect-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-journals.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/inspect-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-journals.mjs:2): `import fs from "fs";`
- [scratch/inspect-kankariya.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-kankariya.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/inspect-loom-schema.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-loom-schema.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/inspect-permissions.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-permissions.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/inspect-permissions.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-permissions.mjs:2): `import fs from "fs";`
- [scratch/inspect-permissions.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-permissions.mjs:3): `import path from "path";`
- [scratch/inspect-purchases.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-purchases.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/inspect-purchases.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-purchases.mjs:2): `import fs from "fs";`
- [scratch/inspect-tables.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-tables.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/inspect-tables.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/inspect-tables.mjs:2): `import fs from "fs";`
- [scratch/list_billed_orders.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/list_billed_orders.mjs:1): `import { readFileSync } from "node:fs";`
- [scratch/list_billed_orders.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/list_billed_orders.mjs:2): `import { resolve } from "node:path";`
- [scratch/list_billed_orders.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/list_billed_orders.mjs:3): `import { createClient } from "@supabase/supabase-js";`
- [scratch/list_recent_purchases.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/list_recent_purchases.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/list_recent_purchases.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/list_recent_purchases.mjs:2): `import fs from "fs";`
- [scratch/list-users-debug.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/list-users-debug.mjs:1): `import { createClient } from '@supabase/supabase-js';`
- [scratch/list-users-debug.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/list-users-debug.mjs:2): `import fs from 'fs';`
- [scratch/list-users.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/list-users.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/login-test.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/login-test.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/query_all.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/query_all.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/query_all.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/query_all.mjs:2): `import fs from "fs";`
- [scratch/query-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/query-w24.mjs:1): `import { readFileSync } from "node:fs";`
- [scratch/query-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/query-w24.mjs:2): `import { resolve } from "node:path";`
- [scratch/query-w24.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/query-w24.mjs:3): `import { createClient } from "@supabase/supabase-js";`
- [scratch/restore-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/restore-journals.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/restore-journals.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/restore-journals.mjs:2): `import fs from "fs";`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:3): `import { useState, useTransition, useMemo } from "react";`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:4): `import { Printer, FileText, ChevronDown, ChevronRight, Receipt, Package } from "lucide-react";`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:5): `import { saveSalesOrderBillingDirect } from "@/app/(app)/_actions";`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:6): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:7): `import { EmptyState } from "@/components/ui/empty-state";`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:8): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:9): `import { Badge } from "@/components/ui/badge";`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:10): `import { Button } from "@/components/ui/button";`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:11): `import { Input } from "@/components/ui/input";`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:12): `import { Label } from "@/components/ui/label";`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:13): `import { formatDate, formatNumber, todayInIndia } from "@/lib/utils";`
- [scratch/SalesEntryClient_old.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/SalesEntryClient_old.tsx:14): `import { SalesPrintView } from "@/components/app/sales-print-view";`
- [scratch/search-logs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/search-logs.mjs:1): `import fs from "fs";`
- [scratch/search-logs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/search-logs.mjs:2): `import readline from "readline";`
- [scratch/squash-migrations.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/squash-migrations.mjs:1): `import fs from "fs";`
- [scratch/squash-migrations.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/squash-migrations.mjs:2): `import path from "path";`
- [scratch/test_journal_insert.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_journal_insert.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/test_journal_insert.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_journal_insert.mjs:2): `import fs from "fs";`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/test_report_filtering.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_report_filtering.mjs:2): `import fs from "fs";`
- [scratch/test_stock_query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_stock_query.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/test_stock_query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test_stock_query.mjs:2): `import fs from "fs";`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:1): `import { readFileSync } from "node:fs";`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:2): `import { resolve } from "node:path";`
- [scratch/test-crud.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-crud.mjs:3): `import { createClient } from "@supabase/supabase-js";`
- [scratch/test-full-login-flow.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-full-login-flow.mjs:1): `import { createClient } from '@supabase/supabase-js';`
- [scratch/test-full-login-flow.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-full-login-flow.mjs:2): `import fs from 'fs';`
- [scratch/test-login-query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-login-query.mjs:1): `import { createClient } from '@supabase/supabase-js';`
- [scratch/test-login-query.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-login-query.mjs:2): `import fs from 'fs';`
- [scratch/test-material-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-material-sales.mjs:1): `import { readFileSync } from "node:fs";`
- [scratch/test-material-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-material-sales.mjs:2): `import { resolve } from "node:path";`
- [scratch/test-material-sales.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-material-sales.mjs:3): `import { createClient } from "@supabase/supabase-js";`
- [scratch/test-product-creation.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/test-product-creation.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scratch/try-execute-sql-rpc.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scratch/try-execute-sql-rpc.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scripts/analyze_inconsistencies.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/analyze_inconsistencies.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scripts/analyze_inconsistencies.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/analyze_inconsistencies.mjs:2): `import { readFileSync } from "node:fs";`
- [scripts/analyze_inconsistencies.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/analyze_inconsistencies.mjs:3): `import { resolve } from "node:path";`
- [scripts/check-schema.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/check-schema.mjs:1): `import { createClient } from "@supabase/supabase-js";`
- [scripts/check-schema.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/check-schema.mjs:2): `import fs from "fs";`
- [scripts/create-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/create-user.mjs:1): `import { readFileSync } from "node:fs";`
- [scripts/create-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/create-user.mjs:2): `import { resolve } from "node:path";`
- [scripts/create-user.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/create-user.mjs:3): `import { createClient } from "@supabase/supabase-js";`
- [scripts/generate-enterprise-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-enterprise-forensic-docs.mjs:1): `import fs from "node:fs";`
- [scripts/generate-enterprise-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-enterprise-forensic-docs.mjs:2): `import path from "node:path";`
- [scripts/generate-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-forensic-docs.mjs:1): `import fs from "node:fs";`
- [scripts/generate-forensic-docs.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/generate-forensic-docs.mjs:2): `import path from "node:path";`
- [scripts/test-db.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/test-db.mjs:1): `import { readFileSync } from "node:fs";`
- [scripts/test-db.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/test-db.mjs:2): `import { resolve } from "node:path";`
- [scripts/test-db.mjs](C:/Users/spsch/Downloads/ERP-main/ERP-main/scripts/test-db.mjs:3): `import { createClient } from "@supabase/supabase-js";`
- [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:3): `import * as master from "./_actions/master";`
- [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:4): `import * as attendance from "./_actions/attendance";`
- [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:5): `import * as production from "./_actions/production";`
- [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:6): `import * as sales from "./_actions/sales";`
- [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:7): `import * as purchases from "./_actions/purchases";`
- [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:8): `import * as usersRoles from "./_actions/users-roles";`
- [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:9): `import * as rawMaterials from "./_actions/raw-materials";`
- [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:10): `import * as products from "./_actions/products";`
- [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:11): `import * as journal from "./_actions/journal";`
- [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:12): `import * as accounts from "./_actions/accounts";`
- [src/app/(app)/_actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions.ts:13): `import * as clientOrders from "./_actions/client-orders";`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:1): `import { z } from "zod";`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:2): `import { revalidatePath } from "next/cache";`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:3): `import { getSessionPermissions, requirePermission } from "@/lib/auth";`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:4): `import type { AppUser } from "@/lib/database.types";`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:5): `import { modules } from "@/lib/modules";`
- [src/app/(app)/_actions/helpers.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/helpers.ts:6): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:3): `import { revalidatePath } from "next/cache";`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:4): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:5): `import { createAdminClient } from "@/lib/supabase/admin";`
- [src/app/(app)/_actions/products.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/products.ts:6): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:3): `import { revalidatePath } from "next/cache";`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:4): `import { requirePermission, requireAnyPermission } from "@/lib/auth";`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:5): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/_actions/purchases.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/_actions/purchases.ts:6): `import { generateNextJournalNo, todayInIndia } from "./helpers";`
- [src/app/(app)/403/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/403/page.tsx:1): `import Link from "next/link";`
- [src/app/(app)/403/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/403/page.tsx:2): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/403/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/403/page.tsx:3): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/403/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/403/page.tsx:4): `import { Card, CardContent } from "@/components/ui/card";`
- [src/app/(app)/layout.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/layout.tsx:1): `import { redirect } from "next/navigation";`
- [src/app/(app)/layout.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/layout.tsx:2): `import { AppShell } from "@/components/app/app-shell";`
- [src/app/(app)/layout.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/layout.tsx:3): `import { getSessionPermissions, requireUser } from "@/lib/auth";`
- [src/app/(app)/layout.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/layout.tsx:4): `import type { RoleName } from "@/lib/database.types";`
- [src/app/(app)/layout.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/layout.tsx:5): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/layout.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/layout.tsx:6): `import { unstable_cache } from "next/cache";`
- [src/app/(app)/loading.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/loading.tsx:1): `import { Loader2 } from "lucide-react";`
- [src/app/(app)/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/page.tsx:1): `import { getSessionUser } from "@/lib/auth";`
- [src/app/(app)/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/page.tsx:2): `import { BrandLogo } from "@/components/app/brand-logo";`
- [src/app/(app)/rolls/[id]/loading.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/rolls/[id]/loading.tsx:1): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/rolls/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/rolls/[id]/page.tsx:1): `import Link from "next/link";`
- [src/app/(app)/rolls/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/rolls/[id]/page.tsx:2): `import { ArrowLeft } from "lucide-react";`
- [src/app/(app)/rolls/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/rolls/[id]/page.tsx:3): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/rolls/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/rolls/[id]/page.tsx:4): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/app/(app)/rolls/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/rolls/[id]/page.tsx:5): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/rolls/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/rolls/[id]/page.tsx:6): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/rolls/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/rolls/[id]/page.tsx:7): `import { StatusBadge } from "@/components/app/status-badge";`
- [src/app/(app)/rolls/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/rolls/[id]/page.tsx:8): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/rolls/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/rolls/[id]/page.tsx:9): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/rolls/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/rolls/[id]/page.tsx:10): `import { formatDate, formatNumber } from "@/lib/utils";`
- [src/app/(app)/rolls/[id]/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/rolls/[id]/page.tsx:11): `import { Button } from "@/components/ui/button";`
- [src/app/(app)/rolls/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/rolls/page.tsx:1): `import Link from "next/link";`
- [src/app/(app)/rolls/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/rolls/page.tsx:2): `import { PageHeader } from "@/components/app/page-header";`
- [src/app/(app)/rolls/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/rolls/page.tsx:3): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/app/(app)/rolls/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/rolls/page.tsx:4): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/app/(app)/rolls/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/rolls/page.tsx:5): `import { requirePermission } from "@/lib/auth";`
- [src/app/(app)/rolls/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/rolls/page.tsx:6): `import { createClient } from "@/lib/supabase/server";`
- [src/app/(app)/rolls/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(app)/rolls/page.tsx:7): `import { formatNumber } from "@/lib/utils";`
- [src/app/(auth)/login/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(auth)/login/page.tsx:1): `import Link from "next/link";`
- [src/app/(auth)/login/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(auth)/login/page.tsx:2): `import { LoginForm } from "@/components/app/auth-forms";`
- [src/app/(auth)/reset-password/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(auth)/reset-password/page.tsx:1): `import Link from "next/link";`
- [src/app/(auth)/reset-password/page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(auth)/reset-password/page.tsx:2): `import { ResetPasswordForm } from "@/components/app/auth-forms";`
- [src/app/(portal)/layout.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/layout.tsx:1): `import { redirect } from "next/navigation";`
- [src/app/(portal)/layout.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/(portal)/layout.tsx:2): `import { getSessionUser } from "@/lib/auth";`
- [src/app/actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/actions.ts:3): `import { revalidatePath } from "next/cache";`
- [src/app/actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/actions.ts:4): `import { headers } from "next/headers";`
- [src/app/actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/actions.ts:5): `import { redirect } from "next/navigation";`
- [src/app/actions.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/actions.ts:6): `import { createClient } from "@/lib/supabase/server";`
- [src/app/layout.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/layout.tsx:1): `import type { Metadata, Viewport } from "next";`
- [src/app/layout.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/layout.tsx:2): `import { Inter } from "next/font/google";`
- [src/app/layout.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/layout.tsx:3): `import { SplashRemover } from "@/components/app/splash-remover";`
- [src/app/layout.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/layout.tsx:4): `import "./globals.css";`
- [src/app/manifest.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/manifest.ts:1): `import type { MetadataRoute } from "next";`
- [src/app/sw.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/sw.ts:1): `import { defaultCache } from "@serwist/next/worker";`
- [src/app/sw.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/sw.ts:2): `import type { PrecacheEntry } from "@serwist/precaching";`
- [src/app/sw.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/app/sw.ts:3): `import { installSerwist } from "@serwist/sw";`
- [src/components/app/app-shell.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/app-shell.tsx:3): `import Link from "next/link";`
- [src/components/app/app-shell.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/app-shell.tsx:4): `import { usePathname, useSearchParams } from "next/navigation";`
- [src/components/app/app-shell.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/app-shell.tsx:5): `import { useEffect, useMemo, useState, Suspense } from "react";`
- [src/components/app/app-shell.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/app-shell.tsx:6): `import { Menu, ChevronDown, ChevronRight } from "lucide-react";`
- [src/components/app/app-shell.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/app-shell.tsx:7): `import { signOut } from "@/app/actions";`
- [src/components/app/app-shell.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/app-shell.tsx:8): `import { BrandLogo } from "@/components/app/brand-logo";`
- [src/components/app/app-shell.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/app-shell.tsx:9): `import { Badge } from "@/components/ui/badge";`
- [src/components/app/app-shell.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/app-shell.tsx:10): `import { Button } from "@/components/ui/button";`
- [src/components/app/app-shell.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/app-shell.tsx:11): `import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";`
- [src/components/app/app-shell.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/app-shell.tsx:12): `import { cn } from "@/lib/utils";`
- [src/components/app/app-shell.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/app-shell.tsx:13): `import type { AppUser, RoleName } from "@/lib/database.types";`
- [src/components/app/app-shell.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/app-shell.tsx:14): `import { navGroups, type NavGroup } from "@/lib/navigation";`
- [src/components/app/auth-forms.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/auth-forms.tsx:3): `import { useActionState } from "react";`
- [src/components/app/auth-forms.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/auth-forms.tsx:4): `import { signIn, resetPassword } from "@/app/actions";`
- [src/components/app/auth-forms.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/auth-forms.tsx:5): `import { BrandLogo } from "@/components/app/brand-logo";`
- [src/components/app/auth-forms.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/auth-forms.tsx:6): `import { Button } from "@/components/ui/button";`
- [src/components/app/auth-forms.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/auth-forms.tsx:7): `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/components/app/auth-forms.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/auth-forms.tsx:8): `import { Input } from "@/components/ui/input";`
- [src/components/app/auth-forms.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/auth-forms.tsx:9): `import { Label } from "@/components/ui/label";`
- [src/components/app/confirm-submit-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/confirm-submit-button.tsx:3): `import { useRef, useState } from "react";`
- [src/components/app/confirm-submit-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/confirm-submit-button.tsx:4): `import { Button, type ButtonProps } from "@/components/ui/button";`
- [src/components/app/confirm-submit-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/confirm-submit-button.tsx:5): `import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";`
- [src/components/app/create-role-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/create-role-form.tsx:3): `import { useTransition, useState } from "react";`
- [src/components/app/create-role-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/create-role-form.tsx:4): `import { createRole } from "@/app/(app)/_actions";`
- [src/components/app/create-role-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/create-role-form.tsx:5): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/components/app/create-role-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/create-role-form.tsx:6): `import { Input } from "@/components/ui/input";`
- [src/components/app/create-role-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/create-role-form.tsx:7): `import { Label } from "@/components/ui/label";`
- [src/components/app/create-role-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/create-role-form.tsx:8): `import { showSuccess } from "@/lib/toast";`
- [src/components/app/date-filter.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/date-filter.tsx:3): `import { useRouter } from "next/navigation";`
- [src/components/app/date-filter.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/date-filter.tsx:4): `import { useTransition, useState, useEffect } from "react";`
- [src/components/app/date-filter.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/date-filter.tsx:5): `import { Label } from "@/components/ui/label";`
- [src/components/app/date-filter.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/date-filter.tsx:6): `import { Input } from "@/components/ui/input";`
- [src/components/app/date-filter.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/date-filter.tsx:7): `import { Button } from "@/components/ui/button";`
- [src/components/app/date-filter.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/date-filter.tsx:8): `import { Loader2 } from "lucide-react";`
- [src/components/app/date-filter.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/date-filter.tsx:9): `import { cn } from "@/lib/utils";`
- [src/components/app/date-range-filter.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/date-range-filter.tsx:3): `import { useRouter } from "next/navigation";`
- [src/components/app/date-range-filter.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/date-range-filter.tsx:4): `import { useTransition, useState, useEffect } from "react";`
- [src/components/app/date-range-filter.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/date-range-filter.tsx:5): `import { Label } from "@/components/ui/label";`
- [src/components/app/date-range-filter.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/date-range-filter.tsx:6): `import { Input } from "@/components/ui/input";`
- [src/components/app/date-range-filter.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/date-range-filter.tsx:7): `import { Button } from "@/components/ui/button";`
- [src/components/app/date-range-filter.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/date-range-filter.tsx:8): `import { Loader2 } from "lucide-react";`
- [src/components/app/date-range-filter.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/date-range-filter.tsx:9): `import { cn } from "@/lib/utils";`
- [src/components/app/delete-order-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/delete-order-button.tsx:3): `import { useTransition, useState } from "react";`
- [src/components/app/delete-order-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/delete-order-button.tsx:4): `import { deleteSalesOrderCompletely } from "@/app/(app)/_actions";`
- [src/components/app/delete-order-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/delete-order-button.tsx:5): `import { Button } from "@/components/ui/button";`
- [src/components/app/delete-order-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/delete-order-button.tsx:6): `import { Trash2 } from "lucide-react";`
- [src/components/app/delete-order-button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/delete-order-button.tsx:7): `import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";`
- [src/components/app/delivery-entry-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/delivery-entry-form.tsx:3): `import { useState, useMemo } from "react";`
- [src/components/app/delivery-entry-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/delivery-entry-form.tsx:4): `import { showSuccess } from "@/lib/toast";`
- [src/components/app/delivery-entry-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/delivery-entry-form.tsx:5): `import { Plus, Trash2, PackagePlus } from "lucide-react";`
- [src/components/app/delivery-entry-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/delivery-entry-form.tsx:6): `import { createSalesOrder } from "@/app/(app)/_actions";`
- [src/components/app/delivery-entry-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/delivery-entry-form.tsx:7): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/components/app/delivery-entry-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/delivery-entry-form.tsx:8): `import { Input } from "@/components/ui/input";`
- [src/components/app/delivery-entry-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/delivery-entry-form.tsx:9): `import { Label } from "@/components/ui/label";`
- [src/components/app/delivery-entry-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/delivery-entry-form.tsx:10): `import { Button } from "@/components/ui/button";`
- [src/components/app/delivery-entry-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/delivery-entry-form.tsx:11): `import { Badge } from "@/components/ui/badge";`
- [src/components/app/delivery-entry-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/delivery-entry-form.tsx:12): `import { isRedirectError } from "@/lib/utils";`
- [src/components/app/export-buttons.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/export-buttons.tsx:3): `import { Download, FileText, Printer } from "lucide-react";`
- [src/components/app/export-buttons.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/export-buttons.tsx:4): `import { Button } from "@/components/ui/button";`
- [src/components/app/export-buttons.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/export-buttons.tsx:5): `import { csvEscape } from "@/lib/utils";`
- [src/components/app/journal-entry-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/journal-entry-form.tsx:3): `import React, { useState, useEffect, useRef, useMemo } from "react";`
- [src/components/app/journal-entry-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/journal-entry-form.tsx:4): `import { Plus, Trash2, CheckCircle2, XCircle, Search } from "lucide-react";`
- [src/components/app/journal-entry-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/journal-entry-form.tsx:5): `import { saveJournalEntry } from "@/app/(app)/_actions";`
- [src/components/app/journal-entry-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/journal-entry-form.tsx:6): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/components/app/journal-entry-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/journal-entry-form.tsx:7): `import { Input } from "@/components/ui/input";`
- [src/components/app/journal-entry-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/journal-entry-form.tsx:8): `import { Label } from "@/components/ui/label";`
- [src/components/app/journal-entry-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/journal-entry-form.tsx:9): `import { Button } from "@/components/ui/button";`
- [src/components/app/journal-entry-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/journal-entry-form.tsx:10): `import Link from "next/link";`
- [src/components/app/journal-entry-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/journal-entry-form.tsx:11): `import { todayInIndia } from "@/lib/utils";`
- [src/components/app/master-page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/master-page.tsx:3): `import { useState, useTransition } from "react";`
- [src/components/app/master-page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/master-page.tsx:4): `import Link from "next/link";`
- [src/components/app/master-page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/master-page.tsx:5): `import { Search } from "lucide-react";`
- [src/components/app/master-page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/master-page.tsx:6): `import { Button } from "@/components/ui/button";`
- [src/components/app/master-page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/master-page.tsx:7): `import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";`
- [src/components/app/master-page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/master-page.tsx:8): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/components/app/master-page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/master-page.tsx:9): `import { EmptyState } from "@/components/ui/empty-state";`
- [src/components/app/master-page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/master-page.tsx:10): `import { Input } from "@/components/ui/input";`
- [src/components/app/master-page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/master-page.tsx:11): `import { Label } from "@/components/ui/label";`
- [src/components/app/master-page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/master-page.tsx:12): `import { Textarea } from "@/components/ui/textarea";`
- [src/components/app/master-page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/master-page.tsx:13): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/components/app/master-page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/master-page.tsx:14): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/components/app/master-page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/master-page.tsx:15): `import { PageHeader } from "@/components/app/page-header";`
- [src/components/app/master-page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/master-page.tsx:16): `import { StatusBadge } from "@/components/app/status-badge";`
- [src/components/app/master-page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/master-page.tsx:17): `import { saveMaster, deactivateMaster } from "@/app/(app)/_actions";`
- [src/components/app/master-page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/master-page.tsx:18): `import type { ModuleConfig } from "@/lib/modules";`
- [src/components/app/master-page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/master-page.tsx:19): `import { formatDate, formatNumber } from "@/lib/utils";`
- [src/components/app/master-page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/master-page.tsx:20): `import { showSuccess } from "@/lib/toast";`
- [src/components/app/offset-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/offset-production-form.tsx:3): `import { useState, useTransition, useMemo } from "react";`
- [src/components/app/offset-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/offset-production-form.tsx:4): `import { showSuccess } from "@/lib/toast";`
- [src/components/app/offset-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/offset-production-form.tsx:5): `import { saveOffsetProduction } from "@/app/(app)/_actions";`
- [src/components/app/offset-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/offset-production-form.tsx:6): `import { Button } from "@/components/ui/button";`
- [src/components/app/offset-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/offset-production-form.tsx:7): `import { Input } from "@/components/ui/input";`
- [src/components/app/offset-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/offset-production-form.tsx:8): `import { Label } from "@/components/ui/label";`
- [src/components/app/offset-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/offset-production-form.tsx:9): `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";`
- [src/components/app/offset-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/offset-production-form.tsx:10): `import { Badge } from "@/components/ui/badge";`
- [src/components/app/offset-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/offset-production-form.tsx:11): `import { isRedirectError } from "@/lib/utils";`
- [src/components/app/page-skeleton.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/page-skeleton.tsx:1): `import { Loader2 } from "lucide-react";`
- [src/components/app/placeholder-page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/placeholder-page.tsx:1): `import { PageHeader } from "@/components/app/page-header";`
- [src/components/app/placeholder-page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/placeholder-page.tsx:2): `import { Card, CardContent } from "@/components/ui/card";`
- [src/components/app/placeholder-page.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/placeholder-page.tsx:3): `import { AlertCircle } from "lucide-react";`
- [src/components/app/purchase-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/purchase-form.tsx:3): `import { useRef, useState, useMemo } from "react";`
- [src/components/app/purchase-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/purchase-form.tsx:4): `import { Trash2, Plus, PackagePlus } from "lucide-react";`
- [src/components/app/purchase-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/purchase-form.tsx:5): `import { saveRawMaterialPurchase } from "@/app/(app)/_actions";`
- [src/components/app/purchase-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/purchase-form.tsx:6): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/components/app/purchase-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/purchase-form.tsx:7): `import { Input } from "@/components/ui/input";`
- [src/components/app/purchase-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/purchase-form.tsx:8): `import { Label } from "@/components/ui/label";`
- [src/components/app/purchase-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/purchase-form.tsx:9): `import { Textarea } from "@/components/ui/textarea";`
- [src/components/app/purchase-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/purchase-form.tsx:10): `import { Button } from "@/components/ui/button";`
- [src/components/app/recent-orders-table.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/recent-orders-table.tsx:3): `import { useState } from "react";`
- [src/components/app/recent-orders-table.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/recent-orders-table.tsx:4): `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";`
- [src/components/app/recent-orders-table.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/recent-orders-table.tsx:5): `import { StatusBadge } from "@/components/app/status-badge";`
- [src/components/app/recent-orders-table.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/recent-orders-table.tsx:6): `import { DeleteOrderButton } from "@/components/app/delete-order-button";`
- [src/components/app/recent-orders-table.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/recent-orders-table.tsx:7): `import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";`
- [src/components/app/recent-orders-table.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/recent-orders-table.tsx:8): `import { Badge } from "@/components/ui/badge";`
- [src/components/app/recent-orders-table.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/recent-orders-table.tsx:9): `import { Eye } from "lucide-react";`
- [src/components/app/recent-orders-table.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/recent-orders-table.tsx:10): `import { Button } from "@/components/ui/button";`
- [src/components/app/role-permissions-editor.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/role-permissions-editor.tsx:3): `import { useTransition, useState } from "react";`
- [src/components/app/role-permissions-editor.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/role-permissions-editor.tsx:4): `import { saveRoleDetails, saveRolePermissions, deactivateRole } from "@/app/(app)/_actions";`
- [src/components/app/role-permissions-editor.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/role-permissions-editor.tsx:5): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/components/app/role-permissions-editor.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/role-permissions-editor.tsx:6): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/components/app/role-permissions-editor.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/role-permissions-editor.tsx:7): `import { Input } from "@/components/ui/input";`
- [src/components/app/role-permissions-editor.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/role-permissions-editor.tsx:8): `import { Label } from "@/components/ui/label";`
- [src/components/app/role-permissions-editor.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/role-permissions-editor.tsx:9): `import { StatusBadge } from "@/components/app/status-badge";`
- [src/components/app/role-permissions-editor.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/role-permissions-editor.tsx:10): `import { showSuccess } from "@/lib/toast";`
- [src/components/app/roll-allocation-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roll-allocation-form.tsx:3): `import { useState, useTransition } from "react";`
- [src/components/app/roll-allocation-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roll-allocation-form.tsx:4): `import { useRouter } from "next/navigation";`
- [src/components/app/roll-allocation-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roll-allocation-form.tsx:5): `import { Check } from "lucide-react";`
- [src/components/app/roll-allocation-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roll-allocation-form.tsx:6): `import { confirmSalesDelivery } from "@/app/(app)/_actions";`
- [src/components/app/roll-allocation-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roll-allocation-form.tsx:7): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/components/app/roll-allocation-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roll-allocation-form.tsx:8): `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";`
- [src/components/app/roll-allocation-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roll-allocation-form.tsx:9): `import { StatusBadge } from "@/components/app/status-badge";`
- [src/components/app/roll-allocation-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roll-allocation-form.tsx:10): `import { Label } from "@/components/ui/label";`
- [src/components/app/roll-allocation-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roll-allocation-form.tsx:11): `import { formatNumber } from "@/lib/utils";`
- [src/components/app/roto-film-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roto-film-production-form.tsx:3): `import { useState, useTransition, useMemo } from "react";`
- [src/components/app/roto-film-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roto-film-production-form.tsx:4): `import { showSuccess } from "@/lib/toast";`
- [src/components/app/roto-film-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roto-film-production-form.tsx:5): `import { saveRotoFilmProduction } from "@/app/(app)/_actions";`
- [src/components/app/roto-film-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roto-film-production-form.tsx:6): `import { Button } from "@/components/ui/button";`
- [src/components/app/roto-film-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roto-film-production-form.tsx:7): `import { Input } from "@/components/ui/input";`
- [src/components/app/roto-film-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roto-film-production-form.tsx:8): `import { Label } from "@/components/ui/label";`
- [src/components/app/roto-film-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roto-film-production-form.tsx:9): `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";`
- [src/components/app/roto-film-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roto-film-production-form.tsx:10): `import { Badge } from "@/components/ui/badge";`
- [src/components/app/roto-film-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roto-film-production-form.tsx:11): `import { isRedirectError } from "@/lib/utils";`
- [src/components/app/roto-metallic-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roto-metallic-production-form.tsx:3): `import { useState, useTransition, useMemo } from "react";`
- [src/components/app/roto-metallic-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roto-metallic-production-form.tsx:4): `import { showSuccess } from "@/lib/toast";`
- [src/components/app/roto-metallic-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roto-metallic-production-form.tsx:5): `import { saveRotoMetallicProduction } from "@/app/(app)/_actions";`
- [src/components/app/roto-metallic-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roto-metallic-production-form.tsx:6): `import { Button } from "@/components/ui/button";`
- [src/components/app/roto-metallic-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roto-metallic-production-form.tsx:7): `import { Input } from "@/components/ui/input";`
- [src/components/app/roto-metallic-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roto-metallic-production-form.tsx:8): `import { Label } from "@/components/ui/label";`
- [src/components/app/roto-metallic-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roto-metallic-production-form.tsx:9): `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";`
- [src/components/app/roto-metallic-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roto-metallic-production-form.tsx:10): `import { Badge } from "@/components/ui/badge";`
- [src/components/app/roto-metallic-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/roto-metallic-production-form.tsx:11): `import { isRedirectError } from "@/lib/utils";`
- [src/components/app/splash-remover.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/splash-remover.tsx:3): `import { useEffect } from "react";`
- [src/components/app/stage-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/stage-production-form.tsx:3): `import { useState } from "react";`
- [src/components/app/stage-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/stage-production-form.tsx:4): `import { saveStageProduction } from "@/app/(app)/_actions";`
- [src/components/app/stage-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/stage-production-form.tsx:5): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/components/app/stage-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/stage-production-form.tsx:6): `import { isRedirectError } from "@/lib/utils";`
- [src/components/app/stage-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/stage-production-form.tsx:7): `import { Input } from "@/components/ui/input";`
- [src/components/app/stage-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/stage-production-form.tsx:8): `import { Label } from "@/components/ui/label";`
- [src/components/app/stage-production-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/stage-production-form.tsx:9): `import { Textarea } from "@/components/ui/textarea";`
- [src/components/app/status-badge.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/status-badge.tsx:1): `import { Badge } from "@/components/ui/badge";`
- [src/components/app/user-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/user-form.tsx:3): `import { useTransition, useState } from "react";`
- [src/components/app/user-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/user-form.tsx:4): `import { createErpUser } from "@/app/(app)/_actions";`
- [src/components/app/user-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/user-form.tsx:5): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/components/app/user-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/user-form.tsx:6): `import { Input } from "@/components/ui/input";`
- [src/components/app/user-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/user-form.tsx:7): `import { Label } from "@/components/ui/label";`
- [src/components/app/user-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/user-form.tsx:8): `import { statusOptions } from "@/lib/modules";`
- [src/components/app/user-form.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/user-form.tsx:9): `import { showSuccess } from "@/lib/toast";`
- [src/components/app/user-row-actions.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/user-row-actions.tsx:3): `import { useTransition, useState } from "react";`
- [src/components/app/user-row-actions.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/user-row-actions.tsx:4): `import { changeUserPassword, linkEmployeeUser, deleteErpUser } from "@/app/(app)/_actions";`
- [src/components/app/user-row-actions.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/user-row-actions.tsx:5): `import { ConfirmSubmitButton } from "@/components/app/confirm-submit-button";`
- [src/components/app/user-row-actions.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/user-row-actions.tsx:6): `import { TableCell } from "@/components/ui/table";`
- [src/components/app/user-row-actions.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/user-row-actions.tsx:7): `import { StatusBadge } from "@/components/app/status-badge";`
- [src/components/app/user-row-actions.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/user-row-actions.tsx:8): `import { showSuccess } from "@/lib/toast";`
- [src/components/app/user-row-actions.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/app/user-row-actions.tsx:9): `import { Eye, EyeOff } from "lucide-react";`
- [src/components/ui/badge.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/ui/badge.tsx:1): `import * as React from "react";`
- [src/components/ui/badge.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/ui/badge.tsx:2): `import { cn } from "@/lib/utils";`
- [src/components/ui/button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/ui/button.tsx:1): `import * as React from "react";`
- [src/components/ui/button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/ui/button.tsx:2): `import { Slot } from "@radix-ui/react-slot";`
- [src/components/ui/button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/ui/button.tsx:3): `import { cva, type VariantProps } from "class-variance-authority";`
- [src/components/ui/button.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/ui/button.tsx:4): `import { cn } from "@/lib/utils";`
- [src/components/ui/card.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/ui/card.tsx:1): `import * as React from "react";`
- [src/components/ui/card.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/ui/card.tsx:2): `import { cn } from "@/lib/utils";`
- [src/components/ui/dialog.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/ui/dialog.tsx:3): `import * as React from "react";`
- [src/components/ui/dialog.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/ui/dialog.tsx:4): `import * as DialogPrimitive from "@radix-ui/react-dialog";`
- [src/components/ui/dialog.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/ui/dialog.tsx:5): `import { X } from "lucide-react";`
- [src/components/ui/dialog.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/ui/dialog.tsx:6): `import { cn } from "@/lib/utils";`
- [src/components/ui/empty-state.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/ui/empty-state.tsx:1): `import { Inbox } from "lucide-react";`
- [src/components/ui/input.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/ui/input.tsx:1): `import * as React from "react";`
- [src/components/ui/input.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/ui/input.tsx:2): `import { cn } from "@/lib/utils";`
- [src/components/ui/label.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/ui/label.tsx:1): `import * as React from "react";`
- [src/components/ui/label.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/ui/label.tsx:2): `import * as LabelPrimitive from "@radix-ui/react-label";`
- [src/components/ui/label.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/ui/label.tsx:3): `import { cn } from "@/lib/utils";`
- [src/components/ui/select.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/ui/select.tsx:3): `import * as React from "react";`
- [src/components/ui/select.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/ui/select.tsx:4): `import * as SelectPrimitive from "@radix-ui/react-select";`
- [src/components/ui/select.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/ui/select.tsx:5): `import { Check, ChevronDown } from "lucide-react";`
- [src/components/ui/select.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/ui/select.tsx:6): `import { cn } from "@/lib/utils";`
- [src/components/ui/table.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/ui/table.tsx:1): `import * as React from "react";`
- [src/components/ui/table.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/ui/table.tsx:2): `import { cn } from "@/lib/utils";`
- [src/components/ui/textarea.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/ui/textarea.tsx:1): `import * as React from "react";`
- [src/components/ui/textarea.tsx](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/components/ui/textarea.tsx:2): `import { cn } from "@/lib/utils";`
- [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:1): `import { cache } from "react";`
- [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:2): `import { redirect } from "next/navigation";`
- [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:3): `import { createClient } from "@/lib/supabase/server";`
- [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:4): `import { navGroups } from "@/lib/navigation";`
- [src/lib/auth.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/auth.ts:5): `import type { AppUser, RoleName } from "@/lib/database.types";`
- [src/lib/master-query.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/master-query.ts:1): `import type { ModuleConfig } from "@/lib/modules";`
- [src/lib/modules.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/modules.ts:1): `import type { Database, RoleName } from "@/lib/database.types";`
- [src/lib/navigation.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/navigation.ts:1): `import type { RoleName } from "@/lib/database.types";`
- [src/lib/supabase/middleware.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/middleware.ts:1): `import { createServerClient } from "@supabase/ssr";`
- [src/lib/supabase/middleware.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/middleware.ts:2): `import { NextResponse, type NextRequest } from "next/server";`
- [src/lib/supabase/middleware.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/middleware.ts:3): `import type { Database } from "@/lib/database.types";`
- [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:1): `import { cookies } from "next/headers";`
- [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:2): `import { createServerClient } from "@supabase/ssr";`
- [src/lib/supabase/server.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/supabase/server.ts:3): `import type { Database } from "@/lib/database.types";`
- [src/lib/utils.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/utils.ts:1): `import { clsx, type ClassValue } from "clsx";`
- [src/lib/utils.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/src/lib/utils.ts:2): `import { twMerge } from "tailwind-merge";`
- [tailwind.config.ts](C:/Users/spsch/Downloads/ERP-main/ERP-main/tailwind.config.ts:1): `import type { Config } from "tailwindcss";`

