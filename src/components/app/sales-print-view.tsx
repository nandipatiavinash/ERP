"use client";

import { useMemo } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNumber, formatDate } from "@/lib/utils";

interface SalesPrintViewProps {
  order: {
    order_number: string;
    order_date: string;
    bill_number?: string;
    bill_value?: number;
    customers?: {
      customer_name: string;
      address?: string;
      gst_number?: string;
      phone?: string;
    };
  };
  rollsByProduct: Record<
    string,
    Array<{
      roll_number: string;
      gross_weight: number;
      core_weight: number;
      net_weight: number;
      net_meters: number;
      average_meter_weight: number;
    }>
  >;
  departmentsByProduct?: Record<string, string>;
}

export function SalesPrintView({ order, rollsByProduct, departmentsByProduct }: SalesPrintViewProps) {
  const customer = order.customers;
  const productKeys = useMemo(() => {
    return Object.keys(rollsByProduct)
      .filter((key) => rollsByProduct[key] && rollsByProduct[key].length > 0)
      .sort();
  }, [rollsByProduct]);

  // Sort rolls within each product group alphabetically
  const sortedRollsByProduct = useMemo(() => {
    const sorted: Record<string, typeof rollsByProduct[string]> = {};
    for (const key of productKeys) {
      sorted[key] = [...rollsByProduct[key]].sort((a, b) =>
        a.roll_number.localeCompare(b.roll_number, undefined, { numeric: true, sensitivity: "base" })
      );
    }
    return sorted;
  }, [productKeys, rollsByProduct]);

  // Compute Product Summaries & Totals
  const productSummaries = useMemo(() => {
    return productKeys.map((productKey) => {
      const rolls = sortedRollsByProduct[productKey] || [];
      const dept = departmentsByProduct?.[productKey] || "fabric";

      const totalNetWeight = rolls.reduce((sum, r) => sum + (r.net_weight || 0), 0);
      const totalMeters = rolls.reduce((sum, r) => sum + (r.net_meters || 0), 0);
      const totalGrossWeight = rolls.reduce((sum, r) => sum + (r.gross_weight || 0), 0);
      const totalCoreWeight = rolls.reduce((sum, r) => sum + (r.core_weight || 0), 0);
      const totalRolls = rolls.length;

      // Avg weight for fabric
      const avgWeight = totalMeters > 0 ? (totalNetWeight * 1000) / totalMeters : 0;

      return {
        productKey,
        dept,
        rolls,
        totalNetWeight,
        totalMeters,
        totalGrossWeight,
        totalCoreWeight,
        totalRolls,
        avgWeight,
      };
    });
  }, [productKeys, sortedRollsByProduct, departmentsByProduct]);

  // Compute overall Grand Totals
  const grandTotals = useMemo(() => {
    let netWeight = 0;
    let meters = 0;
    let bags = 0;
    let rollsCount = 0;

    productSummaries.forEach((s) => {
      netWeight += s.totalNetWeight;
      rollsCount += s.totalRolls;
      if (s.dept === "finishing") {
        bags += s.totalMeters;
      } else {
        meters += s.totalMeters;
      }
    });

    return {
      netWeight,
      meters,
      bags,
      rollsCount,
    };
  }, [productSummaries]);

  return (
    <>
      {/* ---------- Print-specific styles ---------- */}
      <style>{`
        @media print {
          @page {
            size: auto;
            margin: 10mm 15mm 10mm 15mm;
          }

          /* Hide headers, sidebars, buttons, etc. */
          header,
          aside,
          nav,
          button,
          .no-print,
          [data-print-hide] {
            display: none !important;
          }

          /* Reset main page container layout paddings and background */
          html,
          body,
          main,
          div.lg\\:pl-64,
          div.min-h-screen {
            background: #fff !important;
            color: #000 !important;
            padding: 0 !important;
            margin: 0 !important;
            position: static !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
          }

          .sales-print-area {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }

          /* Prevent table rows and headers from splitting or breaking awkwardly */
          tr {
            break-inside: avoid !important;
          }
          thead {
            display: table-header-group !important;
          }
        }
      `}</style>

      {/* ---------- Trigger button (hidden when printing) ---------- */}
      <div className="no-print mb-6 flex justify-end" data-print-hide>
        <Button type="button" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          Print Invoice
        </Button>
      </div>

      {/* ---------- Printable invoice content ---------- */}
      <div className="sales-print-area rounded-lg border border-gray-200 bg-white p-8 text-sm text-gray-900 shadow-sm">
        {/* ── Invoice header ── */}
        <div className="mb-6 border-b border-gray-300 pb-4">
          <div className="flex justify-between items-start text-sm">
            {/* Left column – customer name only */}
            <div>
              {customer && (
                <p className="text-lg font-bold">
                  {customer.customer_name}
                </p>
              )}
            </div>

            {/* Right column – date only */}
            <div className="text-right">
              <p className="text-sm font-medium">
                {formatDate(order.order_date)}
              </p>
            </div>
          </div>
        </div>

        {/* ── Product-wise Tables ── */}
        {productSummaries.length > 0 ? (
          <div className="space-y-8">
            {productSummaries.map((summary) => {
              const isFabric = summary.dept === "fabric";
              const isFinishing = summary.dept === "finishing";

              return (
                <div key={summary.productKey} className="space-y-2">
                  {/* Product Specification Header */}
                  <div className="flex justify-between items-center mb-2 border-b border-gray-200 pb-1">
                    <h3 className="text-sm font-bold text-gray-800 uppercase">
                      {summary.productKey}
                    </h3>
                    <span className="text-[10px] font-semibold text-gray-500 uppercase px-2 py-0.5 bg-gray-100 rounded">
                      {summary.dept === "fabric"
                        ? "Fabric"
                        : summary.dept === "finishing"
                        ? "Bags (Finishing)"
                        : "Lamination / Roto"}
                    </span>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-xs border border-gray-200">
                      <thead>
                        <tr className="border-b border-gray-300 bg-gray-50 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                          <th className="border border-gray-200 px-3 py-2">
                            {isFinishing ? "Bundle No" : "Roll No"}
                          </th>
                          {isFabric && (
                            <>
                              <th className="border border-gray-200 px-3 py-2 text-right">Gross W8</th>
                              <th className="border border-gray-200 px-3 py-2 text-right">Core W8</th>
                            </>
                          )}
                          <th className="border border-gray-200 px-3 py-2 text-right">Net W8 (kgs)</th>
                          <th className="border border-gray-200 px-3 py-2 text-right">
                            {isFinishing ? "Pieces (Bags)" : "Meters"}
                          </th>
                          {isFabric && (
                            <th className="border border-gray-200 px-3 py-2 text-right">Avg W8</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {summary.rolls.map((roll, idx) => {
                          const rollAvg = roll.net_meters > 0 ? (roll.net_weight * 1000) / roll.net_meters : 0;
                          return (
                            <tr
                              key={roll.roll_number}
                              className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/60"}
                            >
                              <td className="border border-gray-200 px-3 py-1.5 text-left text-gray-600 font-mono">
                                {roll.roll_number}
                              </td>
                              {isFabric && (
                                <>
                                  <td className="border border-gray-200 px-3 py-1.5 text-right tabular-nums">
                                    {formatNumber(roll.gross_weight)}
                                  </td>
                                  <td className="border border-gray-200 px-3 py-1.5 text-right tabular-nums">
                                    {formatNumber(roll.core_weight)}
                                  </td>
                                </>
                              )}
                              <td className="border border-gray-200 px-3 py-1.5 text-right tabular-nums font-semibold">
                                {formatNumber(roll.net_weight)}
                              </td>
                              <td className="border border-gray-200 px-3 py-1.5 text-right tabular-nums">
                                {formatNumber(Math.floor(roll.net_meters), 0)}
                              </td>
                              {isFabric && (
                                <td className="border border-gray-200 px-3 py-1.5 text-right tabular-nums">
                                  {formatNumber(Math.floor(rollAvg), 0)}
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-gray-300 bg-gray-50 font-bold">
                          <td className="border border-gray-200 px-3 py-2 text-left uppercase text-gray-700">
                            Total ({summary.totalRolls} {isFinishing ? "Bundles" : "Rolls"})
                          </td>
                          {isFabric && (
                            <>
                              <td className="border border-gray-200 px-3 py-2 text-right"></td>
                              <td className="border border-gray-200 px-3 py-2 text-right"></td>
                            </>
                          )}
                          <td className="border border-gray-200 px-3 py-2 text-right tabular-nums text-emerald-950">
                            {formatNumber(summary.totalNetWeight)} kg
                          </td>
                          <td className="border border-gray-200 px-3 py-2 text-right tabular-nums">
                            {formatNumber(Math.floor(summary.totalMeters), 0)} {isFinishing ? "pcs" : "m"}
                          </td>
                          {isFabric && (
                            <td className="border border-gray-200 px-3 py-2 text-right"></td>
                          )}
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              );
            })}

            {/* ── Dispatch Summary Card ── */}
            <div className="mt-8 border border-gray-300 rounded-lg p-4 bg-gray-50 break-inside-avoid">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 border-b border-gray-200 pb-1.5">
                Dispatch Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Left side: Product-wise totals */}
                <div className="space-y-1.5">
                  {productSummaries.map((s) => (
                    <div key={s.productKey} className="flex justify-between items-center text-gray-700 font-medium">
                      <span className="uppercase">{s.productKey}:</span>
                      <span className="font-mono bg-white px-2 py-0.5 border border-gray-200 rounded">
                        {formatNumber(s.totalNetWeight)} kg / {formatNumber(Math.floor(s.totalMeters), 0)} {s.dept === "finishing" ? "pcs" : "m"} ({s.totalRolls} {s.dept === "finishing" ? "Bundles" : "Rolls"})
                      </span>
                    </div>
                  ))}
                </div>

                {/* Right side: Overall totals */}
                <div className="border-t md:border-t-0 md:border-l border-gray-200 pt-3 md:pt-0 md:pl-4 space-y-2">
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Total Net Weight:</span>
                    <span className="font-bold text-sm text-emerald-950 font-mono">
                      {formatNumber(grandTotals.netWeight)} kg
                    </span>
                  </div>
                  {grandTotals.meters > 0 && (
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Total Fabric Length:</span>
                      <span className="font-bold text-sm text-gray-800 font-mono">
                        {formatNumber(Math.floor(grandTotals.meters), 0)} m
                      </span>
                    </div>
                  )}
                  {grandTotals.bags > 0 && (
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Total Pieces (Bags):</span>
                      <span className="font-bold text-sm text-gray-800 font-mono">
                        {formatNumber(Math.floor(grandTotals.bags), 0)} pcs
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Total Count:</span>
                    <span className="font-semibold text-gray-800 font-mono">
                      {grandTotals.rollsCount} {grandTotals.bags > 0 && grandTotals.meters > 0 ? "Items" : grandTotals.bags > 0 ? "Bundles" : "Rolls"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center py-8 text-sm text-gray-500">No products found for print.</p>
        )}

        {/* ── Footer ── */}
        <div className="mt-10 border-t border-gray-200 pt-4 text-center text-[10px] text-gray-400">
          Generated on {formatDate(new Date().toISOString())} •{" "}
          {order.order_number}
        </div>
      </div>
    </>
  );
}
