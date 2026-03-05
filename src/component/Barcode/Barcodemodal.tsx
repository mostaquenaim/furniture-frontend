/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useState } from "react";
import { X, Printer, Plus, MapPin, Package } from "lucide-react";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";

interface InventoryItem {
  id: string;
  barcode: string;
  barcodeType: "CODE128" | "QR" | "EAN13";
  quantity: number;
  lowStockAt: number;
  printCount: number;
  printedAt?: string;
  locationId?: string;
  location?: {
    id: string;
    code: string;
    label?: string;
    zone: string;
    aisle: string;
    shelf: string;
    bin: string;
  };
  productSize?: {
    id: number;
    sku?: string;
    quantity: number;
    color: { color: { name: string; hexCode?: string } };
    size: { name: string };
  };
}

interface WarehouseLocation {
  id: string;
  code: string;
  label?: string;
}

interface BarcodeModalProps {
  productId: number;
  productTitle: string;
  onClose: () => void;
}

export default function BarcodeModal({
  productId,
  productTitle,
  onClose,
}: BarcodeModalProps) {
  const axiosSecure = useAxiosSecure();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [locations, setLocations] = useState<WarehouseLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [creating, setCreating] = useState(false);
  const [adjMap, setAdjMap] = useState<Record<string, number>>({});
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const token =
    typeof window !== "undefined" ? (localStorage.getItem("token") ?? "") : "";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [invRes, locRes] = await Promise.all([
        axiosSecure.get(`/barcodes/product/${productId}`),
        axiosSecure.get("/barcodes/locations"),
      ]);

      console.log(invRes.data, "invRes", locRes.data, "locRes");
      setItems(invRes.data ?? []);
      setLocations(locRes.data ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, productId]);

    useEffect(() => {
      load();
    }, [load, productId]);

  // ── Create inventory item ──────────────────────────────────────────────────
  const handleCreate = async () => {
    setCreating(true);
    try {
      await axiosSecure.post("/barcodes", { productId });
      await load();
    } finally {
      setCreating(false);
    }
  };

  // ── Assign location ────────────────────────────────────────────────────────
  const handleAssignLocation = async (itemId: string, locationId: string) => {
    await axiosSecure.patch(`/barcodes/${itemId}/location`, { locationId });
    await load();
  };

  // ── Stock adjustment ───────────────────────────────────────────────────────
  const handleApplyAdj = async (itemId: string) => {
    const delta = adjMap[itemId] ?? 0;
    if (!delta) return;
    setApplyingId(itemId);
    try {
      await axiosSecure.patch(`/barcodes/${itemId}/quantity`, { delta });
      setAdjMap((p) => ({ ...p, [itemId]: 0 }));
      await load();
    } finally {
      setApplyingId(null);
    }
  };

  // ── Print PDF ──────────────────────────────────────────────────────────────
  const handlePrint = async () => {
    const ids =
      selected.size > 0 ? Array.from(selected) : items.map((i) => i.id);
    if (!ids.length) return;
    setPrinting(true);
    try {
      const res = await axiosSecure.post(
        "/barcodes/print",
        { barcodeIds: ids },
        { responseType: "blob" },
      );
      const url = URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `labels-${productId}-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      await load();
    } finally {
      setPrinting(false);
    }
  };

  const toggleSelect = (id: string) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const isLow = (item: InventoryItem) => item.quantity <= item.lowStockAt;
  const isEmpty = (item: InventoryItem) => item.quantity === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Package size={16} className="text-gray-400" />
              Barcodes & Inventory
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-sm">
              {productTitle}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={handlePrint}
                disabled={printing}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
              >
                <Printer size={12} />
                {printing
                  ? "Generating…"
                  : selected.size > 0
                    ? `Print (${selected.size})`
                    : "Print All"}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Package size={20} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700">
                No inventory records
              </p>
              <p className="text-xs text-gray-400 mt-1 mb-5">
                Generate a barcode to start tracking this product
              </p>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
              >
                <Plus size={13} />
                {creating ? "Creating…" : "Generate Barcode"}
              </button>
            </div>
          ) : (
            <>
              {/* Add another */}
              <div className="flex justify-end">
                <button
                  onClick={handleCreate}
                  disabled={creating}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                >
                  <Plus size={12} />
                  {creating ? "Creating…" : "Add Another"}
                </button>
              </div>

              {/* Items */}
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl border transition-all ${
                    isEmpty(item)
                      ? "border-red-200 bg-red-50/40"
                      : isLow(item)
                        ? "border-amber-200 bg-amber-50/30"
                        : "border-gray-100 bg-white"
                  } ${selected.has(item.id) ? "ring-2 ring-gray-900" : ""}`}
                >
                  <div className="p-4 space-y-3">
                    {/* Row 1: checkbox + barcode image + barcode value */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selected.has(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="w-3.5 h-3.5 accent-gray-900 shrink-0"
                      />

                      {/* Barcode image */}
                      <div className="bg-white border border-gray-100 rounded-lg px-3 py-1.5 shrink-0">
                        <img
                          src={`${apiBase}/product/${item.id}/barcodeimage`}
                          alt={item.barcode}
                          className="h-8 w-auto"
                          style={{ imageRendering: "pixelated" }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <code className="text-[11px] bg-gray-100 px-2 py-0.5 rounded font-mono text-gray-700">
                            {item.barcode}
                          </code>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                            {item.barcodeType}
                          </span>
                          {item.printCount > 0 && (
                            <span className="text-[10px] text-gray-400">
                              Printed {item.printCount}×
                            </span>
                          )}
                        </div>
                        {item.productSize && (
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            {item.productSize.color.color.name} ·{" "}
                            {item.productSize.size.name}
                            {item.productSize.sku &&
                              ` · ${item.productSize.sku}`}
                          </p>
                        )}
                      </div>

                      {/* Stock badge */}
                      <span
                        className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-mono
                          ${
                            isEmpty(item)
                              ? "bg-red-100 text-red-700"
                              : isLow(item)
                                ? "bg-amber-100 text-amber-700"
                                : "bg-emerald-50 text-emerald-700"
                          }`}
                      >
                        {(isEmpty(item) || isLow(item)) && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                              isEmpty(item) ? "bg-red-500" : "bg-amber-400"
                            }`}
                          />
                        )}
                        {item.quantity} pcs
                      </span>
                    </div>

                    {/* Row 2: location + stock adjustment */}
                    <div className="flex items-center gap-3 flex-wrap pl-6">
                      {/* Location */}
                      <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
                        <MapPin size={11} className="text-gray-400 shrink-0" />
                        {item.location ? (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="bg-gray-900 text-amber-300 text-[10px] font-bold font-mono px-2 py-0.5 rounded tracking-widest">
                              {item.location.code}
                            </span>
                            {item.location.label && (
                              <span className="text-[11px] text-gray-500 italic">
                                {item.location.label}
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">
                            No location
                          </span>
                        )}
                        <select
                          value={item.locationId ?? ""}
                          onChange={(e) =>
                            handleAssignLocation(item.id, e.target.value)
                          }
                          className="ml-1 text-[11px] border border-gray-200 rounded-md px-1.5 py-1 text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
                        >
                          <option value="">— Assign —</option>
                          {locations.map((l) => (
                            <option key={l.id} value={l.id}>
                              {l.code}
                              {l.label ? ` · ${l.label}` : ""}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Stock adjuster */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider mr-1">
                          Adjust
                        </span>
                        <button
                          onClick={() =>
                            setAdjMap((p) => ({
                              ...p,
                              [item.id]: (p[item.id] ?? 0) - 1,
                            }))
                          }
                          className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition flex items-center justify-center"
                        >
                          −
                        </button>
                        <span
                          className={`font-mono text-sm w-8 text-center font-bold ${
                            (adjMap[item.id] ?? 0) > 0
                              ? "text-emerald-600"
                              : (adjMap[item.id] ?? 0) < 0
                                ? "text-red-600"
                                : "text-gray-400"
                          }`}
                        >
                          {(adjMap[item.id] ?? 0) > 0
                            ? `+${adjMap[item.id]}`
                            : (adjMap[item.id] ?? "0")}
                        </span>
                        <button
                          onClick={() =>
                            setAdjMap((p) => ({
                              ...p,
                              [item.id]: (p[item.id] ?? 0) + 1,
                            }))
                          }
                          className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition flex items-center justify-center"
                        >
                          +
                        </button>
                        {(adjMap[item.id] ?? 0) !== 0 && (
                          <button
                            onClick={() => handleApplyAdj(item.id)}
                            disabled={applyingId === item.id}
                            className="ml-1 px-2.5 py-1 bg-gray-900 text-white text-[10px] font-bold rounded-md hover:bg-gray-800 transition disabled:opacity-50"
                          >
                            {applyingId === item.id ? "…" : "Apply"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* ── Footer ── */}
        {items.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <p className="text-xs text-gray-400">
              {items.length} record{items.length !== 1 ? "s" : ""} ·{" "}
              {items.reduce((s, i) => s + i.quantity, 0)} total units
            </p>
            <p className="text-xs text-gray-400">
              {selected.size > 0
                ? `${selected.size} selected`
                : "Select items to print specific labels"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
