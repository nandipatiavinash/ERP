"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart, Search, Trash2, Plus, Minus, CheckCircle2,
  AlertCircle, X, Layers, Tag, ChevronRight, Package
} from "lucide-react";
import { createClientOrder, ClientOrderItemPayload } from "@/app/(app)/_actions/client-orders";

type FabricProduct = {
  id: string;
  fabric_name: string;
  gsm: number;
  width: number;
  selling_price: number;
  image_url?: string | null;
  customer_id?: string | null;
};

type FinishingProduct = {
  id: string;
  name: string;
  selling_price: number;
  image_url?: string | null;
  description?: string | null;
  dimensions?: string | null;
  customer_id?: string | null;
};

type CartItem = {
  id: string;
  productId: string;
  itemType: "fabric" | "finishing";
  name: string;
  details: string;
  quantity: number;
  unitPrice: number;
  unit: string;
};

type Props = {
  fabricTypes: FabricProduct[];
  finishingProducts: FinishingProduct[];
  customerId: string | null;
};

function ProductCard({
  name,
  details,
  price,
  isBranded,
  onAddToCart,
}: {
  name: string;
  details: string;
  price: number;
  isBranded: boolean;
  onAddToCart: () => void;
}) {
  return (
    <div className="group relative rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20 transition-all duration-200 overflow-hidden">
      {isBranded && (
        <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 z-10">
          YOUR BRAND
        </div>
      )}
      <div className="p-4">
        <div className="h-24 rounded-lg bg-gradient-to-br from-white/5 to-white/2 border border-white/5 flex items-center justify-center mb-3">
          <Package className="h-10 w-10 text-slate-600" />
        </div>
        <h3 className="text-sm font-bold text-white mb-0.5 truncate" title={name}>{name}</h3>
        <p className="text-[11px] text-slate-400 mb-3">{details}</p>
        <div className="flex items-center justify-between">
          {price > 0 ? (
            <span className="text-sm font-bold text-emerald-400">₹{price.toLocaleString("en-IN")}</span>
          ) : (
            <span className="text-xs text-slate-500 italic">Quote on request</span>
          )}
          <button
            onClick={onAddToCart}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all"
          >
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

export function PortalCatalogView({ fabricTypes, finishingProducts, customerId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "fabric" | "finishing">("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Quantity dialog
  const [qtyDialog, setQtyDialog] = useState<{
    productId: string;
    itemType: "fabric" | "finishing";
    name: string;
    details: string;
    unitPrice: number;
    unit: string;
  } | null>(null);
  const [inputQty, setInputQty] = useState("1");

  const allProducts = useMemo(() => {
    const list: Array<{
      id: string; productId: string; itemType: "fabric" | "finishing";
      name: string; details: string; price: number; isBranded: boolean; unit: string;
    }> = [];

    if (tab === "all" || tab === "fabric") {
      fabricTypes.forEach((f) => list.push({
        id: f.id,
        productId: f.id,
        itemType: "fabric",
        name: f.fabric_name,
        details: `${f.gsm} GSM · ${f.width} cm width`,
        price: f.selling_price,
        isBranded: !!f.customer_id,
        unit: "m",
      }));
    }
    if (tab === "all" || tab === "finishing") {
      finishingProducts.forEach((p) => list.push({
        id: p.id,
        productId: p.id,
        itemType: "finishing",
        name: p.name,
        details: [p.dimensions, p.description].filter(Boolean).join(" · ") || "Finished product",
        price: p.selling_price,
        isBranded: !!p.customer_id,
        unit: "pcs",
      }));
    }

    if (!search) return list;
    const q = search.toLowerCase();
    return list.filter((p) => p.name.toLowerCase().includes(q) || p.details.toLowerCase().includes(q));
  }, [fabricTypes, finishingProducts, tab, search]);

  const openAddDialog = (p: typeof allProducts[0]) => {
    setInputQty("1");
    setQtyDialog({
      productId: p.productId,
      itemType: p.itemType,
      name: p.name,
      details: p.details,
      unitPrice: p.price,
      unit: p.unit,
    });
  };

  const confirmAdd = () => {
    if (!qtyDialog) return;
    const qty = parseFloat(inputQty);
    if (isNaN(qty) || qty <= 0) return;

    setCart((prev) => {
      const existing = prev.find((c) => c.productId === qtyDialog.productId);
      if (existing) {
        return prev.map((c) => c.productId === qtyDialog.productId ? { ...c, quantity: c.quantity + qty } : c);
      }
      return [...prev, {
        id: `${qtyDialog.productId}-${Date.now()}`,
        productId: qtyDialog.productId,
        itemType: qtyDialog.itemType,
        name: qtyDialog.name,
        details: qtyDialog.details,
        quantity: qty,
        unitPrice: qtyDialog.unitPrice,
        unit: qtyDialog.unit,
      }];
    });
    setQtyDialog(null);
    setCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((c) => c.productId !== productId));
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) => prev
      .map((c) => c.productId === productId ? { ...c, quantity: Math.max(0.5, c.quantity + delta) } : c)
      .filter((c) => c.quantity > 0)
    );
  };

  const cartTotal = cart.reduce((s, c) => s + c.quantity * c.unitPrice, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setStatus(null);

    startTransition(async () => {
      try {
        const items: ClientOrderItemPayload[] = cart.map((c) => ({
          itemType: c.itemType,
          productId: c.productId,
          quantity: c.quantity,
          unitPrice: c.unitPrice,
          unit: c.unit,
        }));
        const result = await createClientOrder(items);
        setStatus({ type: "success", message: `Order ${result.orderNumber} placed successfully!` });
        setCart([]);
        setCartOpen(false);
        setTimeout(() => router.push("/portal/dashboard"), 1500);
      } catch (err: any) {
        setStatus({ type: "error", message: err.message ?? "Failed to place order." });
      }
    });
  };

  return (
    <div className="relative">
      {/* Status toast */}
      {status && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border text-sm font-semibold ${
          status.type === "success"
            ? "bg-emerald-900/90 border-emerald-500/40 text-emerald-300"
            : "bg-red-900/90 border-red-500/40 text-red-300"
        }`}>
          {status.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          {status.message}
          <button onClick={() => setStatus(null)} className="ml-2 opacity-60 hover:opacity-100"><X className="h-3.5 w-3.5" /></button>
        </div>
      )}

      {/* Controls bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/8 transition-all"
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg border border-white/10">
          {(["all", "fabric", "finishing"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${
                tab === t
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t === "all" ? "All Products" : t === "fabric" ? "Fabrics" : "Finishing"}
            </button>
          ))}
        </div>

        {/* Cart button */}
        <button
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-medium transition-all"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Cart</span>
          {cart.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* Product grid */}
      {allProducts.length === 0 ? (
        <div className="text-center py-16">
          <Search className="mx-auto h-10 w-10 text-slate-600 mb-2" />
          <p className="text-slate-400 text-sm">No products match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {allProducts.map((p) => (
            <ProductCard
              key={p.id}
              name={p.name}
              details={p.details}
              price={p.price}
              isBranded={p.isBranded}
              onAddToCart={() => openAddDialog(p)}
            />
          ))}
        </div>
      )}

      {/* Quantity dialog */}
      {qtyDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">{qtyDialog.name}</h3>
            <p className="text-xs text-slate-400 mb-5">{qtyDialog.details}</p>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Quantity ({qtyDialog.unit})
            </label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={inputQty}
              onChange={(e) => setInputQty(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && confirmAdd()}
              autoFocus
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500/50 mb-5"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setQtyDialog(null)}
                className="flex-1 py-2.5 rounded-lg border border-white/10 text-slate-400 text-sm font-medium hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmAdd}
                className="flex-1 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-all"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-md bg-slate-900 border-l border-white/10 flex flex-col h-full">
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" /> Your Cart
                <span className="text-xs font-normal text-slate-400">({cart.length} items)</span>
              </h2>
              <button onClick={() => setCartOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="mx-auto h-10 w-10 text-slate-600 mb-2" />
                  <p className="text-slate-400 text-sm">Your cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                            item.itemType === "fabric" ? "bg-blue-500/20 text-blue-300" : "bg-violet-500/20 text-violet-300"
                          }`}>
                            {item.itemType}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-white">{item.name}</p>
                        <p className="text-xs text-slate-400">{item.details}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.productId)} className="text-slate-500 hover:text-red-400 transition-colors mt-0.5">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(item.productId, -0.5)}
                          className="h-6 w-6 rounded-md bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-semibold text-white min-w-[3rem] text-center">
                          {item.quantity} {item.unit}
                        </span>
                        <button
                          onClick={() => updateQty(item.productId, 0.5)}
                          className="h-6 w-6 rounded-md bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      {item.unitPrice > 0 ? (
                        <span className="text-sm font-bold text-emerald-400">
                          ₹{(item.quantity * item.unitPrice).toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Quote on request</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 border-t border-white/10 space-y-3">
                {cartTotal > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 font-medium">Estimated Total</span>
                    <span className="text-white font-bold text-base">₹{cartTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <button
                  onClick={handleCheckout}
                  disabled={isPending}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold transition-all shadow-lg shadow-emerald-500/20"
                >
                  {isPending ? "Placing Order…" : "Place Order"}
                </button>
                <p className="text-center text-[10px] text-slate-500">
                  Orders are reviewed and confirmed by our team.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
