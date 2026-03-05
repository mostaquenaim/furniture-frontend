/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Location {
  id: string;
  code: string;
  zone: string;
  aisle: string;
  shelf: string;
  bin: string;
  label?: string;
}

interface BarcodeRecord {
  id: string;
  barcode: string;
  barcodeType: "CODE128" | "QR" | "EAN13";
  quantity: number;
  lowStockAt: number;
  printCount: number;
  printedAt?: string;
  product: { id: number; title: string; price: number };
  location?: Location;
}

// ── Tiny helpers ──────────────────────────────────────────────────────────────
const taka = (n: number) => `৳ ${Number(n).toLocaleString("en-BD")}`;

const StockChip = ({ qty, low }: { qty: number; low: number }) => {
  const isLow = qty <= low;
  const isEmpty = qty === 0;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono
        ${
          isEmpty
            ? "bg-red-100 text-red-700 ring-1 ring-red-300"
            : isLow
              ? "bg-amber-100 text-amber-700 ring-1 ring-amber-300"
              : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
        }`}
    >
      {isEmpty && (
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
      )}
      {isLow && !isEmpty && (
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      )}
      {qty}
    </span>
  );
};

const LocBadge = ({ code }: { code?: string }) =>
  code ? (
    <span className="inline-block px-2 py-0.5 bg-slate-900 text-amber-300 text-[10px] font-bold font-mono rounded tracking-widest">
      {code}
    </span>
  ) : (
    <span className="text-[11px] text-slate-400 italic">Unassigned</span>
  );

// ── Barcode image (fetched from backend) ─────────────────────────────────────
const BarcodeImg = ({ id, token }: { id: string; token: string }) => {
  const src = `${process.env.NEXT_PUBLIC_API_URL}/barcodes/${id}/image`;
  return (
    <img
      src={src}
      alt="barcode"
      className="h-10 w-auto mx-auto"
      style={{ imageRendering: "pixelated" }}
    />
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
export default function BarcodeManagement() {
  const axiosSecure = useAxiosSecure();
  const [barcodes, setBarcodes] = useState<BarcodeRecord[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [printing, setPrinting] = useState(false);
  const [tab, setTab] = useState<"all" | "lowstock" | "locations">("all");
  const [search, setSearch] = useState("");
  const [showLocForm, setShowLocForm] = useState(false);
  const [locForm, setLocForm] = useState({
    zone: "",
    aisle: "",
    shelf: "",
    bin: "",
    label: "",
  });
  const [adjMap, setAdjMap] = useState<Record<string, number>>({});
  const token =
    typeof window !== "undefined" ? (localStorage.getItem("token") ?? "") : "";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [bc, lc] = await Promise.all([
        axiosSecure.get("/barcodes"),
        axiosSecure.get("/barcodes/locations"),
      ]);

      console.log(bc.data);
      setBarcodes(bc.data);
      setLocations(lc.data);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  useEffect(() => {
    load();
  }, [load]);

  // ── Selection ──────────────────────────────────────────────────────────────
  const toggleSelect = (id: string) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const toggleAll = () =>
    setSelected((prev) =>
      prev.size === filtered.length
        ? new Set()
        : new Set(filtered.map((b) => b.id)),
    );

  // ── Print PDF ──────────────────────────────────────────────────────────────
  const handlePrint = async () => {
    if (!selected.size) return;
    setPrinting(true);
    try {
      const res = await axiosSecure.post(
        "/barcodes/print",
        { barcodeIds: Array.from(selected) },
        { responseType: "blob" },
      );
      const url = URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `sakigai-labels-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      await load();
    } finally {
      setPrinting(false);
    }
  };

  // ── Quantity adjustment ────────────────────────────────────────────────────
  const applyAdj = async (id: string) => {
    const delta = adjMap[id];
    if (!delta) return;
    await axiosSecure.patch(`/barcodes/${id}/quantity`, { delta });
    setAdjMap((p) => ({ ...p, [id]: 0 }));
    await load();
  };

  // ── Location assignment ────────────────────────────────────────────────────
  const assignLoc = async (barcodeId: string, locationId: string) => {
    await axiosSecure.patch(`/barcodes/${barcodeId}/location`, { locationId });
    await load();
  };

  // ── Create location ────────────────────────────────────────────────────────
  const createLocation = async () => {
    if (!locForm.zone || !locForm.aisle || !locForm.shelf || !locForm.bin)
      return;
    await axiosSecure.post("/barcodes/locations", locForm);
    setLocForm({ zone: "", aisle: "", shelf: "", bin: "", label: "" });
    setShowLocForm(false);
    await load();
  };

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered = barcodes.filter((b) => {
    const matchSearch =
      !search ||
      b.product.title.toLowerCase().includes(search.toLowerCase()) ||
      b.barcode.toLowerCase().includes(search.toLowerCase()) ||
      b.location?.code.toLowerCase().includes(search.toLowerCase());
    const matchTab =
      tab === "all"
        ? true
        : tab === "lowstock"
          ? b.quantity <= b.lowStockAt
          : true;
    return matchSearch && matchTab;
  });

  const lowStockCount = barcodes.filter(
    (b) => b.quantity <= b.lowStockAt,
  ).length;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&display=swap');
        .wh-font { font-family: 'Syne', sans-serif; }
        .mono { font-family: 'DM Mono', monospace; }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .row-anim { animation: fadeUp .3s ease both; }
      `}</style>

      <div className="min-h-screen bg-[#f0ede8]">
        {/* ── Top bar ── */}
        <div className="bg-[#0f172a] px-8 py-5 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div>
              <p className="wh-font text-[#e2c97e] text-lg tracking-wider">
                SAKIGAI
              </p>
              <p className="text-slate-500 text-[10px] tracking-[0.2em] uppercase mt-0.5">
                Warehouse · Barcode System
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {lowStockCount > 0 && (
              <span className="flex items-center gap-1.5 bg-red-950 text-red-400 border border-red-800 px-3 py-1.5 rounded-lg text-xs font-bold">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                {lowStockCount} Low Stock
              </span>
            )}
            <button
              onClick={handlePrint}
              disabled={!selected.size || printing}
              className="flex items-center gap-2 bg-[#e2c97e] text-[#0f172a] px-5 py-2 rounded-lg text-xs wh-font font-bold tracking-wider disabled:opacity-40 hover:bg-amber-300 transition"
            >
              <PrintIcon />
              {printing
                ? "Generating…"
                : `Print Labels${selected.size ? ` (${selected.size})` : ""}`}
            </button>
          </div>
        </div>

        <div className="px-8 py-6 max-w-[1400px] mx-auto">
          {/* ── Stats row ── */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total SKUs", value: barcodes.length, mono: true },
              {
                label: "Low Stock",
                value: lowStockCount,
                accent: "text-amber-600",
              },
              {
                label: "Out of Stock",
                value: barcodes.filter((b) => b.quantity === 0).length,
                accent: "text-red-600",
              },
              { label: "Locations", value: locations.length, mono: true },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-xl border border-slate-100 px-5 py-4 shadow-sm"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {s.label}
                </p>
                <p
                  className={`text-3xl font-bold mt-1 mono ${s.accent ?? "text-slate-900"}`}
                >
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* ── Tabs + search ── */}
          <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
            <div className="flex gap-1 bg-white rounded-xl p-1 border border-slate-100 shadow-sm">
              {(["all", "lowstock", "locations"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-2 rounded-lg text-xs font-bold tracking-wider transition-all wh-font
                    ${tab === t ? "bg-[#0f172a] text-[#e2c97e]" : "text-slate-500 hover:text-slate-800"}`}
                >
                  {t === "all"
                    ? "All Products"
                    : t === "lowstock"
                      ? "Low Stock"
                      : "Locations"}
                </button>
              ))}
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product, barcode, location…"
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 w-72 focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-sm"
            />
          </div>

          {/* ── Locations tab ── */}
          {tab === "locations" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <p className="wh-font text-slate-700 font-bold">
                  Warehouse Locations
                </p>
                <button
                  onClick={() => setShowLocForm(!showLocForm)}
                  className="bg-[#0f172a] text-[#e2c97e] px-4 py-2 rounded-lg text-xs wh-font font-bold tracking-wider hover:bg-slate-800 transition"
                >
                  + Add Location
                </button>
              </div>

              {showLocForm && (
                <div className="bg-white border border-slate-100 rounded-2xl p-6 mb-4 shadow-sm row-anim">
                  <p className="wh-font font-bold text-slate-900 mb-4">
                    New Inventory Location
                  </p>
                  <div className="grid grid-cols-5 gap-3">
                    {(["zone", "aisle", "shelf", "bin"] as const).map((f) => (
                      <div key={f}>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                          {f}
                        </label>
                        <input
                          value={locForm[f]}
                          onChange={(e) =>
                            setLocForm((p) => ({ ...p, [f]: e.target.value }))
                          }
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mono focus:outline-none focus:ring-2 focus:ring-amber-300"
                          placeholder={
                            f === "zone"
                              ? "A"
                              : f === "aisle"
                                ? "3"
                                : f === "shelf"
                                  ? "B"
                                  : "02"
                          }
                        />
                      </div>
                    ))}
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                        Label
                      </label>
                      <input
                        value={locForm.label}
                        onChange={(e) =>
                          setLocForm((p) => ({ ...p, label: e.target.value }))
                        }
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                        placeholder="Dining North"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={createLocation}
                      className="bg-[#0f172a] text-[#e2c97e] px-5 py-2 rounded-lg text-xs wh-font font-bold"
                    >
                      Create Location
                    </button>
                    <button
                      onClick={() => setShowLocForm(false)}
                      className="text-slate-500 text-xs px-4 py-2 rounded-lg hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                {locations.map((loc) => (
                  <div
                    key={loc.id}
                    className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm row-anim"
                  >
                    <div className="flex items-start justify-between">
                      <span className="mono text-lg font-bold text-[#0f172a] bg-[#f0ede8] px-3 py-1 rounded-lg">
                        {loc.code}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        Zone {loc.zone}
                      </span>
                    </div>
                    {loc.label && (
                      <p className="text-sm text-slate-500 mt-3 italic">
                        {loc.label}
                      </p>
                    )}
                    <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                      {[
                        ["Aisle", loc.aisle],
                        ["Shelf", loc.shelf],
                        ["Bin", loc.bin],
                      ].map(([k, v]) => (
                        <div key={k} className="bg-slate-50 rounded-lg p-2">
                          <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                            {k}
                          </p>
                          <p className="mono font-bold text-slate-900 text-lg">
                            {v}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Barcode table ── */}
          {tab !== "locations" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-[#0f172a] bg-[#0f172a]">
                    <th className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={
                          selected.size === filtered.length &&
                          filtered.length > 0
                        }
                        onChange={toggleAll}
                        className="accent-amber-400 w-4 h-4 rounded"
                      />
                    </th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Product
                    </th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Barcode
                    </th>
                    <th className="text-center px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Image
                    </th>
                    <th className="text-center px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Location
                    </th>
                    <th className="text-center px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Stock
                    </th>
                    <th className="text-center px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Adjust
                    </th>
                    <th className="text-center px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Printed
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-20 text-center text-slate-400 text-sm"
                      >
                        <div className="flex justify-center">
                          <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-20 text-center text-slate-400 text-sm"
                      >
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((bc, i) => (
                      <tr
                        key={bc.id}
                        className={`row-anim hover:bg-[#faf9f7] transition-colors ${
                          bc.quantity === 0
                            ? "bg-red-50/50"
                            : bc.quantity <= bc.lowStockAt
                              ? "bg-amber-50/40"
                              : ""
                        }`}
                        style={{ animationDelay: `${i * 30}ms` }}
                      >
                        {/* Checkbox */}
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selected.has(bc.id)}
                            onChange={() => toggleSelect(bc.id)}
                            className="accent-amber-400 w-4 h-4"
                          />
                        </td>

                        {/* Product */}
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-900 text-[13px]">
                            {bc.product.title}
                          </p>
                          <p className="text-slate-400 text-[11px] mono">
                            {taka(bc.product.price)}
                          </p>
                        </td>

                        {/* Barcode value */}
                        <td className="px-4 py-3">
                          <span className="mono text-[11px] text-slate-600 bg-slate-100 px-2 py-1 rounded">
                            {bc.barcode}
                          </span>
                          <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-widest">
                            {bc.barcodeType}
                          </p>
                        </td>

                        {/* Barcode image */}
                        <td className="px-4 py-3 text-center">
                          <BarcodeImg id={bc.id} token={token} />
                        </td>

                        {/* Location */}
                        <td className="px-4 py-3 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <LocBadge code={bc.location?.code} />
                            <select
                              value={bc.location?.id ?? ""}
                              onChange={(e) => assignLoc(bc.id, e.target.value)}
                              className="text-[10px] border border-slate-200 rounded-lg px-2 py-1 text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white"
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
                        </td>

                        {/* Stock */}
                        <td className="px-4 py-3 text-center">
                          <StockChip qty={bc.quantity} low={bc.lowStockAt} />
                          <p className="text-[9px] text-slate-400 mt-1">
                            alert ≤ {bc.lowStockAt}
                          </p>
                        </td>

                        {/* Stock adjustment */}
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() =>
                                setAdjMap((p) => ({
                                  ...p,
                                  [bc.id]: (p[bc.id] ?? 0) - 1,
                                }))
                              }
                              className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition"
                            >
                              −
                            </button>
                            <span
                              className={`mono text-sm w-8 text-center font-bold ${
                                (adjMap[bc.id] ?? 0) > 0
                                  ? "text-emerald-600"
                                  : (adjMap[bc.id] ?? 0) < 0
                                    ? "text-red-600"
                                    : "text-slate-400"
                              }`}
                            >
                              {(adjMap[bc.id] ?? 0) > 0
                                ? `+${adjMap[bc.id]}`
                                : (adjMap[bc.id] ?? "0")}
                            </span>
                            <button
                              onClick={() =>
                                setAdjMap((p) => ({
                                  ...p,
                                  [bc.id]: (p[bc.id] ?? 0) + 1,
                                }))
                              }
                              className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition"
                            >
                              +
                            </button>
                            {(adjMap[bc.id] ?? 0) !== 0 && (
                              <button
                                onClick={() => applyAdj(bc.id)}
                                className="ml-1 px-2 py-0.5 bg-[#0f172a] text-[#e2c97e] text-[10px] font-bold rounded hover:bg-slate-800 transition"
                              >
                                Apply
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Print count */}
                        <td className="px-4 py-3 text-center">
                          <p className="mono text-[11px] text-slate-600">
                            {bc.printCount}×
                          </p>
                          {bc.printedAt && (
                            <p className="text-[9px] text-slate-400">
                              {new Date(bc.printedAt).toLocaleDateString(
                                "en-BD",
                              )}
                            </p>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const PrintIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);
