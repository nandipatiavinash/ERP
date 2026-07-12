"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart, Search, Trash2, Plus, Minus, CheckCircle2,
  AlertCircle, X, Layers, Tag, ChevronRight, Package, Image as ImageIcon, Check
} from "lucide-react";
import { createClientOrder } from "@/app/(app)/_actions/client-orders";
import { showSuccess } from "@/lib/toast";

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

type RotoProduct = { id: string; brand: string };
type OffsetProduct = { id: string; brand: string };

type CartItem = {
  id: string;
  productId: string;
  itemType: "fabric" | "finishing";
  name: string;
  details: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  imageUrl?: string | null;

  // Custom production fields
  fabricTypeId?: string | null;
  rotoProductId?: string | null;
  offsetProductId?: string | null;
  filmType?: string | null;
  isMetallic?: boolean;
  laminationType?: string | null;
  offsetType?: string | null;
};

type Props = {
  fabricTypes: FabricProduct[];
  finishingProducts: FinishingProduct[];
  rotoProducts: RotoProduct[];
  offsetProducts: OffsetProduct[];
  customerId: string | null;
};

function ProductCard({
  name,
  details,
  price,
  imageUrl,
  isBranded,
  onAddToCart,
}: {
  name: string;
  details: string;
  price: number;
  imageUrl?: string | null;
  isBranded: boolean;
  onAddToCart: () => void;
}) {
  return (
    <div 
      onClick={onAddToCart}
      className="group relative rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20 transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between"
    >
      {isBranded && (
        <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 z-10">
          YOUR BRAND
        </div>
      )}
      <div className="p-4 flex-1">
        <div className="h-32 rounded-lg bg-gradient-to-br from-white/5 to-white/2 border border-white/5 flex items-center justify-center mb-3 overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <Package className="h-10 w-10 text-slate-600" />
          )}
        </div>
        <h3 className="text-sm font-bold text-white mb-0.5 truncate" title={name}>{name}</h3>
        <p className="text-[11px] text-slate-400 mb-3">{details}</p>
      </div>
      <div className="p-4 pt-0 border-t border-white/5 mt-auto flex items-center justify-between">
        {price > 0 ? (
          <span className="text-sm font-bold text-emerald-400">₹{Number(price).toLocaleString("en-IN")}</span>
        ) : (
          <span className="text-xs text-slate-500 italic">Quote on request</span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold transition-all"
        >
          <Plus className="h-3 w-3" /> Add
        </button>
      </div>
    </div>
  );
}

