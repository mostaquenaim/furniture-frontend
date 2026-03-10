/**
 * shared/AdminUI.tsx
 * Reusable primitives extracted from ActivityLog + used by AllOrders.
 * Import individually — no barrel export to keep tree-shaking clean.
 */

"use client";

import React, { ReactNode } from "react";
import { Search, RefreshCw, X } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Badge ─────────────────────────────────────────────────────────────────────
/**
 * A tiny pill badge. Pass `colorClass` like "bg-blue-100 text-blue-700".
 */
export function Badge({
  label,
  colorClass = "bg-slate-100 text-slate-600",
  dot,
}: {
  label: string;
  colorClass?: string;
  dot?: string; // tailwind bg color e.g. "bg-blue-500"
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide ${colorClass}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
      {label}
    </span>
  );
}

// ── StatCard ──────────────────────────────────────────────────────────────────
export function StatCard({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-4 border shadow-sm ${
        accent ? "bg-[#0f172a] border-slate-800" : "bg-white border-slate-100"
      }`}
    >
      <p
        className={`text-[9px] font-bold uppercase tracking-widest mb-1.5 ${
          accent ? "text-slate-500" : "text-slate-400"
        }`}
      >
        {label}
      </p>
      <p
        className={`text-2xl font-bold font-mono leading-none ${
          accent ? "text-[#e2c97e]" : "text-slate-900"
        }`}
      >
        {value}
      </p>
      {sub && (
        <p
          className={`text-[10px] mt-1.5 ${accent ? "text-slate-600" : "text-slate-400"}`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

// ── SearchBar ─────────────────────────────────────────────────────────────────
export function SearchBar({
  value,
  onChange,
  placeholder = "Search…",
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-sm text-slate-700 placeholder:text-slate-300"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

// ── FilterSelect ──────────────────────────────────────────────────────────────
export function FilterSelect<T extends string>({
  value,
  onChange,
  options,
  placeholder = "All",
  className = "",
}: {
  value: T | "";
  onChange: (v: T | "") => void;
  options: { label: string; value: T }[];
  placeholder?: string;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T | "")}
      className={`py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-sm text-slate-700 ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// ── DateRangePicker ───────────────────────────────────────────────────────────
export function DateRangePicker({
  from,
  to,
  onFromChange,
  onToChange,
}: {
  from: string;
  to: string;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
}) {
  return (
    <>
      <input
        type="date"
        value={from}
        onChange={(e) => onFromChange(e.target.value)}
        className="py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-sm text-slate-600"
      />
      <input
        type="date"
        value={to}
        onChange={(e) => onToChange(e.target.value)}
        className="py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-sm text-slate-600"
      />
    </>
  );
}

// ── RefreshButton ─────────────────────────────────────────────────────────────
export function RefreshButton({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-colors disabled:opacity-50"
      title="Refresh"
    >
      <RefreshCw
        className={`w-4 h-4 text-slate-500 ${loading ? "animate-spin" : ""}`}
      />
    </button>
  );
}

// ── ClearFiltersButton ────────────────────────────────────────────────────────
export function ClearFiltersButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-colors border border-red-100"
    >
      <X className="w-3.5 h-3.5" />
      Clear
    </button>
  );
}

