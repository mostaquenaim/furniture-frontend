"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import JsBarcode from "jsbarcode";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import { useBarcodeScanInput } from "@/hooks/Barcode/useBarcodeScanInput";
import { printLabelSheet } from "@/component/admin/PrintLabels/printLabels";
import { Piece, ReceiveOutcome } from "@/types/piece.types";
import { Supplier } from "@/types/supplier.types";
import { InventoryListResponse, InventoryRow } from "@/types/inventory";
import {
  DamageBySupplier,
  InventorySummary,
  ShelfMapEntry,
} from "@/types/piece-dashboard.types";

interface WarehouseLocationOption {
  id: string;
  code: string;
  label?: string | null;
}

type Tab = "generate" | "receive" | "location" | "return" | "reports";

// ─── Barcode SVG (client-rendered, no auth-header issues for print) ─────────
function BarcodeSvg({ value }: { value: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!ref.current || !value) return;
    JsBarcode(ref.current, value, {
      format: "CODE128",
      displayValue: true,
      fontSize: 10,
      height: 28,
      margin: 2,
    });
  }, [value]);
  return <svg ref={ref} className="max-w-full" />;
}

export default function PieceInventoryManagement() {
  const axiosSecure = useAxiosSecure();
  const [tab, setTab] = useState<Tab>("generate");

  // ── Generate & Print ──────────────────────────────────────────────────────
  const [variantSearch, setVariantSearch] = useState("");
  const [variantResults, setVariantResults] = useState<InventoryRow[]>([]);
  const [searchingVariants, setSearchingVariants] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<InventoryRow | null>(
    null,
  );
  const [genQuantity, setGenQuantity] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [generatedPieces, setGeneratedPieces] = useState<Piece[]>([]);
  const [printEntries, setPrintEntries] = useState<Piece[] | null>(null);

  useEffect(() => {
    const id = setTimeout(async () => {
      if (variantSearch.trim().length < 2) {
        setVariantResults([]);
        return;
      }
      setSearchingVariants(true);
      try {
        const { data } = await axiosSecure.get<InventoryListResponse>(
          "/inventory",
          { params: { search: variantSearch.trim(), take: 8 } },
        );
        setVariantResults(data.items);
      } catch {
        // non-critical
      } finally {
        setSearchingVariants(false);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [variantSearch, axiosSecure]);

  const handleGenerate = async () => {
    if (!selectedVariant) {
      toast.error("Pick a product variant first");
      return;
    }
    if (genQuantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }
    setGenerating(true);
    try {
      const { data } = await axiosSecure.post<Piece[]>("/pieces/generate", {
        productSizeId: selectedVariant.productSizeId,
        quantity: genQuantity,
      });
      setGeneratedPieces(data);
      toast.success(`Generated ${data.length} unique barcodes`);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Failed to generate pieces",
      );
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    if (!generatedPieces.length) return;
    setPrintEntries(generatedPieces);
    setTimeout(() => {
      printLabelSheet(50, 30, 0);
    }, 150);
  };

  useEffect(() => {
    if (!printEntries) return;
    const clear = () => setPrintEntries(null);
    window.addEventListener("afterprint", clear);
    return () => window.removeEventListener("afterprint", clear);
  }, [printEntries]);

  // ── Receive ────────────────────────────────────────────────────────────────
  const [receiveInput, setReceiveInput] = useState("");
  const [lookupPiece, setLookupPiece] = useState<Piece | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierId, setSupplierId] = useState<number | "">("");
  const [processingReceive, setProcessingReceive] = useState(false);
  const [receivedThisSession, setReceivedThisSession] = useState<Piece[]>([]);

  useEffect(() => {
    axiosSecure
      .get<Supplier[]>("/suppliers", { params: { activeOnly: true } })
      .then(({ data }) => setSuppliers(data))
      .catch(() => {});
  }, [axiosSecure]);

  const doReceiveLookup = useCallback(
    async (barcodeValue: string) => {
      setLookupError(null);
      setLookupPiece(null);
      try {
        const { data } = await axiosSecure.post<Piece>(
          "/pieces/receive/lookup",
          { barcodeValue },
        );
        setLookupPiece(data);
      } catch (err: any) {
        setLookupError(
          err?.response?.data?.message ?? `No piece found for ${barcodeValue}`,
        );
      }
    },
    [axiosSecure],
  );

  const { simulateManualEntry } = useBarcodeScanInput({
    enabled: tab === "receive",
    onScan: (value) => {
      setReceiveInput(value);
      doReceiveLookup(value);
    },
  });

  const confirmReceive = async (outcome: ReceiveOutcome) => {
    if (!lookupPiece) return;
    setProcessingReceive(true);
    try {
      const { data } = await axiosSecure.post<Piece>("/pieces/receive", {
        barcodeValue: lookupPiece.barcodeValue,
        supplierId: supplierId || undefined,
        outcome,
      });
      setReceivedThisSession((prev) => [data, ...prev]);
      toast.success(
        outcome === "GOOD"
          ? `${lookupPiece.barcodeValue} marked In Stock`
          : `${lookupPiece.barcodeValue} marked Damaged`,
      );
      setLookupPiece(null);
      setReceiveInput("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to receive piece");
    } finally {
      setProcessingReceive(false);
    }
  };

  // ── Assign Location ──────────────────────────────────────────────────────
  const [locationInput, setLocationInput] = useState("");
  const [locationPiece, setLocationPiece] = useState<Piece | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locations, setLocations] = useState<WarehouseLocationOption[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [assigningLocation, setAssigningLocation] = useState(false);

  useEffect(() => {
    axiosSecure
      .get<WarehouseLocationOption[]>("/barcodes/locations")
      .then(({ data }) => setLocations(data))
      .catch(() => {});
  }, [axiosSecure]);

  const doLocationLookup = useCallback(
    async (barcodeValue: string) => {
      setLocationError(null);
      setLocationPiece(null);
      try {
        const { data } = await axiosSecure.get<Piece>(
          `/pieces/by-code/${encodeURIComponent(barcodeValue)}`,
        );
        setLocationPiece(data);
      } catch (err: any) {
        setLocationError(
          err?.response?.data?.message ?? `No piece found for ${barcodeValue}`,
        );
      }
    },
    [axiosSecure],
  );

  useBarcodeScanInput({
    enabled: tab === "location",
    onScan: (value) => {
      setLocationInput(value);
      doLocationLookup(value);
    },
  });

  const confirmLocation = async () => {
    if (!locationPiece || !selectedLocationId) return;
    setAssigningLocation(true);
    try {
      await axiosSecure.post(
        `/pieces/${encodeURIComponent(locationPiece.barcodeValue)}/location`,
        { locationId: selectedLocationId },
      );
      toast.success(`${locationPiece.barcodeValue} shelved`);
      setLocationPiece(null);
      setLocationInput("");
      setSelectedLocationId("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to assign location");
    } finally {
      setAssigningLocation(false);
    }
  };

  // ── Process Return ────────────────────────────────────────────────────────
  const [returnInput, setReturnInput] = useState("");
  const [returnPiece, setReturnPiece] = useState<Piece | null>(null);
  const [returnError, setReturnError] = useState<string | null>(null);
  const [processingReturn, setProcessingReturn] = useState(false);
  const [returnedThisSession, setReturnedThisSession] = useState<Piece[]>([]);

  const doReturnLookup = useCallback(
    async (barcodeValue: string) => {
      setReturnError(null);
      setReturnPiece(null);
      try {
        const { data } = await axiosSecure.post<Piece>("/pieces/return/lookup", {
          barcodeValue,
        });
        setReturnPiece(data);
      } catch (err: any) {
        setReturnError(
          err?.response?.data?.message ?? `No piece found for ${barcodeValue}`,
        );
      }
    },
    [axiosSecure],
  );

  const { simulateManualEntry: simulateReturnEntry } = useBarcodeScanInput({
    enabled: tab === "return",
    onScan: (value) => {
      setReturnInput(value);
      doReturnLookup(value);
    },
  });

  const confirmReturn = async (outcome: ReceiveOutcome) => {
    if (!returnPiece) return;
    setProcessingReturn(true);
    try {
      const { data } = await axiosSecure.post<Piece>("/pieces/return/receive", {
        barcodeValue: returnPiece.barcodeValue,
        outcome,
      });
      setReturnedThisSession((prev) => [data, ...prev]);
      toast.success(
        outcome === "GOOD"
          ? `${returnPiece.barcodeValue} back in stock`
          : `${returnPiece.barcodeValue} marked damaged`,
      );
      setReturnPiece(null);
      setReturnInput("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to process return");
    } finally {
      setProcessingReturn(false);
    }
  };

  // ── Reports ──────────────────────────────────────────────────────────────
  const [summary, setSummary] = useState<InventorySummary | null>(null);
  const [shelfMap, setShelfMap] = useState<ShelfMapEntry[]>([]);
  const [damageBySupplier, setDamageBySupplier] = useState<DamageBySupplier[]>(
    [],
  );
  const [loadingReports, setLoadingReports] = useState(false);

  useEffect(() => {
    if (tab !== "reports") return;
    setLoadingReports(true);
    Promise.all([
      axiosSecure.get<InventorySummary>("/pieces/dashboard/inventory-summary"),
      axiosSecure.get<ShelfMapEntry[]>("/pieces/dashboard/shelf-map"),
      axiosSecure.get<DamageBySupplier[]>("/pieces/dashboard/damage-report", {
        params: { groupBy: "supplier" },
      }),
    ])
      .then(([s, m, d]) => {
        setSummary(s.data);
        setShelfMap(m.data.filter((l) => l.pieceCount > 0));
        setDamageBySupplier(d.data);
      })
      .catch(() => toast.error("Failed to load reports"))
      .finally(() => setLoadingReports(false));
  }, [tab, axiosSecure]);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Piece Barcodes
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Every physical unit gets its own unique barcode — generate, receive,
          and shelve them here.
        </p>
      </div>

      <div className="flex gap-2 print:hidden">
        {(
          [
            { key: "generate", label: "Generate & Print" },
            { key: "receive", label: "Receive" },
            { key: "location", label: "Assign Location" },
            { key: "return", label: "Process Return" },
            { key: "reports", label: "Reports" },
          ] as { key: Tab; label: string }[]
        ).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              tab === t.key
                ? "bg-slate-800 text-white"
                : "bg-white text-slate-600 border border-gray-200 hover:bg-slate-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Generate & Print ── */}
      {tab === "generate" && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4 print:hidden">
          <div className="relative">
            <input
              value={variantSearch}
              onChange={(e) => {
                setVariantSearch(e.target.value);
                setSelectedVariant(null);
              }}
              placeholder="Search product to generate piece barcodes for…"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
            />
            {variantSearch.length >= 2 && !selectedVariant && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                {searchingVariants ? (
                  <p className="px-4 py-3 text-xs text-gray-400">
                    Searching…
                  </p>
                ) : variantResults.length === 0 ? (
                  <p className="px-4 py-3 text-xs text-gray-400">
                    No matching variants.
                  </p>
                ) : (
                  variantResults.map((r) => (
                    <button
                      key={r.productSizeId}
                      onClick={() => {
                        setSelectedVariant(r);
                        setVariantSearch(
                          `${r.product.title} — ${r.color} / ${r.size}`,
                        );
                        setGeneratedPieces([]);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                    >
                      <span>
                        {r.product.title}{" "}
                        <span className="text-gray-400">
                          ({r.color} / {r.size})
                        </span>
                      </span>
                      <span className="text-xs text-gray-400">
                        qty {r.quantity}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {selectedVariant && (
            <div className="flex items-end gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                  Quantity (pieces to generate)
                </label>
                <input
                  type="number"
                  min={1}
                  value={genQuantity}
                  onChange={(e) =>
                    setGenQuantity(Math.max(1, Number(e.target.value)))
                  }
                  className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50"
              >
                {generating ? "Generating…" : "Generate Pieces"}
              </button>
            </div>
          )}

          {generatedPieces.length > 0 && (
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-800">
                  {generatedPieces.length} barcodes generated
                </p>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500 text-white hover:bg-amber-600"
                >
                  Print Stickers
                </button>
              </div>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {generatedPieces.map((p) => (
                  <span
                    key={p.id}
                    className="text-[11px] font-mono bg-slate-50 border border-gray-100 rounded px-2 py-1"
                  >
                    {p.barcodeValue}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Receive ── */}
      {tab === "receive" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 print:hidden">
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <p className="text-sm font-semibold text-gray-800">
              Scan or type a barcode to receive it
            </p>
            <div className="flex gap-2">
              <input
                value={receiveInput}
                onChange={(e) => setReceiveInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") simulateManualEntry(receiveInput);
                }}
                placeholder="PC-00000001"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono"
              />
              <button
                onClick={() => simulateManualEntry(receiveInput)}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 text-white hover:bg-slate-700"
              >
                Look up
              </button>
            </div>

            {lookupError && (
              <p className="text-sm text-red-600">{lookupError}</p>
            )}

            {lookupPiece && (
              <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4 space-y-3">
                <div>
                  <p className="font-medium text-gray-800">
                    {lookupPiece.productSize.color.product.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {lookupPiece.productSize.color.color.name} /{" "}
                    {lookupPiece.productSize.size.name} — {lookupPiece.barcodeValue}
                  </p>
                </div>

                <select
                  value={supplierId}
                  onChange={(e) =>
                    setSupplierId(e.target.value ? Number(e.target.value) : "")
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value="">Select supplier (optional)</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={() => confirmReceive("GOOD")}
                    disabled={processingReceive}
                    className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    Good — In Stock
                  </button>
                  <button
                    onClick={() => confirmReceive("DAMAGED")}
                    disabled={processingReceive}
                    className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    Damaged
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">
              Received this session ({receivedThisSession.length})
            </p>
            <div className="space-y-1.5 max-h-80 overflow-y-auto">
              {receivedThisSession.length === 0 ? (
                <p className="text-xs text-gray-400">Nothing yet.</p>
              ) : (
                receivedThisSession.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50"
                  >
                    <span className="font-mono text-xs">{p.barcodeValue}</span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        p.status === "IN_STOCK"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Assign Location ── */}
      {tab === "location" && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4 max-w-xl print:hidden">
          <p className="text-sm font-semibold text-gray-800">
            Scan or type a barcode to shelve it
          </p>
          <div className="flex gap-2">
            <input
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") doLocationLookup(locationInput);
              }}
              placeholder="PC-00000001"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono"
            />
            <button
              onClick={() => doLocationLookup(locationInput)}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 text-white hover:bg-slate-700"
            >
              Look up
            </button>
          </div>

          {locationError && (
            <p className="text-sm text-red-600">{locationError}</p>
          )}

          {locationPiece && (
            <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4 space-y-3">
              <div>
                <p className="font-medium text-gray-800">
                  {locationPiece.productSize.color.product.title}
                </p>
                <p className="text-xs text-gray-500">
                  {locationPiece.productSize.color.color.name} /{" "}
                  {locationPiece.productSize.size.name} — status:{" "}
                  {locationPiece.status}
                </p>
              </div>

              {locationPiece.status !== "IN_STOCK" ? (
                <p className="text-sm text-red-600">
                  Only in-stock pieces can be shelved.
                </p>
              ) : (
                <>
                  <select
                    value={selectedLocationId}
                    onChange={(e) => setSelectedLocationId(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    <option value="">Select shelf location</option>
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.code} {l.label ? `— ${l.label}` : ""}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={confirmLocation}
                    disabled={!selectedLocationId || assigningLocation}
                    className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50"
                  >
                    {assigningLocation ? "Assigning…" : "Assign Location"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Process Return ── */}
      {tab === "return" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 print:hidden">
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <p className="text-sm font-semibold text-gray-800">
              Scan or type a returned barcode
            </p>
            <div className="flex gap-2">
              <input
                value={returnInput}
                onChange={(e) => setReturnInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") simulateReturnEntry(returnInput);
                }}
                placeholder="PC-00000001"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono"
              />
              <button
                onClick={() => simulateReturnEntry(returnInput)}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 text-white hover:bg-slate-700"
              >
                Look up
              </button>
            </div>

            {returnError && (
              <p className="text-sm text-red-600">{returnError}</p>
            )}

            {returnPiece && (
              <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4 space-y-3">
                <div>
                  <p className="font-medium text-gray-800">
                    {returnPiece.productSize.color.product.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {returnPiece.productSize.color.color.name} /{" "}
                    {returnPiece.productSize.size.name} —{" "}
                    {returnPiece.barcodeValue}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => confirmReturn("GOOD")}
                    disabled={processingReturn}
                    className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    Good — Back to Stock
                  </button>
                  <button
                    onClick={() => confirmReturn("DAMAGED")}
                    disabled={processingReturn}
                    className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    Damaged
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">
              Processed this session ({returnedThisSession.length})
            </p>
            <div className="space-y-1.5 max-h-80 overflow-y-auto">
              {returnedThisSession.length === 0 ? (
                <p className="text-xs text-gray-400">Nothing yet.</p>
              ) : (
                returnedThisSession.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50"
                  >
                    <span className="font-mono text-xs">{p.barcodeValue}</span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        p.status === "RETURNED_IN_STOCK"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Reports ── */}
      {tab === "reports" && (
        <div className="space-y-5 print:hidden">
          {loadingReports ? (
            <p className="text-sm text-gray-400">Loading…</p>
          ) : (
            <>
              {summary && (
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <p className="text-sm font-semibold text-gray-800 mb-3">
                    Pieces by status
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {(Object.keys(summary) as (keyof InventorySummary)[]).map(
                      (status) => (
                        <div
                          key={status}
                          className="rounded-lg border border-gray-100 p-3 text-center"
                        >
                          <p className="text-lg font-bold text-gray-800">
                            {summary[status]}
                          </p>
                          <p className="text-[10px] uppercase tracking-wide text-gray-400 mt-0.5">
                            {status.replace(/_/g, " ")}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <p className="text-sm font-semibold text-gray-800 mb-3">
                  Shelf map ({shelfMap.length} occupied location
                  {shelfMap.length === 1 ? "" : "s"})
                </p>
                {shelfMap.length === 0 ? (
                  <p className="text-xs text-gray-400">
                    No pieces currently shelved.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {shelfMap.map((loc) => (
                      <details
                        key={loc.id}
                        className="border border-gray-100 rounded-lg px-3 py-2"
                      >
                        <summary className="flex items-center justify-between text-sm cursor-pointer">
                          <span className="font-medium text-gray-800">
                            {loc.code} {loc.label ? `— ${loc.label}` : ""}
                          </span>
                          <span className="text-xs text-gray-400">
                            {loc.pieceCount} piece{loc.pieceCount === 1 ? "" : "s"}
                          </span>
                        </summary>
                        <div className="mt-2 space-y-1">
                          {loc.pieces.map((p) => (
                            <div
                              key={p.barcodeValue}
                              className="flex items-center justify-between text-xs text-gray-600"
                            >
                              <span className="font-mono">{p.barcodeValue}</span>
                              <span>
                                {p.productTitle} ({p.color}/{p.size})
                              </span>
                            </div>
                          ))}
                        </div>
                      </details>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <p className="text-sm font-semibold text-gray-800 mb-3">
                  Damage report by supplier
                </p>
                {damageBySupplier.length === 0 ? (
                  <p className="text-xs text-gray-400">
                    No damaged pieces recorded.
                  </p>
                ) : (
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-[10px] uppercase text-gray-400 border-b border-gray-100">
                        <th className="py-1.5">Supplier</th>
                        <th className="py-1.5">Damaged Incoming</th>
                        <th className="py-1.5">Damaged Return</th>
                      </tr>
                    </thead>
                    <tbody>
                      {damageBySupplier.map((d) => (
                        <tr
                          key={d.supplierId ?? "unknown"}
                          className="border-b border-gray-50"
                        >
                          <td className="py-1.5">{d.supplierName}</td>
                          <td className="py-1.5">{d.incomingCount}</td>
                          <td className="py-1.5">{d.returnCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Hidden print sheet ── */}
      <div className="print-label-sheet fixed -left-2500 -top-2500">
        {printEntries && (
          <div className="flex flex-wrap gap-2">
            {printEntries.map((p) => (
              <div
                key={p.id}
                className="label flex flex-col items-center justify-center bg-white text-black"
                style={{
                  width: "50mm",
                  height: "30mm",
                  padding: "1.5mm",
                  boxSizing: "border-box",
                }}
              >
                <div className="text-[8pt] font-semibold text-center leading-tight">
                  {p.productSize.color.product.title}
                </div>
                <div className="text-[7pt] text-center text-gray-700">
                  {p.productSize.color.color.name} / {p.productSize.size.name}
                </div>
                <BarcodeSvg value={p.barcodeValue} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
