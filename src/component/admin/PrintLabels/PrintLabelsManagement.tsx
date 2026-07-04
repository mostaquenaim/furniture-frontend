"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Search, Printer, X } from "lucide-react";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import useFetchProducts from "@/hooks/Products/useFetchProducts";
import useFetchCompany from "@/hooks/Company/useFetchCompany";
import { Product } from "@/types/product.types";
import LabelSheet from "./LabelSheet";
import { printLabelSheet } from "./printLabels";
import { LABEL_TEMPLATES, CUSTOM_TEMPLATE_NAME } from "./LabelTemplates";
import { DEFAULT_LABEL_CONFIG, LabelFieldConfig, LabelRow } from "./types";

const CONFIG_STORAGE_KEY = "printLabelsFieldConfig";

interface BackendInventoryItem {
  id: string;
  barcode: string;
  lotNumber?: string | null;
  packingDate?: string | null;
  productSize?: {
    size?: { name: string };
    color?: { color?: { name: string } };
  } | null;
}

const fieldLabels: Record<keyof LabelFieldConfig, string> = {
  productName: "Product Name",
  variation: "Product Variation",
  price: "Product Price",
  businessName: "Business Name",
  packingDate: "Packing Date",
  lotNumber: "Lot Number",
};

const loadStoredConfig = (): LabelFieldConfig => {
  if (typeof window === "undefined") return DEFAULT_LABEL_CONFIG;
  try {
    const raw = window.localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!raw) return DEFAULT_LABEL_CONFIG;
    return { ...DEFAULT_LABEL_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_LABEL_CONFIG;
  }
};