export function PortalCatalogView({ fabricTypes, finishingProducts, rotoProducts, offsetProducts, customerId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "fabric" | "finishing">("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const allProducts = useMemo(() => {
    const list: Array<{
      id: string; productId: string; itemType: "fabric" | "finishing";
      name: string; details: string; price: number; isBranded: boolean; unit: string; imageUrl?: string | null;
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
        unit: "kg",
        imageUrl: f.image_url,
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
        imageUrl: p.image_url,
      }));
    }

    if (!search) return list;
    const q = search.toLowerCase();
    return list.filter((p) => p.name.toLowerCase().includes(q) || p.details.toLowerCase().includes(q));
  }, [fabricTypes, finishingProducts, tab, search]);

  const handleAddToCart = (p: typeof allProducts[0]) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === p.productId);
      if (existing) {
        return prev.map((c) => c.productId === p.productId ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, {
        id: `${p.productId}-${Date.now()}`,
        productId: p.productId,
        itemType: p.itemType,
        name: p.name,
        details: p.details,
        quantity: 1,
        unitPrice: p.price,
        unit: p.unit,
        imageUrl: p.imageUrl,
        
        // Defaults for production specs
        fabricTypeId: fabricTypes[0]?.id || null, // default first fabric
        rotoProductId: rotoProducts[0]?.id || null,
        offsetProductId: null,
        filmType: "gloss",
        isMetallic: false,
        laminationType: p.itemType === "finishing" ? "PLAIN" : null,
        offsetType: p.itemType === "finishing" ? "none" : null,
      }];
    });
    setCartOpen(true);
    showSuccess(`${p.name} added to cart!`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((c) => c.productId !== productId));
  };

  const updateCartItemField = (productId: string, field: keyof CartItem, value: any) => {
    setCart((prev) => prev.map((item) => {
      if (item.productId !== productId) return item;
      return { ...item, [field]: value };
    }));
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) => prev
      .map((c) => c.productId === productId ? { ...c, quantity: Math.max(1, c.quantity + delta) } : c)
    );
  };

  const cartTotal = cart.reduce((s, c) => s + c.quantity * c.unitPrice, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Ensure all finishing items have a fabric type selected
    const missingFabric = cart.some(item => item.itemType === "finishing" && !item.fabricTypeId);
    if (missingFabric) {
      setStatus({ type: "error", message: "Please select a Fabric Type for all Finishing Bag products in your cart." });
      return;
    }

    setStatus(null);

    startTransition(async () => {
      try {
        const items = cart.map((c) => ({
          itemType: c.itemType,
          productId: c.productId,
          quantity: c.quantity,
          unitPrice: c.unitPrice,
          unit: c.unit,
          
          fabricTypeId: c.fabricTypeId,
          rotoProductId: c.rotoProductId,
          offsetProductId: c.offsetProductId,
          filmType: c.filmType,
          isMetallic: c.isMetallic,
          laminationType: c.laminationType,
          offsetType: c.offsetType,
        }));
        const result = await createClientOrder(items);
        setStatus({ type: "success", message: `Order ${result.orderNumber} placed successfully!` });
        setCart([]);
        setCartOpen(false);
        setTimeout(() => router.push("/portal/dashboard" as any), 1500);
      } catch (err: any) {
        setStatus({ type: "error", message: err.message ?? "Failed to place order." });
      }
    });
  };

  return (
    <div className="relative font-sans">
      {/* Status toast */}
      {status && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border text-sm font-semibold ${
          status.type === "success"
            ? "bg-emerald-900/90 border-emerald-500/40 text-emerald-300 animate-in fade-in zoom-in-95"
            : "bg-red-900/90 border-red-500/40 text-red-300 animate-in fade-in zoom-in-95"
        }`}>
          {status.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          {status.message}
          <button onClick={() => setStatus(null)} className="ml-2 opacity-60 hover:opacity-100"><X className="h-3.5 w-3.5" /></button>
        </div>
      )}

      {/* Controls bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
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

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
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
            className="relative flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 text-sm font-semibold transition-all shadow-sm"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Cart</span>
            {cart.length > 0 && (
              <span className="h-5 w-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Product grid */}
      {allProducts.length === 0 ? (
        <div className="text-center py-20 border border-white/5 rounded-xl bg-white/2">
          <Search className="mx-auto h-10 w-10 text-slate-600 mb-2" />
          <p className="text-slate-400 text-sm">No products match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {allProducts.map((p) => (
            <ProductCard
              key={p.id}
              name={p.name}
              details={p.details}
              price={p.price}
              imageUrl={p.imageUrl}
              isBranded={p.isBranded}
              onAddToCart={() => handleAddToCart(p)}
            />
          ))}
        </div>
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
          <div className="flex-1 bg-black/70 backdrop-blur-xs" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-lg bg-slate-900 border-l border-white/10 flex flex-col h-full shadow-2xl">
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-emerald-400" /> Your Cart
                <span className="text-xs font-normal text-slate-400">({cart.length} items)</span>
              </h2>
              <button onClick={() => setCartOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                  <ShoppingCart className="mx-auto h-12 w-12 text-slate-700 mb-3" />
                  <p className="text-sm font-semibold">Your cart is empty</p>
                  <p className="text-xs text-slate-600 mt-1">Add items from the catalog above.</p>
                </div>
              ) : (
                cart.map((item) => {
                  const isFin = item.itemType === "finishing";
                  const showRotoFields = isFin && ["BOX", "F_S", "H_S"].includes(item.laminationType || "");
                  const showOffsetFields = isFin && item.offsetType !== "none" && !!item.offsetType;

                  return (
                    <div key={item.id} className="rounded-xl border border-white/10 bg-white/2 p-4 space-y-4">
                      {/* Item Details */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-3">
                          <div className="h-12 w-12 rounded bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt="prod" className="h-full w-full object-cover" />
                            ) : (
                              <Package className="h-6 w-6 text-slate-600" />
                            )}
                          </div>
                          <div>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                              item.itemType === "fabric" ? "bg-blue-500/20 text-blue-300" : "bg-violet-500/20 text-violet-300"
                            }`}>
                              {item.itemType}
                            </span>
                            <p className="text-sm font-bold text-white mt-1">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{item.details}</p>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item.productId)} className="text-slate-500 hover:text-red-400 transition-colors p-1.5 hover:bg-red-500/10 rounded-lg">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Configurable Specifications Form (only for Finishing/Bags) */}
                      {isFin && (
                        <div className="p-3 rounded-lg border border-white/5 bg-black/20 text-xs space-y-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Production Customization</p>
                          
                          <div className="grid grid-cols-2 gap-2">
                            {/* Fabric ID Selection */}
                            <div className="space-y-1">
                              <label className="text-slate-400 text-[10px] font-semibold">Fabric Type (Material)</label>
                              <select
                                value={item.fabricTypeId || ""}
                                onChange={(e) => updateCartItemField(item.productId, "fabricTypeId", e.target.value)}
                                className="w-full h-8 rounded border border-white/10 bg-slate-800 text-white px-2 focus:outline-none"
                              >
                                <option value="" disabled>Select fabric...</option>
                                {fabricTypes.map(f => (
                                  <option key={f.id} value={f.id}>{f.fabric_name}</option>
                                ))}
                              </select>
                            </div>

                            {/* Lamination Type */}
                            <div className="space-y-1">
                              <label className="text-slate-400 text-[10px] font-semibold">Lamination Type</label>
                              <select
                                value={item.laminationType || "PLAIN"}
                                onChange={(e) => {
                                  updateCartItemField(item.productId, "laminationType", e.target.value);
                                  // Clear offset if lamination chosen
                                  if (e.target.value !== "PLAIN" && e.target.value !== "NW") {
                                    updateCartItemField(item.productId, "offsetType", "none");
                                  }
                                }}
                                className="w-full h-8 rounded border border-white/10 bg-slate-800 text-white px-2 focus:outline-none"
                              >
                                <option value="PLAIN">PLAIN</option>
                                <option value="NW">NW</option>
                                <option value="BOX">BOX</option>
                                <option value="F_S">F/S</option>
                                <option value="H_S">H/S</option>
                              </select>
                            </div>

                            {/* Offset Type */}
                            <div className="space-y-1">
                              <label className="text-slate-400 text-[10px] font-semibold">Offset Type</label>
                              <select
                                value={item.offsetType || "none"}
                                onChange={(e) => {
                                  updateCartItemField(item.productId, "offsetType", e.target.value);
                                  // Clear lamination if offset chosen
                                  if (e.target.value !== "none") {
                                    updateCartItemField(item.productId, "laminationType", "PLAIN");
                                  }
                                }}
                                className="w-full h-8 rounded border border-white/10 bg-slate-800 text-white px-2 focus:outline-none"
                              >
                                <option value="none">None</option>
                                <option value="FABRIC">Fabric</option>
                                <option value="NW">NW</option>
                                <option value="NW_LAM">NW_LAM</option>
                                <option value="PLAIN_LAM">PLAIN_LAM</option>
                              </select>
                            </div>

                            {/* Film Type (if Roto active) */}
                            {showRotoFields && (
                              <div className="space-y-1">
                                <label className="text-slate-400 text-[10px] font-semibold">Film Type</label>
                                <select
                                  value={item.filmType || "gloss"}
                                  onChange={(e) => updateCartItemField(item.productId, "filmType", e.target.value)}
                                  className="w-full h-8 rounded border border-white/10 bg-slate-800 text-white px-2 focus:outline-none"
                                >
                                  <option value="gloss">Gloss</option>
                                  <option value="matt">Matt</option>
                                </select>
                              </div>
                            )}
                          </div>

                          {/* Dynamic Brands Dropdowns */}
                          {showRotoFields && (
                            <div className="flex gap-2 items-center">
                              <div className="flex-1 space-y-1">
                                <label className="text-slate-400 text-[10px] font-semibold">Roto Printing Brand</label>
                                <select
                                  value={item.rotoProductId || ""}
                                  onChange={(e) => updateCartItemField(item.productId, "rotoProductId", e.target.value)}
                                  className="w-full h-8 rounded border border-white/10 bg-slate-800 text-white px-2 focus:outline-none"
                                >
                                  <option value="" disabled>Select brand...</option>
                                  {rotoProducts.map(rp => (
                                    <option key={rp.id} value={rp.id}>{rp.brand}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex items-center gap-1.5 pt-4">
                                <input
                                  type="checkbox"
                                  id={`metallic-${item.productId}`}
                                  checked={!!item.isMetallic}
                                  onChange={(e) => updateCartItemField(item.productId, "isMetallic", e.target.checked)}
                                  className="h-4.5 w-4.5 rounded border-white/10 bg-slate-800 text-emerald-600 focus:ring-emerald-500"
                                />
                                <label htmlFor={`metallic-${item.productId}`} className="text-slate-300 font-semibold cursor-pointer select-none">
                                  Metallic
                                </label>
                              </div>
                            </div>
                          )}

                          {showOffsetFields && (
                            <div className="space-y-1">
                              <label className="text-slate-400 text-[10px] font-semibold">Offset Printing Brand</label>
                              <select
                                  value={item.offsetProductId || ""}
                                  onChange={(e) => updateCartItemField(item.productId, "offsetProductId", e.target.value)}
                                  className="w-full h-8 rounded border border-white/10 bg-slate-800 text-white px-2 focus:outline-none"
                              >
                                <option value="" disabled>Select brand...</option>
                                {offsetProducts.map(op => (
                                  <option key={op.id} value={op.id}>{op.brand}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Quantity & Total Row */}
                      <div className="flex items-center justify-between border-t border-white/5 pt-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateQty(item.productId, -1)}
                            className="h-7 w-7 rounded bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all border border-white/5"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-bold text-white min-w-[3.5rem] text-center font-mono">
                            {item.quantity} {item.unit}
                          </span>
                          <button
                            onClick={() => updateQty(item.productId, 1)}
                            className="h-7 w-7 rounded bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all border border-white/5"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        {item.unitPrice > 0 ? (
                          <span className="text-sm font-bold text-emerald-400">
                            ₹{(item.quantity * item.unitPrice).toLocaleString("en-IN")}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500 italic">Quote on request</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 border-t border-white/10 bg-white/1 space-y-4">
                {cartTotal > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 font-medium">Estimated Order Value</span>
                    <span className="text-emerald-400 font-bold text-lg">₹{cartTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <button
                  onClick={handleCheckout}
                  disabled={isPending}
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold transition-all shadow-lg shadow-emerald-500/25"
                >
                  {isPending ? "Submitting Order…" : "Place Order"}
                </button>
                <p className="text-center text-[10px] text-slate-500">
                  Customization specifications will be forwarded directly to our production team.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
