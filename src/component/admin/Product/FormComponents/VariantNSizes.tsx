import { Dispatch, SetStateAction, memo } from "react";
import { FormSection } from "../FormSection";
import { ProductFormData, SizeDetail } from "../ProductForm";
import { Color, Variant } from "@/types/product.types";

interface Props {
  formData: ProductFormData;
  setFormData: Dispatch<SetStateAction<ProductFormData>>;
  variants: Variant[];
  variantsLoading: boolean;
  colors: Color[];
  sizeSelections: { [colorId: number]: SizeDetail[] };
  calculateSizeDiscountedPrice: (sizeDetail: SizeDetail) => number;
  availableSizes: { id: number; name: string }[];
  setSizeSelections: Dispatch<SetStateAction<Record<number, SizeDetail[]>>>;
}

const VariantNSizes = ({
  formData,
  setFormData,
  variants,
  variantsLoading,
  colors,
  sizeSelections,
  calculateSizeDiscountedPrice,
  availableSizes,
  setSizeSelections,
}: Props) => {
    
  const handleSizeFieldChange = (
    colorId: number,
    sizeId: number,
    field: keyof SizeDetail,
    value: string | number | null,
  ) => {
    setSizeSelections((prev) => {
      const next = { ...prev };
      if (!next[colorId]) return prev;

      const idx = next[colorId].findIndex((s) => s.sizeId === sizeId);
      if (idx === -1) return prev;

      next[colorId][idx] = {
        ...next[colorId][idx],
        [field]:
          field === "quantity" || field === "discount" ? Number(value) : value,
      };
      return next;
    });
  };

  return (
    <FormSection
      title="Variants & Inventory"
      description="Define product variations and manage stock levels per size/color."
    >
      <div className="space-y-8">
        {/* Variant Selector */}
        <div className="max-w-md">
          <label className="text-sm font-semibold text-slate-900 mb-2 block">
            Variant Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.variantId || ""}
            disabled={variantsLoading}
            required={formData.hasColorVariants}
            className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 transition-all shadow-sm"
            onChange={(e) => {
              const id = e.target.value ? Number(e.target.value) : null;
              const variant = variants.find((v) => v.id === id);

              setFormData((prev) => ({ ...prev, variantId: id }));

              if (variant?.sizes) {
                setSizeSelections((prev) => {
                  const next = { ...prev };
                  let changed = false;
                  formData.selectedColors.forEach((colorId) => {
                    const existing = next[colorId] || [];
                    const existingIds = new Set(existing.map((s) => s.sizeId));
                    const missing = variant.sizes!.filter(
                      (s) => !existingIds.has(s.id),
                    );

                    if (missing.length > 0) {
                      next[colorId] = [
                        ...existing,
                        ...missing.map((s) => ({
                          sizeId: s.id,
                          sku: "",
                          price: formData.basePrice || undefined,
                          quantity: 0,
                        })),
                      ];
                      changed = true;
                    }
                  });
                  return changed ? next : prev;
                });
              }
            }}
          >
            <option value="">Select a variant category...</option>
            {variants?.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        {formData.variantId && formData.selectedColors.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-base font-semibold text-slate-800">
                Size Management
              </h4>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                {formData.selectedColors.length} Colors Selected
              </span>
            </div>

            {formData.selectedColors.map((colorId) => {
              const color = colors.find((c) => c.id === colorId);
              const colorSizes = sizeSelections[colorId] || [];

              return (
                <div
                  key={colorId}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm"
                >
                  {/* Color Header */}
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-md border border-black/10 shadow-inner"
                      style={{ backgroundColor: color?.hexCode }}
                    />
                    <span className="font-semibold text-slate-700">
                      {color?.name}
                    </span>
                  </div>

                  <div className="p-4 overflow-x-auto">
                    {colorSizes.length > 0 ? (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100">
                            <th className="pb-3 pl-2">Size</th>
                            <th className="pb-3">SKU</th>
                            <th className="pb-3">Price</th>
                            <th className="pb-3">Discount Type</th>
                            <th className="pb-3">Discount</th>
                            <th className="pb-3">Qty</th>
                            <th className="pb-3">Final Price</th>
                            <th className="pb-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {colorSizes.map((sizeDetail) => (
                            <SizeRow
                              key={sizeDetail.sizeId}
                              sizeDetail={sizeDetail}
                              colorId={colorId}
                              availableSizes={availableSizes}
                              formData={formData}
                              calculateSizeDiscountedPrice={
                                calculateSizeDiscountedPrice
                              }
                              onFieldChange={handleSizeFieldChange}
                            />
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-sm text-slate-400 py-4 text-center">
                        No sizes configured for this variant.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </FormSection>
  );
};

// --- Extracted Row Component for better performance and readability ---
const SizeRow = memo(
  ({
    sizeDetail,
    colorId,
    availableSizes,
    formData,
    calculateSizeDiscountedPrice,
    onFieldChange,
  }: any) => {
    const size = availableSizes.find((s: any) => s.id === sizeDetail.sizeId);
    const finalPrice = calculateSizeDiscountedPrice(sizeDetail);
    const hasCustomDiscount =
      sizeDetail.discountType !== null &&
      (sizeDetail.discountType !== formData.discountType ||
        sizeDetail.discount !== formData.discount);

    return (
      <tr
        className={`group transition-colors ${hasCustomDiscount ? "bg-blue-50/50" : "hover:bg-slate-50/50"}`}
      >
        <td className="py-3 pl-2">
          <span className="text-sm font-bold text-slate-700">
            {size?.name || `S-${sizeDetail.sizeId}`}
          </span>
        </td>
        <td className="py-3">
          <input
            type="text"
            value={sizeDetail.sku || ""}
            onChange={(e) =>
              onFieldChange(colorId, sizeDetail.sizeId, "sku", e.target.value)
            }
            className="w-24 px-2 py-1 text-xs border border-slate-200 rounded focus:border-blue-500 outline-none"
            placeholder="SKU"
          />
        </td>
        <td className="py-3">
          <input
            type="number"
            value={sizeDetail.price || formData.basePrice}
            onChange={(e) =>
              onFieldChange(colorId, sizeDetail.sizeId, "price", e.target.value)
            }
            className="w-20 px-2 py-1 text-xs border border-slate-200 rounded focus:border-blue-500 outline-none"
          />
        </td>
        <td className="py-3">
          <select
            value={sizeDetail.discountType || ""}
            onChange={(e) =>
              onFieldChange(
                colorId,
                sizeDetail.sizeId,
                "discountType",
                e.target.value || null,
              )
            }
            className="w-32 px-2 py-1 text-xs border border-slate-200 rounded bg-white outline-none"
          >
            <option value="">Default</option>
            <option value="PERCENT">Percent (%)</option>
            <option value="FIXED">Fixed (৳)</option>
          </select>
        </td>
        <td className="py-3">
          <input
            type="number"
            value={sizeDetail.discount || ""}
            disabled={!sizeDetail.discountType}
            onChange={(e) =>
              onFieldChange(
                colorId,
                sizeDetail.sizeId,
                "discount",
                e.target.value,
              )
            }
            className="w-16 px-2 py-1 text-xs border border-slate-200 rounded disabled:bg-slate-100 outline-none"
          />
        </td>
        <td className="py-3">
          <input
            type="number"
            value={sizeDetail.quantity || 0}
            onChange={(e) =>
              onFieldChange(
                colorId,
                sizeDetail.sizeId,
                "quantity",
                e.target.value,
              )
            }
            className="w-16 px-2 py-1 text-xs border border-slate-200 rounded outline-none"
          />
        </td>
        <td className="py-3 font-semibold text-sm text-green-700">
          ৳{finalPrice.toLocaleString()}
        </td>
        <td className="py-3 text-right pr-2">
          {hasCustomDiscount && (
            <button
              type="button"
              onClick={() => {
                onFieldChange(colorId, sizeDetail.sizeId, "discountType", null);
                onFieldChange(colorId, sizeDetail.sizeId, "discount", 0);
              }}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase"
            >
              Reset
            </button>
          )}
        </td>
      </tr>
    );
  },
);

SizeRow.displayName = "SizeRow";

export default VariantNSizes;