export default function PrintLabelsManagement() {
  const axiosSecure = useAxiosSecure();
  const { company } = useFetchCompany();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [labelRows, setLabelRows] = useState<LabelRow[]>([]);
  const [addingProductId, setAddingProductId] = useState<number | null>(null);

  const [labelConfig, setLabelConfig] =
    useState<LabelFieldConfig>(loadStoredConfig);

  const [templateName, setTemplateName] = useState(LABEL_TEMPLATES[3].name);
  const [customWidth, setCustomWidth] = useState(50);
  const [customHeight, setCustomHeight] = useState(76);
  const [printing, setPrinting] = useState(false);
  const [printEntries, setPrintEntries] = useState<LabelRow[] | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    window.localStorage.setItem(
      CONFIG_STORAGE_KEY,
      JSON.stringify(labelConfig),
    );
  }, [labelConfig]);

  const { products, isFetching } = useFetchProducts({
    search: debouncedSearch,
    limit: 8,
    enabled: debouncedSearch.length > 1,
  });

  const activeTemplate = useMemo(() => {
    if (templateName === CUSTOM_TEMPLATE_NAME) {
      return { widthMm: customWidth, heightMm: customHeight };
    }
    const found = LABEL_TEMPLATES.find((t) => t.name === templateName);
    return found
      ? { widthMm: found.widthMm, heightMm: found.heightMm }
      : { widthMm: customWidth, heightMm: customHeight };
  }, [templateName, customWidth, customHeight]);

  const toggleField = (key: keyof LabelFieldConfig) => {
    setLabelConfig((prev) => ({
      ...prev,
      [key]: { ...prev[key], show: !prev[key].show },
    }));
  };

  const setFieldSize = (key: keyof LabelFieldConfig, sizePt: number) => {
    setLabelConfig((prev) => ({
      ...prev,
      [key]: { ...prev[key], sizePt },
    }));
  };

  const handleSelectProduct = useCallback(
    async (product: Product) => {
      setAddingProductId(product.id);
      try {
        const { data } = await axiosSecure.get<BackendInventoryItem[]>(
          `/barcodes/product/${product.id}`,
        );

        let items = data ?? [];
        if (!items.length) {
          const { data: created } = await axiosSecure.post(`/barcodes`, {
            productId: product.id,
          });
          items = [created];
        }

        setLabelRows((prev) => {
          const existingIds = new Set(prev.map((r) => r.barcodeId));
          const newRows: LabelRow[] = items
            .filter((item) => !existingIds.has(item.id))
            .map((item) => {
              const colorName = item.productSize?.color?.color?.name;
              const sizeName = item.productSize?.size?.name;
              const variation = [colorName, sizeName]
                .filter(Boolean)
                .join(" / ");
              return {
                barcodeId: item.id,
                barcodeValue: item.barcode,
                productTitle: product.title,
                variation: variation || undefined,
                price: product.price,
                lotNumber: item.lotNumber ?? "",
                packingDate: item.packingDate
                  ? item.packingDate.slice(0, 10)
                  : "",
                labelQty: 1,
              };
            });

          if (!newRows.length && items.length) {
            toast("Already added to the label list");
          }

          return [...prev, ...newRows];
        });

        setSearch("");
        setShowDropdown(false);
      } catch {
        toast.error("Failed to load barcode for this product");
      } finally {
        setAddingProductId(null);
      }
    },
    [axiosSecure],
  );

  const updateRow = (barcodeId: string, patch: Partial<LabelRow>) => {
    setLabelRows((prev) =>
      prev.map((r) => (r.barcodeId === barcodeId ? { ...r, ...patch } : r)),
    );
  };

  const removeRow = (barcodeId: string) => {
    setLabelRows((prev) => prev.filter((r) => r.barcodeId !== barcodeId));
  };

  const handlePrint = async () => {
    if (!labelRows.length) return;
    setPrinting(true);
    try {
      await axiosSecure.post("/barcodes/print", {
        items: labelRows.map((r) => ({
          barcodeId: r.barcodeId,
          labelQty: Math.max(r.labelQty, 1),
          ...(r.lotNumber ? { lotNumber: r.lotNumber } : {}),
          ...(r.packingDate ? { packingDate: r.packingDate } : {}),
        })),
      });

      const expanded = labelRows.flatMap((row) =>
        Array.from({ length: Math.max(row.labelQty, 1) }, () => row),
      );
      setPrintEntries(expanded);
    } catch {
      toast.error("Failed to save label print info");
    } finally {
      setPrinting(false);
    }
  };

  useEffect(() => {
    if (!printEntries) return;
    const t = setTimeout(() => {
      printLabelSheet(activeTemplate.widthMm, activeTemplate.heightMm);
    }, 150);
    const clear = () => setPrintEntries(null);
    window.addEventListener("afterprint", clear);
    return () => {
      clearTimeout(t);
      window.removeEventListener("afterprint", clear);
    };
  }, [printEntries, activeTemplate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-xl font-semibold text-gray-900">Print Labels</h1>
        <button
          onClick={handlePrint}
          disabled={!labelRows.length || printing}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
        >
          <Printer size={14} />
          {printing ? "Preparing…" : "Print Labels"}
        </button>
      </div>

      {/* ── Product search & table ── */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 print:hidden">
        <p className="text-sm font-semibold text-gray-800 mb-3">
          Add products to generate labels
        </p>

        <div className="relative">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Enter product name to add labels"
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>

          {showDropdown && debouncedSearch.length > 1 && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-y-auto">
              {isFetching ? (
                <p className="px-4 py-3 text-xs text-gray-400">Searching…</p>
              ) : products.length === 0 ? (
                <p className="px-4 py-3 text-xs text-gray-400">
                  No products found.
                </p>
              ) : (
                products.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectProduct(p)}
                    disabled={addingProductId === p.id}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="text-gray-800">{p.title}</span>
                    <span className="text-xs text-gray-400">
                      {addingProductId === p.id ? "Adding…" : `৳${p.price}`}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-gray-100">
                <th className="py-2 pr-4">Product</th>
                <th className="py-2 px-4 w-28">No. of labels</th>
                <th className="py-2 px-4 w-36">Lot Number</th>
                <th className="py-2 px-4 w-40">Packing Date</th>
                <th className="py-2 pl-4 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {labelRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400">
                    No products added yet.
                  </td>
                </tr>
              ) : (
                labelRows.map((row) => (
                  <tr key={row.barcodeId}>
                    <td className="py-2.5 pr-4">
                      <p className="font-medium text-gray-800">
                        {row.productTitle}
                      </p>
                      {row.variation && (
                        <p className="text-xs text-gray-400">
                          {row.variation}
                        </p>
                      )}
                    </td>
                    <td className="py-2.5 px-4">
                      <input
                        type="number"
                        min={1}
                        value={row.labelQty}
                        onChange={(e) =>
                          updateRow(row.barcodeId, {
                            labelQty: Math.max(1, Number(e.target.value)),
                          })
                        }
                        className="w-20 border border-gray-200 rounded-md px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="py-2.5 px-4">
                      <input
                        value={row.lotNumber ?? ""}
                        onChange={(e) =>
                          updateRow(row.barcodeId, {
                            lotNumber: e.target.value,
                          })
                        }
                        placeholder="—"
                        className="w-full border border-gray-200 rounded-md px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="py-2.5 px-4">
                      <input
                        type="date"
                        value={row.packingDate ?? ""}
                        onChange={(e) =>
                          updateRow(row.barcodeId, {
                            packingDate: e.target.value,
                          })
                        }
                        className="w-full border border-gray-200 rounded-md px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="py-2.5 pl-4 text-right">
                      <button
                        onClick={() => removeRow(row.barcodeId)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Label field config + size + preview ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:hidden">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm font-semibold text-gray-800 mb-3">
            Information to show in Labels
          </p>
          <div className="space-y-3">
            {(Object.keys(fieldLabels) as (keyof LabelFieldConfig)[]).map(
              (key) => (
                <div key={key} className="flex items-center gap-3">
                  <label className="flex items-center gap-2 flex-1 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={labelConfig[key].show}
                      onChange={() => toggleField(key)}
                      className="accent-amber-500 w-4 h-4"
                    />
                    {fieldLabels[key]}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-400 uppercase">
                      Size
                    </span>
                    <input
                      type="number"
                      min={5}
                      max={24}
                      value={labelConfig[key].sizePt}
                      onChange={(e) =>
                        setFieldSize(key, Number(e.target.value))
                      }
                      className="w-16 border border-gray-200 rounded-md px-2 py-1 text-sm"
                    />
                  </div>
                </div>
              ),
            )}
          </div>

          <div className="mt-5 pt-5 border-t border-gray-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Barcode setting
            </p>
            <select
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              {LABEL_TEMPLATES.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
              <option value={CUSTOM_TEMPLATE_NAME}>Custom</option>
            </select>

            {templateName === CUSTOM_TEMPLATE_NAME && (
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase block mb-1">
                    Width (mm)
                  </label>
                  <input
                    type="number"
                    min={10}
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 uppercase block mb-1">
                    Height (mm)
                  </label>
                  <input
                    type="number"
                    min={10}
                    value={customHeight}
                    onChange={(e) => setCustomHeight(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm font-semibold text-gray-800 mb-3">Preview</p>
          <div className="bg-slate-50 rounded-lg p-4 overflow-auto max-h-[420px]">
            {labelRows.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-10">
                Add a product to preview its label.
              </p>
            ) : (
              <LabelSheet
                entries={labelRows}
                config={labelConfig}
                widthMm={activeTemplate.widthMm}
                heightMm={activeTemplate.heightMm}
                businessName={company?.name}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Hidden full-quantity sheet used only for the actual print job ── */}
      <div className="print-label-sheet fixed -left-2500 -top-2500">
        {printEntries && (
          <LabelSheet
            entries={printEntries}
            config={labelConfig}
            widthMm={activeTemplate.widthMm}
            heightMm={activeTemplate.heightMm}
            businessName={company?.name}
          />
        )}
      </div>
    </div>
  );
}
