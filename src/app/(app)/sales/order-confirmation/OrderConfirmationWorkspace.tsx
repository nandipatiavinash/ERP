"use client";

import { useState, useTransition, useMemo } from "react";
import { Check, Printer, ChevronRight, ChevronDown, Search, Trash2, Package, RotateCcw } from "lucide-react";
import { confirmMultipleSalesDeliveries, deleteSalesOrderItem } from "@/app/(app)/_actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/app/status-badge";
import { Label } from "@/components/ui/label";
import { formatNumber, formatDate } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SalesPrintView } from "@/components/app/sales-print-view";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DateFilter } from "@/components/app/date-filter";
import { EmptyState } from "@/components/ui/empty-state";
import { todayInIndia } from "@/lib/utils";

type Roll = {
  id: string;
  roll_number: string;
  meters: number;
  weight: number;
  status: string;
  fabric_type_id: string;
  looms?: { loom_number: string } | null;
  loom_production_entries?: {
    gross_weight: number;
    core_weight: number;
    net_weight: number;
    net_meters: number;
    average_meter_weight: number;
  } | null;
};

type OrderItem = {
  id: string;
  sales_order_id: string;
  department: string;
  product_id: string;
  quantity: number;
  selected_roll_ids: string[];
};

type Customer = {
  id: string;
  customer_name: string;
  alias?: string;
  phone?: string;
  gst_number?: string;
  address?: string;
  is_internal: string;
  status: string;
};

type SalesOrder = {
  id: string;
  order_number: string;
  order_date: string;
  customer_id: string;
  status: string;
  created_at: string;
  customers?: Customer;
  sales_order_items?: OrderItem[];
};

interface OrderConfirmationWorkspaceProps {
  orders: SalesOrder[];
  confirmedOrders?: SalesOrder[];
  fabrics: { id: string; fabric_name: string }[];
  rotoProducts: { id: string; brand: string; width: number; height: number }[];
  offsetProducts: { id: string; brand: string; width: number; height: number }[];
  rolls: Roll[];
  date?: string;
  initialOrderId?: string;
  singleViewMode?: boolean;
}

function getRollSerialValue(rollNumber: string) {
  const matches = rollNumber.match(/\d+/g);
  const lastNumber = matches?.at(-1);
  return lastNumber ? Number(lastNumber) : Number.POSITIVE_INFINITY;
}

function sortRollsBySerial(a: Roll, b: Roll) {
  const serialDiff = getRollSerialValue(a.roll_number) - getRollSerialValue(b.roll_number);
  if (serialDiff !== 0) return serialDiff;
  return a.roll_number.localeCompare(b.roll_number, undefined, { numeric: true, sensitivity: "base" });
}

