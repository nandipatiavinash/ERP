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
}

export function SalesPrintView({ order, rollsByProduct }: SalesPrintViewProps) {
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

  // Compute Grand Totals & Flatten Rows for Single Table
  const { tableRows, grandTotalNetWeight, grandTotalMeters, grandTotalRolls } = useMemo(() => {
    let netWeight = 0;
    let meters = 0;
    let rollsCount = 0;
    const rows: Array<{
      productKey: string;
      roll: any;
      isFirstOfProduct: boolean;
      productRollsCount: number;
    }> = [];

    for (const productKey of productKeys) {
      const rolls = sortedRollsByProduct[productKey] || [];
      rolls.forEach((roll, idx) => {
        netWeight += roll.net_weight;
        meters += roll.net_meters;
        rows.push({
          productKey,
          roll,
          isFirstOfProduct: idx === 0,
          productRollsCount: rolls.length,
        });
      });
      rollsCount += rolls.length;
    }

    return {
      tableRows: rows,
      grandTotalNetWeight: netWeight,
      grandTotalMeters: meters,
      grandTotalRolls: rollsCount,
    };
  }, [productKeys, sortedRollsByProduct]);

  return (
    <>
      {/* ---------- Print-specific styles ---------- */}
      <style>{`
        @media print {
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

        {/* ── Consolidated Product Table ── */}
        {tableRows.length > 0 ? (
          <div className="mb-6 overflow-x-auto">
            <table className="w-full border-collapse text-xs border border-gray-200">
              <thead>
                <tr className="border-b-2 border-gray-300 bg-gray-50 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  <th className="border border-gray-200 px-3 py-2">Product Spec</th>
                  <th className="border border-gray-200 px-3 py-2 text-center">Roll No</th>
                  <th className="border border-gray-200 px-3 py-2 text-right">Gross W8</th>
                  <th className="border border-gray-200 px-3 py-2 text-right">Core W8</th>
                  <th className="border border-gray-200 px-3 py-2 text-right">Net W8</th>
                  <th className="border border-gray-200 px-3 py-2 text-right">Mtrs</th>
                  <th className="border border-gray-200 px-3 py-2 text-right">Avg W8</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map(({ productKey, roll, isFirstOfProduct, productRollsCount }, idx) => (
                  <tr
                    key={roll.roll_number}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/60"}
                  >
                    {isFirstOfProduct && (
                      <td
                        rowSpan={productRollsCount}
                        className="border border-gray-200 px-3 py-2 font-bold uppercase text-gray-800 align-middle bg-gray-50/10"
                      >
                        {productKey}
                      </td>
                    )}
                    <td className="border border-gray-200 px-3 py-1.5 text-center text-gray-600 font-mono">
                      {roll.roll_number}
                    </td>
                    <td className="border border-gray-200 px-3 py-1.5 text-right tabular-nums">
                      {formatNumber(roll.gross_weight)}
                    </td>
                    <td className="border border-gray-200 px-3 py-1.5 text-right tabular-nums">
                      {formatNumber(roll.core_weight)}
                    </td>
                    <td className="border border-gray-200 px-3 py-1.5 text-right tabular-nums font-semibold">
                      {formatNumber(roll.net_weight)}
                    </td>
                    <td className="border border-gray-200 px-3 py-1.5 text-right tabular-nums">
                      {formatNumber(Math.floor(roll.net_meters), 0)}
                    </td>
                    <td className="border border-gray-200 px-3 py-1.5 text-right tabular-nums">
                      {formatNumber(Math.floor(roll.average_meter_weight), 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-400 bg-gray-100 font-bold">
                  <td
                    className="border border-gray-200 px-3 py-2 text-right uppercase tracking-wide text-gray-700"
                    colSpan={2}
                  >
                    Grand Total ({grandTotalRolls} Rolls)
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-right tabular-nums" />
                  <td className="border border-gray-200 px-3 py-2 text-right tabular-nums" />
                  <td className="border border-gray-200 px-3 py-2 text-right tabular-nums text-emerald-950">
                    {formatNumber(grandTotalNetWeight)} kg
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-right tabular-nums">
                    {formatNumber(Math.floor(grandTotalMeters), 0)} m
                  </td>
                  <td className="border border-gray-200 px-3 py-2" />
                </tr>
              </tfoot>
            </table>
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