// ── Table shell ───────────────────────────────────────────────────────────────
export function AdminTable({
  headers,
  children,
  loading,
  empty,
  emptyAction,
}: {
  headers: string[];
  children: React.ReactNode;
  loading?: boolean;
  empty?: boolean;
  emptyAction?: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto bg-white shadow-sm rounded-2xl border border-slate-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/80">
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 first:pl-5 last:pr-5"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {loading ? (
            <tr>
              <td colSpan={headers.length} className="py-16 text-center">
                <RefreshCw className="w-5 h-5 animate-spin text-slate-300 mx-auto" />
              </td>
            </tr>
          ) : empty ? (
            <tr>
              <td
                colSpan={headers.length}
                className="py-16 text-center text-slate-400 text-sm"
              >
                <div className="flex flex-col items-center gap-3">
                  <p>No records found</p>
                  {emptyAction}
                </div>
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
export function Pagination({
  meta,
  page,
  onPageChange,
  limit,
}: {
  meta: Meta;
  page: number;
  onPageChange: (p: number) => void;
  limit: number;
}) {
  if (meta.totalPages <= 1) return null;

  const pages = buildPageNumbers(page, meta.totalPages);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm">
      <p className="text-xs text-slate-400">
        Showing{" "}
        <span className="font-semibold text-slate-700">
          {(meta.page - 1) * limit + 1}–
          {Math.min(meta.page * limit, meta.total)}
        </span>{" "}
        of <span className="font-semibold text-slate-700">{meta.total}</span>
      </p>

      <div className="flex items-center gap-1.5">
        <PageBtn
          label="←"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        />
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="px-1 text-slate-300 text-sm">
              …
            </span>
          ) : (
            <PageBtn
              key={p}
              label={String(p)}
              active={p === page}
              onClick={() => onPageChange(p as number)}
            />
          ),
        )}
        <PageBtn
          label="→"
          disabled={page >= meta.totalPages}
          onClick={() => onPageChange(page + 1)}
        />
      </div>

      <p className="text-xs text-slate-400">
        Page <span className="font-semibold text-slate-700">{meta.page}</span> /{" "}
        {meta.totalPages}
      </p>
    </div>
  );
}

function PageBtn({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-w-[32px] h-8 px-2 text-xs rounded-lg transition-all font-medium ${
        active
          ? "bg-[#0f172a] text-white shadow-sm"
          : disabled
            ? "text-slate-300 cursor-not-allowed"
            : "border border-slate-200 text-slate-600 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}

function buildPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3)
    return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}

// ── Detail Drawer ─────────────────────────────────────────────────────────────
export function DetailDrawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  headerActions,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  headerActions?: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#0f172a] px-6 py-5 flex items-start justify-between flex-shrink-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
              Details
            </p>
            <p className="text-white font-semibold text-base leading-tight">
              {title}
            </p>
            {subtitle && (
              <p className="text-slate-400 text-xs mt-0.5">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {headerActions}

            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">{children}</div>
      </div>
    </div>
  );
}

// ── DrawerSection ─────────────────────────────────────────────────────────────
export function DrawerSection({
  title,
  children,
  tint = "slate",
}: {
  title: string;
  children: React.ReactNode;
  tint?: "slate" | "blue" | "green" | "red" | "amber";
}) {
  const tints: Record<string, string> = {
    slate: "bg-slate-50 border-slate-100",
    blue: "bg-blue-50 border-blue-100",
    green: "bg-emerald-50 border-emerald-100",
    red: "bg-red-50 border-red-100",
    amber: "bg-amber-50 border-amber-100",
  };
  return (
    <div className={`rounded-xl border p-4 ${tints[tint]}`}>
      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3">
        {title}
      </p>
      {children}
    </div>
  );
}

// ── DrawerRow ─────────────────────────────────────────────────────────────────
export function DrawerRow({
  label,
  value,
  mono,
  highlight,
}: {
  label: string;
  value?: string | number | null;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start justify-between py-1.5 border-b border-slate-100/60 last:border-0 gap-4">
      <span className="text-xs text-slate-400 shrink-0">{label}</span>
      <span
        className={`text-xs text-right break-all ${
          mono ? "font-mono" : "font-medium"
        } ${highlight ? "text-emerald-700 font-semibold" : "text-slate-800"}`}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

// ── JsonBlock ─────────────────────────────────────────────────────────────────
export function JsonBlock({
  label,
  data,
  tint = "slate",
}: {
  label?: string;
  data: object;
  tint?: "slate" | "green" | "red";
}) {
  const tints: Record<string, string> = {
    slate: "bg-slate-50 border-slate-200 text-slate-700",
    green: "bg-emerald-50 border-emerald-100 text-slate-700",
    red: "bg-red-50 border-red-100 text-slate-700",
  };
  return (
    <div>
      {label && (
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
          {label}
        </p>
      )}
      <pre
        className={`rounded-xl border px-4 py-3 text-[11px] overflow-x-auto whitespace-pre-wrap leading-relaxed ${tints[tint]}`}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

// ── PageHeader ────────────────────────────────────────────────────────────────
export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-[#0f172a] px-8 py-6">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <div>
          {eyebrow && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
              {eyebrow}
            </p>
          )}
          <h1 className="text-xl font-semibold text-white">{title}</h1>
        </div>
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
    </div>
  );
}