export function OrderConfirmationWorkspace({
  orders, // Draft orders
  confirmedOrders = [], // Confirmed orders
  fabrics,
  rotoProducts,
  offsetProducts,
  rolls,
  date = todayInIndia(),
  initialOrderId,
  singleViewMode = false,
}: OrderConfirmationWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"pending" | "confirmed">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Compute initial orders and items for single view mode
  const initialCustomerOrders = useMemo(() => {
    if (singleViewMode && orders.length > 0) {
      const customerId = orders[0].customer_id;
      return orders.filter((o) => o.customer_id === customerId && o.status === "draft");
    }
    return [];
  }, [singleViewMode, orders]);

  const initialItems = useMemo(() => {
    return initialCustomerOrders.flatMap((o) => o.sales_order_items ?? []);
  }, [initialCustomerOrders]);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(() => {
    if (singleViewMode && orders.length > 0) {
      return orders[0].customer_id;
    }
    return null;
  });

  // Roll allocation state: Record<itemId, rollId[]>
  const [allocation, setAllocation] = useState<Record<string, string[]>>(() => {
    const initialAlloc: Record<string, string[]> = {};
    initialItems.forEach((item) => {
      initialAlloc[item.id] = item.selected_roll_ids || [];
    });
    return initialAlloc;
  });

  // Selected items state (which draft items we are delivering now)
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(() => {
    return initialItems.map((i) => i.id);
  });

  // Expanded items state: Record<itemId, boolean>
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(() => {
    const initialExpand: Record<string, boolean> = {};
    initialItems.forEach((item) => {
      initialExpand[item.id] = item.department === "fabric";
    });
    return initialExpand;
  });

  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [itemRemainingActions, setItemRemainingActions] = useState<Record<string, "backorder" | "close">>(() => {
    const initialRemaining: Record<string, "backorder" | "close"> = {};
    initialItems.forEach((item) => {
      initialRemaining[item.id] = "close";
    });
    return initialRemaining;
  });
  const [printOrderId, setPrintOrderId] = useState<string | null>(null);
  const [isDraftPrint, setIsDraftPrint] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(todayInIndia());

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  // Resolve product name helper
  const getProductName = (dept: string, productId: string) => {
    if (dept === "fabric") {
      const f = fabrics.find((x) => x.id === productId);
      return f ? f.fabric_name : "Fabric Product";
    } else if (dept === "roto-printing") {
      const r = rotoProducts.find((x) => x.id === productId);
      return r ? `${r.brand} (${r.width}x${r.height} in)` : "Roto Product";
    } else if (dept === "offset-printing") {
      const o = offsetProducts.find((x) => x.id === productId);
      return o ? `${o.brand} (${o.width}x${o.height} in)` : "Offset Product";
    } else if (dept === "lamination") {
      return productId === "lam-film-25" ? "Laminated Film 2.5 mil" : "Laminated Film 3.0 mil";
    } else if (dept === "finishing") {
      return productId === "finished-bags-28" ? "Finished Bags W-28" : "Finished Bags W-32";
    }
    return "Unknown Product";
  };

  // Group draft orders by customer
  const draftCustomers = useMemo(() => {
    const map: Record<string, { customer: Customer; orders: SalesOrder[] }> = {};
    for (const order of orders) {
      if (order.status !== "draft") continue;
      const cust = order.customers;
      if (!cust) continue;
      if (!map[cust.id]) {
        map[cust.id] = { customer: cust, orders: [] };
      }
      map[cust.id].orders.push(order);
    }
    return Object.values(map).filter((item) => {
      const query = searchTerm.toLowerCase();
      return (
        item.customer.customer_name.toLowerCase().includes(query) ||
        item.customer.alias?.toLowerCase().includes(query)
      );
    });
  }, [orders, searchTerm]);

  // Selected customer's draft orders and items
  const activeCustomerOrders = useMemo(() => {
    if (!selectedCustomerId) return [];
    return orders.filter((o) => o.customer_id === selectedCustomerId && o.status === "draft");
  }, [selectedCustomerId, orders]);

  const activeCustomerItems = useMemo(() => {
    return activeCustomerOrders.flatMap((o) => o.sales_order_items ?? []);
  }, [activeCustomerOrders]);

  // Initialize allocation/expansion when customer is selected
  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setErrorMsg(null);
    setSuccessMsg(null);
    setExpandedOrderId(null);
    setDeliveryDate(todayInIndia());

    const customerOrders = orders.filter((o) => o.customer_id === customerId && o.status === "draft");
    const items = customerOrders.flatMap((o) => o.sales_order_items ?? []);

    const initialAlloc: Record<string, string[]> = {};
    const initialExpand: Record<string, boolean> = {};
    const initialRemaining: Record<string, "backorder" | "close"> = {};

    items.forEach((item) => {
      initialAlloc[item.id] = item.selected_roll_ids || [];
      initialExpand[item.id] = item.department === "fabric";
      initialRemaining[item.id] = "close";
    });

    setAllocation(initialAlloc);
    setExpandedItems(initialExpand);
    setItemRemainingActions(initialRemaining);
    setSelectedItemIds(items.map((i) => i.id)); // Select all items by default
  };

  // Toggle item checking
  const toggleSelectItem = (itemId: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  // Toggle roll selection
  const toggleRoll = (itemId: string, rollId: string) => {
    setAllocation((prev) => {
      const current = prev[itemId] || [];
      const updated = current.includes(rollId)
        ? current.filter((id) => id !== rollId)
        : [...current, rollId];
      return { ...prev, [itemId]: updated };
    });
  };

  // Toggle expansion for an item card
  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  // Confirm delivery action
  const handleConfirmDeliveries = () => {
    if (selectedItemIds.length === 0) {
      setErrorMsg("Please select at least one item to confirm delivery.");
      return;
    }
    setErrorMsg(null);
    setSuccessMsg(null);

    startTransition(async () => {
      try {
        await confirmMultipleSalesDeliveries(selectedItemIds, allocation, itemRemainingActions, deliveryDate);
        setSuccessMsg("Deliveries confirmed successfully! You can print the dispatch sheet below.");
        
        // Locate one of the parent orders that was confirmed to enable printing
        const confirmedOrder = activeCustomerOrders.find((o) =>
          (o.sales_order_items ?? []).some((item) => selectedItemIds.includes(item.id))
        );
        if (confirmedOrder) {
          setPrintOrderId(confirmedOrder.id);
        }

        setSelectedItemIds([]);
        setAllocation({});
        setSelectedCustomerId(null);
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to confirm sales delivery.");
      }
    });
  };

  const handleDeleteItem = (itemId: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setDeleteItemId(null);

    startTransition(async () => {
      try {
        await deleteSalesOrderItem(itemId);
        setSuccessMsg("Item deleted successfully!");
        setSelectedItemIds((prev) => prev.filter((id) => id !== itemId));
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to delete item.");
      }
    });
  };

  const getItemRolls = (item: OrderItem) => {
    if (item.department !== "fabric") return [];
    return rolls
      .filter(
        (r) =>
          r.fabric_type_id === item.product_id &&
          (r.status === "available" || item.selected_roll_ids?.includes(r.id) || (allocation[item.id] ?? []).includes(r.id))
      )
      .sort(sortRollsBySerial);
  };

  // Build product groups for print view
  const printOrder = useMemo(() => {
    if (!printOrderId) return null;
    const pending = orders.find((o) => o.id === printOrderId);
    if (pending) return pending;
    const confirmed = confirmedOrders.find((o) => o.id === printOrderId);
    return confirmed || null;
  }, [printOrderId, orders, confirmedOrders]);

  type ProductGroup = {
    itemId: string;
    productId: string;
    productName: string;
    department: string;
    rolls: any[];
    totalNetWeight: number;
    totalMeters: number;
  };

  const buildProductGroups = (order: SalesOrder, rolls: Roll[], fabrics: any[]): ProductGroup[] => {
    return (order.sales_order_items ?? []).map((item) => {
      const rollsData = (item.selected_roll_ids ?? []).map((rollId) => {
        const roll = rolls.find((r) => r.id === rollId);
        if (!roll) return null;
        const prod = roll.loom_production_entries;
        return {
          roll_number: roll.roll_number,
          gross_weight: prod?.gross_weight ?? roll.weight ?? 0,
          core_weight: prod?.core_weight ?? 0,
          net_weight: prod?.net_weight ?? (roll.weight ?? 0),
          net_meters: prod?.net_meters ?? (roll.meters ?? 0),
          average_meter_weight: prod?.average_meter_weight ?? 0,
        };
      }).filter(Boolean) as any[];

      const totalNetWeight = rollsData.reduce((s, r) => s + r.net_weight, 0);
      const totalMeters = rollsData.reduce((s, r) => s + r.net_meters, 0);

      return {
        itemId: item.id,
        productId: item.product_id,
        productName: getProductName(item.department, item.product_id),
        department: item.department,
        rolls: rollsData,
        totalNetWeight,
        totalMeters,
      };
    });
  };

  const printGroups = useMemo(() => {
    return printOrder ? buildProductGroups(printOrder, rolls, fabrics) : [];
  }, [printOrder, rolls, fabrics]);

  const printRollsByProduct = useMemo(() => {
    const map: Record<string, any[]> = {};
    for (const g of printGroups) {
      map[g.productName] = g.rolls;
    }
    return map;
  }, [printGroups]);

  // stagedPrintOrder representing currently selected rolls and items in workspace
  const stagedPrintOrder = useMemo(() => {
    if (!selectedCustomerId) return null;
    const customerOrders = orders.filter((o) => o.customer_id === selectedCustomerId && o.status === "draft");
    const firstOrder = customerOrders[0];
    if (!firstOrder) return null;

    const selectedItems = customerOrders
      .flatMap((o) => o.sales_order_items ?? [])
      .filter((item) => selectedItemIds.includes(item.id))
      .map((item) => ({
        ...item,
        selected_roll_ids: allocation[item.id] ?? [],
      }));

    return {
      ...firstOrder,
      order_number: "DRAFT-" + Array.from(new Set(customerOrders.map((o) => o.order_number))).join("/"),
      sales_order_items: selectedItems,
    };
  }, [selectedCustomerId, orders, selectedItemIds, allocation]);

  const stagedPrintGroups = useMemo(() => {
    return stagedPrintOrder ? buildProductGroups(stagedPrintOrder as any, rolls, fabrics) : [];
  }, [stagedPrintOrder, rolls, fabrics]);

  const stagedPrintRollsByProduct = useMemo(() => {
    const map: Record<string, any[]> = {};
    for (const g of stagedPrintGroups) {
      map[g.productName] = g.rolls;
    }
    return map;
  }, [stagedPrintGroups]);

  // Calculate sum of weights of all currently selected rolls across checked items
  const totalSelectedWeight = useMemo(() => {
    if (!selectedCustomerId) return 0;
    let sum = 0;
    activeCustomerItems.forEach((item) => {
      if (!selectedItemIds.includes(item.id)) return;
      const selectedIds = allocation[item.id] || [];
      const itemRolls = rolls.filter((r) => selectedIds.includes(r.id));
      sum += itemRolls.reduce((s, r) => s + Number(r.weight || 0), 0);
    });
    return sum;
  }, [selectedCustomerId, selectedItemIds, allocation, rolls, activeCustomerItems]);

  // Group activeCustomerItems by order for the workspace rendering
  const activeCustomerOrdersWithItems = useMemo(() => {
    if (!selectedCustomerId) return [];
    return activeCustomerOrders.map((order) => {
      const items = (order.sales_order_items ?? []);
      return {
        order,
        items,
      };
    }).filter(group => group.items.length > 0);
  }, [selectedCustomerId, activeCustomerOrders]);

  // Group currently selected items by order for the confirmation dialog
  const selectedItemsSummary = useMemo(() => {
    if (!selectedCustomerId) return [];
    
    return activeCustomerOrders.map((order) => {
      const items = (order.sales_order_items ?? [])
        .filter((item) => selectedItemIds.includes(item.id))
        .map((item) => {
          const selectedIds = allocation[item.id] || [];
          const selectedRolls = rolls.filter((r) => selectedIds.includes(r.id));
          const totalWeight = selectedRolls.reduce((sum, r) => sum + Number(r.weight || 0), 0);
          
          return {
            ...item,
            productName: getProductName(item.department, item.product_id),
            rollsCount: item.department === "fabric" ? selectedRolls.length : 0,
            weight: item.department === "fabric" ? totalWeight : item.quantity,
          };
        });
      
      return {
        order,
        items,
      };
    }).filter(group => group.items.length > 0);
  }, [selectedCustomerId, activeCustomerOrders, selectedItemIds, allocation, rolls]);

  // If print view is active, show only that
  if (printOrderId && printOrder) {
    return (
      <div>
        <Button variant="outline" className="mb-4 no-print" onClick={() => setPrintOrderId(null)}>
          ← Back to Delivery Entry
        </Button>
        <SalesPrintView order={printOrder as any} rollsByProduct={printRollsByProduct} />
      </div>
    );
  }

  if (isDraftPrint && stagedPrintOrder) {
    return (
      <div>
        <Button variant="outline" className="mb-4 no-print" onClick={() => setIsDraftPrint(false)}>
          ← Back to Delivery Workspace
        </Button>
        <div className="mb-4 p-3.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg no-print">
          <strong>Draft Mode:</strong> This is a preview of the dispatch note with currently selected rolls. It has not been saved or confirmed yet.
        </div>
        <SalesPrintView order={stagedPrintOrder as any} rollsByProduct={stagedPrintRollsByProduct} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Workspace Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 no-print">
        <button
          onClick={() => { setActiveTab("pending"); setErrorMsg(null); setSuccessMsg(null); setSelectedCustomerId(null); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
            activeTab === "pending"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Package className="h-4 w-4" />
          Pending Confirmation ({orders.length})
        </button>
        <button
          onClick={() => { setActiveTab("confirmed"); setErrorMsg(null); setSuccessMsg(null); setSelectedCustomerId(null); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
            activeTab === "confirmed"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <RotateCcw className="h-4 w-4" />
          Confirmed Deliveries ({confirmedOrders.length})
        </button>
      </div>

      {activeTab === "pending" ? (
        <div className="flex flex-col xl:flex-row gap-6 items-stretch">
          {/* Left Panel: Customer list with draft orders */}
          {!singleViewMode && (
            <div className="w-full xl:w-80 shrink-0 flex flex-col gap-4 no-print">
              <Card className="h-[calc(100vh-14rem)] flex flex-col overflow-hidden">
                <CardHeader className="p-4 border-b">
                  <CardTitle className="text-base font-bold">Select Customer</CardTitle>
                  <div className="relative mt-2">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search customer..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-9 w-full rounded-md border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </CardHeader>
                <div className="flex-1 overflow-y-auto divide-y divide-border">
                  {draftCustomers.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">No draft orders found</div>
                  ) : (
                    draftCustomers.map((group) => {
                      const isSelected = group.customer.id === selectedCustomerId;
                      const totalItems = group.orders.reduce((sum, o) => sum + (o.sales_order_items?.length ?? 0), 0);
                      return (
                        <button
                          key={group.customer.id}
                          onClick={() => handleSelectCustomer(group.customer.id)}
                          className={`w-full text-left p-4 transition-colors hover:bg-muted/50 flex flex-col gap-1.5 ${
                            isSelected ? "bg-muted border-l-4 border-l-emerald-600 pl-3" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-emerald-950 truncate max-w-[180px]">
                              {group.customer.customer_name}
                            </span>
                            <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] px-2 py-0.5">
                              {group.orders.length} order{group.orders.length > 1 && "s"}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center justify-end">
                            <span>{totalItems} item{totalItems !== 1 && "s"}</span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </Card>
            </div>
          )}
 
          {/* Right Panel: Workspace */}
          <div className="flex-1 min-w-0 no-print">
            {!selectedCustomerId ? (
              <Card className="h-full flex items-center justify-center p-8 text-center border-dashed">
                <div className="max-w-md space-y-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <Printer className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-950">Select a Customer</h3>
                  <p className="text-sm text-muted-foreground">
                    Select a customer from the left sidebar to confirm dispatch, allocate fabric rolls, split orders, and print dispatch notes.
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Feedback notifications */}
                {errorMsg && (
                  <div className="p-3.5 bg-red-100 text-red-800 rounded-lg text-sm font-semibold">{errorMsg}</div>
                )}
                {successMsg && (
                  <div className="p-3.5 bg-emerald-100 text-emerald-800 rounded-lg text-sm font-semibold">{successMsg}</div>
                )}
 
                {/* Workspace Header */}
                <Card className="border-l-4 border-l-primary">
                  <CardHeader className="p-5 border-b flex flex-row items-center justify-between flex-wrap gap-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Confirm Delivery Workspace
                      </div>
                      <CardTitle className="text-xl font-black mt-1 text-emerald-950 flex flex-wrap items-center gap-3">
                        <span>{orders.find((o) => o.customer_id === selectedCustomerId)?.customers?.customer_name}</span>
                        {totalSelectedWeight > 0 && (
                          <span className="text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                            Selected Weight: {formatNumber(totalSelectedWeight, 2)} kg
                          </span>
                        )}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        Select products across draft orders, allocate fabric rolls, split and confirm delivery.
                      </p>
                    </div>
                     <div className="flex gap-3 items-end flex-wrap">
                      <div className="flex flex-col gap-1 no-print">
                        <Label className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                          Delivery Date
                        </Label>
                        <input
                          type="date"
                          value={deliveryDate}
                          onChange={(e) => setDeliveryDate(e.target.value)}
                          className="h-9 px-3 rounded-md border border-slate-200 bg-background text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary w-40"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDraftPrint(true)}
                        disabled={selectedItemIds.length === 0}
                        className="h-9 border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold gap-1.5"
                      >
                        <Printer className="h-4 w-4" />
                        Print Draft Dispatch
                      </Button>
                      <button
                        type="button"
                        onClick={() => setShowConfirmModal(true)}
                        disabled={isPending || selectedItemIds.length === 0}
                        className="inline-flex h-9 items-center justify-center rounded-md bg-emerald-600 px-5 text-sm font-semibold text-white shadow hover:bg-emerald-700 transition-colors disabled:opacity-50"
                      >
                        {isPending ? "Confirming..." : "Confirm Delivery & Print"}
                      </button>
                    </div>
                  </CardHeader>
 
                  <CardContent className="p-5 space-y-6">
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Draft Products Staged for Delivery
                    </div>
 
                    <div className="space-y-4">
                      {activeCustomerOrdersWithItems.map(({ order, items }) => {
                        const isOrderExpanded = expandedOrderId === order.id;

                        return (
                          <div
                            key={order.id}
                            className="border rounded-xl bg-white overflow-hidden shadow-sm transition-all"
                          >
                            {/* Order Header / Accordion Trigger */}
                            <button
                              type="button"
                              onClick={() => toggleOrderExpand(order.id)}
                              className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors text-left border-b border-slate-200/80"
                            >
                              <div className="flex items-center gap-3">
                                {isOrderExpanded ? (
                                  <ChevronDown className="h-5 w-5 text-slate-500" />
                                ) : (
                                  <ChevronRight className="h-5 w-5 text-slate-500" />
                                )}
                                <div>
                                  <span className="font-bold text-sm text-slate-900">Order #{order.order_number}</span>
                                  <span className="ml-3 text-xs text-muted-foreground font-mono">
                                    Date: {formatDate(order.order_date)}
                                  </span>
                                </div>
                              </div>
                              <div className="text-xs text-slate-500 font-semibold bg-slate-100 px-2 py-1 rounded-md">
                                {items.length} item{items.length !== 1 ? "s" : ""}
                              </div>
                            </button>

                            {/* Staged items for this order */}
                            {isOrderExpanded && (
                              <div className="p-4 space-y-4 bg-slate-50/10">
                                {items.map((item) => {
                                  const itemRolls = getItemRolls(item);
                                  const selectedIds = allocation[item.id] || [];
                                  const selectedRolls = itemRolls.filter((r) => selectedIds.includes(r.id));

                                  const totalMeters = selectedRolls.reduce((sum, r) => sum + Number(r.meters || 0), 0);
                                  const totalWeight = selectedRolls.reduce((sum, r) => sum + Number(r.weight || 0), 0);

                                  const isExpanded = !!expandedItems[item.id];
                                  const isChecked = selectedItemIds.includes(item.id);
                                  const prodName = getProductName(item.department, item.product_id);
                                  const parentOrderNo = order.order_number;

                                  return (
                                    <div
                                      key={item.id}
                                      className={`border rounded-lg overflow-hidden bg-card shadow-sm transition-colors ${
                                        isChecked ? "border-emerald-200" : "opacity-75"
                                      }`}
                                    >
                                      {/* Card Header */}
                                      <div className="p-4 bg-muted/20 border-b flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                          <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => toggleSelectItem(item.id)}
                                            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => toggleExpand(item.id)}
                                            className="flex items-center gap-1.5 text-left min-w-0"
                                          >
                                            {isExpanded ? (
                                              <ChevronDown className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                                            ) : (
                                              <ChevronRight className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                                            )}
                                            <div className="truncate">
                                              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block">
                                                {item.department} · Order #{parentOrderNo}
                                              </span>
                                              <span className="font-bold text-sm text-emerald-950 block sm:inline">
                                                {prodName}
                                              </span>
                                            </div>
                                          </button>
                                        </div>

                                        <div className="flex items-center gap-4 shrink-0 text-xs">
                                          <div className="text-right">
                                            <span className="text-muted-foreground block">Needed</span>
                                            <span className="font-bold">{formatNumber(item.quantity)} kg</span>
                                          </div>
                                          {isChecked && item.department === "fabric" && (
                                            <div className="text-right">
                                              <span className="text-muted-foreground block">Selected</span>
                                              <span className={`font-bold ${totalWeight >= item.quantity ? "text-emerald-700" : "text-amber-700"}`}>
                                                {formatNumber(totalWeight)} kg
                                              </span>
                                            </div>
                                          )}
                                          <button
                                            type="button"
                                            onClick={() => setDeleteItemId(item.id)}
                                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </button>
                                        </div>
                                      </div>

                                      {/* Card Content */}
                                      {isExpanded && isChecked && (
                                        <div className="p-4 space-y-4 border-t bg-slate-50/20">
                                          {item.department === "fabric" && (
                                            <div className="grid grid-cols-3 gap-4 bg-muted/40 p-3 rounded-lg text-xs font-semibold">
                                              <div>
                                                <div className="text-muted-foreground text-[10px]">Selected Rolls</div>
                                                <div>{selectedRolls.length} rolls</div>
                                              </div>
                                              <div>
                                                <div className="text-muted-foreground text-[10px]">Selected Weight</div>
                                                <div>{formatNumber(totalWeight, 2)} kg</div>
                                              </div>
                                              <div>
                                                <div className="text-muted-foreground text-[10px]">Selected Meters</div>
                                                <div>{formatNumber(totalMeters, 2)} m</div>
                                              </div>
                                            </div>
                                          )}

                                          {/* Partial Order Checkbox */}
                                          {item.department === "fabric" && totalWeight < item.quantity && (
                                            <div className="flex items-center gap-2 bg-amber-50/50 border border-amber-200/60 p-3 rounded-lg text-xs">
                                              <input
                                                type="checkbox"
                                                id={`partial-order-checkbox-${item.id}`}
                                                checked={(itemRemainingActions[item.id] ?? "close") === "backorder"}
                                                onChange={(e) => {
                                                  setItemRemainingActions((prev) => ({
                                                    ...prev,
                                                    [item.id]: e.target.checked ? "backorder" : "close",
                                                  }));
                                                }}
                                                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                              />
                                              <Label htmlFor={`partial-order-checkbox-${item.id}`} className="font-semibold text-slate-800 cursor-pointer select-none">
                                                Create Partial Order for this item (Remaining {formatNumber(item.quantity - totalWeight, 2)} kg backordered)
                                              </Label>
                                            </div>
                                          )}

                                          {/* Roll Selector Grid */}
                                          {item.department !== "fabric" ? (
                                            <div className="text-xs text-muted-foreground py-3 text-center border border-dashed rounded-lg bg-white">
                                              Marked ready for dispatch automatically.
                                            </div>
                                          ) : itemRolls.length === 0 ? (
                                            <div className="text-xs text-muted-foreground py-3 text-center border border-dashed rounded-lg bg-white">
                                              No available rolls in stock for this fabric type.
                                            </div>
                                          ) : (
                                            <div className="space-y-2">
                                              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                                Select fabric rolls from stock:
                                              </Label>
                                              <div className="overflow-x-auto border rounded-lg bg-white">
                                                <table className="w-full text-left border-collapse text-xs">
                                                  <thead>
                                                    <tr className="bg-slate-100/50 border-b text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                                      <th className="p-2.5 w-10 text-center">Select</th>
                                                      <th className="p-2.5">Roll No</th>
                                                      <th className="p-2.5 text-right">Net W8 (kg)</th>
                                                      <th className="p-2.5 text-right">Mtrs</th>
                                                      <th className="p-2.5">Loom</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody className="divide-y">
                                                    {itemRolls.map((roll) => {
                                                      const isSelected = selectedIds.includes(roll.id);
                                                      const loomNo = roll.looms?.loom_number ?? "-";
                                                      return (
                                                        <tr
                                                          key={roll.id}
                                                          onClick={() => toggleRoll(item.id, roll.id)}
                                                          className={`cursor-pointer hover:bg-slate-50/50 transition-colors ${
                                                            isSelected ? "bg-emerald-50/20" : ""
                                                          }`}
                                                        >
                                                          <td className="p-2.5 text-center" onClick={(e) => e.stopPropagation()}>
                                                            <input
                                                              type="checkbox"
                                                              checked={isSelected}
                                                              onChange={() => toggleRoll(item.id, roll.id)}
                                                              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                                            />
                                                          </td>
                                                          <td className="p-2.5 font-mono font-semibold text-slate-800">{roll.roll_number}</td>
                                                          <td className="p-2.5 text-right font-mono font-semibold">{formatNumber(roll.weight, 2)}</td>
                                                          <td className="p-2.5 text-right font-mono">{formatNumber(roll.meters, 0)}</td>
                                                          <td className="p-2.5 font-medium">{loomNo}</td>
                                                        </tr>
                                                      );
                                                    })}
                                                  </tbody>
                                                </table>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* TAB 2: Confirmed Deliveries */
        <div className="space-y-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50/30">
            <CardHeader className="pb-3 flex flex-row items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Check className="h-5 w-5 text-emerald-600" />
                  Confirmed Deliveries
                  <Badge className="ml-2 bg-emerald-50 text-emerald-700 border-emerald-200">
                    {confirmedOrders.length}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Confirmed dispatches for the selected date.</p>
              </div>
              <DateFilter date={date} baseUrl="/sales/order-confirmation?tab=completed" />
            </CardHeader>
            <CardContent>
              {confirmedOrders.length === 0 ? (
                <EmptyState
                  title="No confirmed deliveries today"
                  description="Deliveries confirmed on this date will appear here."
                />
              ) : (
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50">
                        <TableHead className="text-xs font-bold">Order Number</TableHead>
                        <TableHead className="text-xs font-bold">Firm Name</TableHead>
                        <TableHead className="text-xs font-bold">Items Count</TableHead>
                        <TableHead className="text-xs font-bold">Order Date</TableHead>
                        <TableHead className="text-xs font-bold text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {confirmedOrders.map((order) => (
                        <TableRow key={order.id} className="hover:bg-slate-50/30">
                          <TableCell className="font-bold text-emerald-950">{order.order_number}</TableCell>
                          <TableCell className="font-medium">
                            {order.customers?.customer_name}
                          </TableCell>
                          <TableCell>{order.sales_order_items?.length ?? 0} items</TableCell>
                          <TableCell>{formatDate(order.order_date)}</TableCell>
                          <TableCell className="text-center">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 gap-1.5 text-xs font-medium"
                              onClick={() => setPrintOrderId(order.id)}
                            >
                              <Printer className="h-3 w-3" />
                              Print Dispatch Note
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Item Dialog */}
      <Dialog open={deleteItemId !== null} onOpenChange={(open) => { if (!open) setDeleteItemId(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Item from Order?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item from the order? Any allocated rolls will be released.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setDeleteItemId(null)}
              className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-semibold hover:bg-accent transition-colors"
            >
              No
            </button>
            <button
              type="button"
              onClick={() => {
                if (deleteItemId) {
                  handleDeleteItem(deleteItemId);
                }
              }}
              disabled={isPending}
              className="inline-flex h-9 items-center justify-center rounded-md bg-destructive px-4 text-sm font-semibold text-white hover:bg-destructive/90 transition-colors disabled:opacity-50"
            >
              Yes, Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Delivery Dialog */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-emerald-950 font-bold">Confirm Delivery Dispatch</DialogTitle>
            <DialogDescription>
              Review the items and fabric rolls staged for dispatch on <strong className="text-slate-800">{formatDate(deliveryDate)}</strong> (this will consolidate them into a single dispatch note):
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[350px] overflow-y-auto my-3 pr-1">
            {selectedItemsSummary.map(({ order, items }) => (
              <div key={order.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                <div className="text-xs font-bold text-slate-800 mb-2 border-b pb-1">
                  Order #{order.order_number} ({formatDate(order.order_date)})
                </div>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start text-xs">
                      <div>
                        <span className="font-semibold text-slate-700">{item.productName}</span>
                        <span className="text-slate-500 capitalize ml-1">({item.department})</span>
                      </div>
                      <div className="text-right font-mono font-medium">
                        {item.department === "fabric" ? (
                          <span>{item.rollsCount} roll{item.rollsCount !== 1 ? "s" : ""} · {formatNumber(item.weight, 2)} kg</span>
                        ) : (
                          <span>{formatNumber(item.weight, 2)} units</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setShowConfirmModal(false)}
              className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-background px-4 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setShowConfirmModal(false);
                handleConfirmDeliveries();
              }}
              disabled={isPending}
              className="inline-flex h-9 items-center justify-center rounded-md bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {isPending ? "Confirming..." : "Yes, Confirm & Print"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
