"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface RotoColorAssoc {
  id: string;
  color_id: string;
  image_url: string | null;
  roto_colors?: {
    id: string;
    color_name: string;
  } | null;
}

interface RotoColorsPreviewProps {
  firmName: string;
  brandName: string;
  colors: RotoColorAssoc[];
  defaultImageUrl: string | null;
}

export function RotoColorsPreview({ firmName, brandName, colors, defaultImageUrl }: RotoColorsPreviewProps) {
  const [selectedColor, setSelectedColor] = useState<RotoColorAssoc | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showColorList, setShowColorList] = useState(false);

  return (
    <div className="flex flex-col gap-1.5 min-w-[200px]">
      {/* Clickable Client/Firm Name */}
      <button
        type="button"
        onClick={() => setShowColorList(!showColorList)}
        className="text-left font-bold text-slate-800 hover:text-emerald-700 transition-colors focus:outline-none w-fit"
      >
        <span className="border-b border-dashed border-slate-400 hover:border-emerald-600">
          {firmName || "General (No Client)"}
        </span>
      </button>

      {/* Colors List (shown on click) */}
      {showColorList && (
        <div className="flex flex-wrap gap-1.5 mt-1 border bg-slate-50/50 p-2 rounded-md transition-all">
          {colors.length === 0 ? (
            <span className="text-[10px] text-slate-400 italic">No colors associated</span>
          ) : (
            colors.map((c) => {
              const colorName = c.roto_colors?.color_name ?? "Unknown Color";
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => {
                    if (c.image_url) {
                      setSelectedColor(c);
                      setPreviewOpen(true);
                    }
                  }}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all border ${
                    c.image_url
                      ? "bg-white text-slate-800 border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 cursor-pointer"
                      : "bg-slate-100 text-slate-400 border-transparent cursor-default"
                  }`}
                  title={c.image_url ? "Click to view preview image" : "No image uploaded"}
                >
                  {colorName}
                </button>
              );
            })
          )}
        </div>
      )}

      {/* Image Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-md bg-white border border-slate-200 shadow-lg rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-slate-900 font-bold">
              Preview: {brandName} - {selectedColor?.roto_colors?.color_name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4 border rounded bg-slate-50 mt-2">
            {selectedColor?.image_url ? (
              <img
                src={selectedColor.image_url}
                alt={selectedColor?.roto_colors?.color_name ?? "color preview"}
                className="max-h-[350px] max-w-full rounded object-contain shadow"
              />
            ) : (
              <span className="text-sm text-slate-400 italic">No image available</span>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
