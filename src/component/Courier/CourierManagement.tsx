/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useState } from "react";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import toast from "react-hot-toast";
import {
  Package,
  Truck,
  MapPin,
  BarChart3,
  RefreshCw,
  XCircle,
  Search,
  Plus,
  Settings,
  Zap,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { DeleteConfirmationModal } from "../admin/Modal/DeleteConfirmationModal";

// ── Types ─────────────────────────────────────────────────────────────────────
type CourierStatus =
  | "PENDING"
  | "BOOKED"
  | "PICKUP_ASSIGNED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "PARTIALLY_DELIVERED"
  | "RETURNED"
  | "CANCELLED"
  | "ON_HOLD"
  | "FAILED";

interface Provider {
  id: number;
  name: string;
  displayName: string;
  logo?: string;
  isActive: boolean;
  priority: number;
  config: Record<string, any>;
}

interface Shipment {
  id: number;
  consignmentId?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  status: CourierStatus;
  providerStatus?: string;
  codAmount?: number;
  deliveryCharge?: number;
  errorMessage?: string;
  createdAt: string;
  lastSyncAt?: string;
  deliveredAt?: string;
  provider: { id: number; name: string; displayName: string };
  order: {
    id: number;
    orderId: string;
    customerName: string;
    customerPhone: string;
    total: number;
    status: string;
  };
}

type Tab = "shipments" | "providers";

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  CourierStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  PENDING: {
    label: "Pending",
    bg: "bg-slate-100",
    text: "text-slate-600",
    dot: "bg-slate-400",
  },
  BOOKED: {
    label: "Booked",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  PICKUP_ASSIGNED: {
    label: "Pickup Assigned",
    bg: "bg-violet-50",
    text: "text-violet-700",
    dot: "bg-violet-500",
  },
  PICKED_UP: {
    label: "Picked Up",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    dot: "bg-indigo-500",
  },
  IN_TRANSIT: {
    label: "In Transit",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-400",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-500 animate-pulse",
  },
  DELIVERED: {
    label: "Delivered",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  PARTIALLY_DELIVERED: {
    label: "Partial Delivered",
    bg: "bg-teal-50",
    text: "text-teal-700",
    dot: "bg-teal-400",
  },
  RETURNED: {
    label: "Returned",
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-500",
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  },
  ON_HOLD: {
    label: "On Hold",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    dot: "bg-yellow-500",
  },
  FAILED: {
    label: "Failed",
    bg: "bg-red-100",
    text: "text-red-800",
    dot: "bg-red-600",
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const taka = (n: number) =>
  `৳ ${Number(n).toLocaleString("en-BD", { minimumFractionDigits: 0 })}`;

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const StatusBadge = ({ status }: { status: CourierStatus }) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// ── Book Shipment Modal ───────────────────────────────────────────────────────
const BookModal: React.FC<{
  providers: Provider[];
  onClose: () => void;
  onBook: (data: any) => Promise<void>;
  initialOrderId?: string;
}> = ({ providers, onClose, onBook, initialOrderId = "" }) => {
  const axiosSecure = useAxiosSecure();

  const [orderNumber, setOrderNumber] = useState(initialOrderId);
  const [orderId, setOrderId] = useState(null);
  const [providerId, setProviderId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [orderInfo, setOrderInfo] = useState<any>(null);

  const [form, setForm] = useState({
    recipientName: "",
    recipientPhone: "",
    recipientAddress: "",
    weight: 0.5,
    codAmount: 0,
    itemDescription: "",
    special_instruction: "",
    deliveryType: "48",
    itemType: "2",
  });

  const activeProviders = providers.filter((p) => p.isActive);

  // Auto-fetch order when initialOrderId is set
  useEffect(() => {
    if (initialOrderId) fetchOrder(initialOrderId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialOrderId]);

  const fetchOrder = async (id: string) => {
    if (!id) return;
    setFetching(true);
    try {
      const r = await axiosSecure.get(`/orders/track/${id}`);
      const o = r.data;

      console.log(o, "data");
      setOrderId(o.id);
      setOrderInfo(o);
      setForm((prev) => ({
        ...prev,
        recipientName: o.shippingAddress?.name ?? o.customerName ?? "",
        recipientPhone: o.shippingAddress?.phone ?? o.customerPhone ?? "",
        recipientAddress: [
          o.shippingAddress?.address,
          o.shippingAddress?.district,
        ]
          .filter(Boolean)
          .join(", "),
        codAmount: o.total ?? 0,
        itemDescription:
          o.items
            ?.map(
              (i: any) =>
                `${i.name}${i.size ? ` (${i.size})` : ""} x${i.quantity}`,
            )
            .join(", ") ?? "",
        weight: Math.max(
          0.5,
          (o.items?.reduce((s: number, i: any) => s + i.quantity, 0) ?? 1) *
            0.3,
        ),
      }));
    } catch {
      toast.error("Order not found");
      setOrderInfo(null);
    } finally {
      setFetching(false);
    }
  };

  const set = (key: string, val: any) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="font-semibold text-slate-900 text-base">
              Book Shipment
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Send order to courier partner
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
          >
            <XCircle className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* Order lookup */}
          <div>
            <Field label="Order ID">
              <div className="flex gap-2">
                <input
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="ORD-20260302-..."
                  className="input-base flex-1"
                  onKeyDown={(e) =>
                    e.key === "Enter" && fetchOrder(orderNumber)
                  }
                />
                <button
                  type="button"
                  onClick={() => fetchOrder(orderNumber)}
                  disabled={fetching || !orderNumber}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-medium rounded-xl hover:bg-slate-200 disabled:opacity-50 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  {fetching ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Search className="w-3.5 h-3.5" />
                  )}
                  {fetching ? "Fetching…" : "Fetch"}
                </button>
              </div>
            </Field>

            {/* Order info banner */}
            {orderInfo && (
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <div className="text-xs text-emerald-800">
                  <p className="font-semibold">
                    {orderInfo.customerName ?? orderInfo.shippingAddress?.name}
                  </p>
                  <p className="text-emerald-600 mt-0.5">
                    {orderInfo.items?.length ?? 0} item(s) · ৳{orderInfo.total}
                    {orderInfo.shippingAddress?.district &&
                      ` · ${orderInfo.shippingAddress.district}`}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Provider selection */}
          <Field label="Courier Provider">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {activeProviders.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProviderId(p.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all ${
                    providerId === p.id
                      ? "border-[#0f172a] bg-slate-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {p.logo ? (
                    <img
                      src={p.logo}
                      alt={p.displayName}
                      className="w-7 h-7 object-contain rounded"
                    />
                  ) : (
                    <div className="w-7 h-7 bg-slate-100 rounded flex items-center justify-center">
                      <Truck className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  )}
                  <span className="text-xs font-medium text-slate-800 leading-tight">
                    {p.displayName}
                  </span>
                  {providerId === p.id && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-auto shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </Field>

          {/* Recipient */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Recipient Name">
              <input
                value={form.recipientName}
                onChange={(e) => set("recipientName", e.target.value)}
                placeholder="Full name"
                className="input-base"
              />
            </Field>
            <Field label="Recipient Phone">
              <input
                value={form.recipientPhone}
                onChange={(e) => set("recipientPhone", e.target.value)}
                placeholder="01XXXXXXXXX"
                className="input-base"
              />
            </Field>
          </div>

          <Field label="Delivery Address">
            <textarea
              rows={2}
              value={form.recipientAddress}
              onChange={(e) => set("recipientAddress", e.target.value)}
              placeholder="Full address with district"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none"
            />
          </Field>

          {/* Item details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Field label="Weight (kg)">
              <input
                type="number"
                value={form.weight}
                min={0.1}
                step={0.1}
                onChange={(e) => set("weight", Number(e.target.value))}
                className="input-base"
              />
            </Field>
            <Field label="COD Amount (৳)">
              <input
                type="number"
                value={form.codAmount}
                min={0}
                onChange={(e) => set("codAmount", Number(e.target.value))}
                className="input-base"
              />
            </Field>
            <Field label="Delivery Type">
              <select
                value={form.deliveryType}
                onChange={(e) => set("deliveryType", e.target.value)}
                className="input-base"
              >
                <option value="48">Normal (48h)</option>
                <option value="12">On Demand</option>
              </select>
            </Field>
            <Field label="Item Type">
              <select
                value={form.itemType}
                onChange={(e) => set("itemType", e.target.value)}
                className="input-base"
              >
                <option value="2">Parcel</option>
                <option value="1">Document</option>
              </select>
            </Field>
          </div>

          <Field label="Item Description">
            <input
              value={form.itemDescription}
              onChange={(e) => set("itemDescription", e.target.value)}
              placeholder="e.g. T-Shirt (M) x2, Hoodie x1"
              className="input-base"
            />
          </Field>

          <Field label="Special Instructions (optional)">
            <input
              value={form.special_instruction}
              onChange={(e) => set("special_instruction", e.target.value)}
              placeholder="Fragile, call before delivery, etc."
              className="input-base"
            />
          </Field>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              if (!orderNumber || !providerId) {
                toast.error("Order ID and provider are required");
                return;
              }
              setLoading(true);
              await onBook({
                orderId,
                orderNumber,
                providerId: Number(providerId),
                ...form,
                deliveryType: Number(form.deliveryType),
                itemType: Number(form.itemType),
              });
              setLoading(false);
            }}
            disabled={loading || !orderNumber || !providerId}
            className="flex-1 px-4 py-2.5 bg-[#0f172a] text-white text-sm rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            {loading ? "Booking..." : "Book Shipment"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Provider Form Modal ───────────────────────────────────────────────────────
const ProviderModal: React.FC<{
  existing?: Provider | null;
  onClose: () => void;
  onSave: (data: Partial<Provider>) => Promise<void>;
}> = ({ existing, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: existing?.name ?? "",
    displayName: existing?.displayName ?? "",
    logo: existing?.logo ?? "",
    priority: existing?.priority ?? 0,
    isActive: existing?.isActive ?? true,
    config: existing?.config ? JSON.stringify(existing.config, null, 2) : "{}",
  });
  const [saving, setSaving] = useState(false);
  const [configError, setConfigError] = useState(false);

  const handleSave = async () => {
    let config;

    try {
      config = JSON.parse(form.config);
      setConfigError(false);
    } catch {
      setConfigError(true);
      toast.error("Config must be valid JSON");
      return;
    }
    setSaving(true);
    await onSave({ ...form, config });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">
            {existing ? "Edit Provider" : "New Provider"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-full"
          >
            <XCircle className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Provider Key (PATHAO / STEADFAST / REDX)">
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    name: e.target.value.toUpperCase(),
                  }))
                }
                placeholder="PATHAO"
                className="input-base font-mono"
                disabled={!!existing}
              />
            </Field>
            <Field label="Display Name">
              <input
                value={form.displayName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, displayName: e.target.value }))
                }
                placeholder="Pathao Courier"
                className="input-base"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Logo URL">
              <input
                value={form.logo}
                onChange={(e) =>
                  setForm((p) => ({ ...p, logo: e.target.value }))
                }
                placeholder="https://..."
                className="input-base"
              />
            </Field>
            <Field label="Priority (higher = preferred)">
              <input
                type="number"
                value={form.priority}
                onChange={(e) =>
                  setForm((p) => ({ ...p, priority: Number(e.target.value) }))
                }
                className="input-base"
              />
            </Field>
          </div>

          <Field label="Status">
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                form.isActive
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-slate-50 text-slate-500"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${form.isActive ? "bg-emerald-500" : "bg-slate-300"}`}
              />
              {form.isActive ? "Active" : "Inactive"}
            </button>
          </Field>

          <Field label="Config (JSON)" hint="API keys, store IDs, sandbox flag">
            <textarea
              rows={8}
              value={form.config}
              onChange={(e) =>
                setForm((p) => ({ ...p, config: e.target.value }))
              }
              className={`w-full border rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 resize-none ${
                configError
                  ? "border-red-300 focus:ring-red-300"
                  : "border-slate-200 focus:ring-amber-300"
              }`}
              spellCheck={false}
            />
            {configError && (
              <p className="text-xs text-red-500 mt-1">Invalid JSON</p>
            )}
          </Field>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 text-sm text-slate-600 rounded-xl hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !form.name || !form.displayName}
            className="flex-1 py-2.5 bg-[#0f172a] text-white text-sm rounded-xl hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            {saving ? "Saving..." : existing ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Shipment Detail Drawer ────────────────────────────────────────────────────
const ShipmentDrawer: React.FC<{
  id: number;
  onClose: () => void;
  onSync: (id: number) => Promise<void>;
  onCancel: (id: number) => Promise<void>;
}> = ({ id, onClose, onSync, onCancel }) => {
  const axiosSecure = useAxiosSecure();
  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await axiosSecure.get(`/courier/shipments/${id}`);
      setShipment(r.data);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSync = async () => {
    setSyncing(true);
    await onSync(id);
    await load();
    setSyncing(false);
  };

  const handleCancel = async () => {
    if (!confirm("Cancel this shipment?")) return;
    setCancelling(true);
    await onCancel(id);
    await load();
    setCancelling(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-[#0f172a]">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Shipment Details
            </p>
            <p className="text-white font-semibold text-base mt-0.5">#{id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <XCircle className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-slate-300" />
          </div>
        ) : !shipment ? (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            Not found
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Status */}
            <div className="flex items-center justify-between">
              <StatusBadge status={shipment.status} />
              {shipment.providerStatus && (
                <span className="text-xs text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded">
                  {shipment.providerStatus}
                </span>
              )}
            </div>

            {/* Tracking */}
            {shipment.trackingNumber && (
              <InfoCard title="Tracking">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-slate-800 font-semibold">
                    {shipment.trackingNumber}
                  </span>
                  {shipment.trackingUrl && (
                    <a
                      href={shipment.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                    >
                      Track <ArrowRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </InfoCard>
            )}

            {/* Order */}
            <InfoCard title="Order">
              <div className="space-y-2">
                <Row label="Order ID" value={shipment.order?.orderId} mono />
                <Row label="Customer" value={shipment.order?.customerName} />
                <Row label="Phone" value={shipment.order?.customerPhone} mono />
                <Row label="Total" value={taka(shipment.order?.total ?? 0)} />
              </div>
            </InfoCard>

            {/* Financials */}
            <InfoCard title="Financials">
              <div className="space-y-2">
                <Row
                  label="COD Amount"
                  value={taka(shipment.codAmount ?? 0)}
                  highlight={!!shipment.codAmount}
                />
                <Row
                  label="Delivery Charge"
                  value={
                    shipment.deliveryCharge
                      ? taka(shipment.deliveryCharge)
                      : "—"
                  }
                />
              </div>
            </InfoCard>

            {/* Timestamps */}
            <InfoCard title="Timeline">
              <div className="space-y-2">
                <Row label="Booked" value={fmtDate(shipment.createdAt)} />
                {shipment.lastSyncAt && (
                  <Row label="Last Sync" value={fmtDate(shipment.lastSyncAt)} />
                )}
                {shipment.deliveredAt && (
                  <Row
                    label="Delivered"
                    value={fmtDate(shipment.deliveredAt)}
                    highlight
                  />
                )}
              </div>
            </InfoCard>

            {/* Error */}
            {shipment.errorMessage && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-700">
                    {shipment.errorMessage}
                  </p>
                </div>
              </div>
            )}

            {/* Webhook logs */}
            {shipment.courierWebhookLogs?.length > 0 && (
              <InfoCard title="Recent Webhook Events">
                <div className="space-y-2">
                  {shipment.courierWebhookLogs.map((log: any) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0"
                    >
                      <span className="text-xs font-mono text-slate-600">
                        {log.eventType}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${log.processed ? "bg-emerald-400" : "bg-amber-400"}`}
                        />
                        <span className="text-[10px] text-slate-400">
                          {fmtDate(log.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </InfoCard>
            )}
          </div>
        )}

        {/* Actions footer */}
        {shipment && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-slate-200 bg-white text-slate-700 text-sm rounded-xl hover:bg-slate-100 transition-colors font-medium"
            >
              <RefreshCw
                className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`}
              />
              {syncing ? "Syncing..." : "Sync Status"}
            </button>
            {!["DELIVERED", "CANCELLED", "RETURNED"].includes(
              shipment.status,
            ) && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-50 text-red-700 border border-red-200 text-sm rounded-xl hover:bg-red-100 transition-colors font-medium"
              >
                <XCircle className="w-4 h-4" />
                {cancelling ? "Cancelling..." : "Cancel"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CourierManagement() {
  const axiosSecure = useAxiosSecure();
  const searchParams = useSearchParams();

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    if (orderId) setShowBookModal(true);
  }, [searchParams]);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tab, setTab] = useState<Tab>("shipments");
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CourierStatus | "">("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  console.log(shipments, "shipments");

  // Modals
  const [showBookModal, setShowBookModal] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState<
    Provider | null | "new"
  >(null);
  const [drawerShipmentId, setDrawerShipmentId] = useState<number | null>(null);

  // ── Load ──
  const loadShipments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(search ? { search } : {}),
      });
      const r = await axiosSecure.get(`/courier/shipments?${params}`);
      setShipments(r.data.data);
      setTotalPages(r.data.meta.totalPages);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, page, statusFilter, search]);

  const loadProviders = useCallback(async () => {
    const r = await axiosSecure.get("/courier/providers");
    // console.log(r.data, "provider-data");
    setProviders(r.data);
  }, [axiosSecure]);

  useEffect(() => {
    loadProviders();
  }, [loadProviders]);

  useEffect(() => {
    if (tab === "shipments") loadShipments();
  }, [tab, loadShipments, page, statusFilter, search]);

  // ── Actions ──
  const handleBook = async (data: any) => {
    // console.log(data, "sjhipment data");
    try {
      await axiosSecure.post("/courier/shipments", data);
      toast.success("Shipment booked!");
      setShowBookModal(false);
      loadShipments();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Booking failed");
    }
  };

  const handleSync = async (id: number) => {
    try {
      await axiosSecure.post(`/courier/shipments/${id}/sync`);
      toast.success("Synced");
      loadShipments();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Sync failed");
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await axiosSecure.post(`/courier/shipments/${id}/cancel`);
      toast.success("Shipment cancelled");
      loadShipments();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Cancel failed");
    }
  };

  const handleSaveProvider = async (data: any) => {
    try {
      if (typeof showProviderModal === "object" && showProviderModal?.id) {
        await axiosSecure.patch(`/providers/${showProviderModal.id}`, data);
        toast.success("Provider updated");
      } else {
        await axiosSecure.post("/providers", data);
        toast.success("Provider created");
      }
      setShowProviderModal(null);
      loadProviders();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Save failed");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    setIsProcessing(true);

    try {
      await axiosSecure.delete(`/providers/${deleteId}`);
      toast.success("Provider deleted");

      setDeleteId(null);
      loadProviders();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Delete failed");
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Render ──
  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: "shipments",
      label: "Shipments",
      icon: <Package className="w-4 h-4" />,
    },
    {
      id: "providers",
      label: "Providers",
      icon: <Truck className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* ── Header ── */}
      <div className="bg-[#0f172a] px-8 py-6">
        <div className="max-w-350 mx-auto flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
              Logistics
            </p>
            <h1 className="text-xl font-semibold text-white">
              Courier Management
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBookModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#e2c97e] text-[#0f172a] text-sm font-bold rounded-xl hover:bg-amber-300 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Book Shipment
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-350 mx-auto mt-5 flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === t.id
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-350 mx-auto px-8 py-6">
        {/* ─── SHIPMENTS TAB ─── */}
        {tab === "shipments" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search order ID, customer, tracking…"
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-sm"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as CourierStatus | "");
                  setPage(1);
                }}
                className="py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-sm text-slate-700"
              >
                <option value="">All Statuses</option>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>

              <button
                onClick={loadShipments}
                className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {[
                      "Shipment",
                      "Order",
                      "Customer",
                      "Provider",
                      "Status",
                      "COD",
                      "Date",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center">
                        <RefreshCw className="w-5 h-5 animate-spin text-slate-300 mx-auto" />
                      </td>
                    </tr>
                  ) : shipments.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-16 text-center text-slate-400 text-sm"
                      >
                        No shipments found
                      </td>
                    </tr>
                  ) : (
                    shipments.map((s) => (
                      <tr
                        key={s.id}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                        onClick={() => setDrawerShipmentId(s.id)}
                      >
                        <td className="px-4 py-3">
                          <p className="font-mono text-xs font-semibold text-slate-800">
                            #{s.id}
                          </p>
                          {s.trackingNumber && (
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {s.trackingNumber}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs font-semibold text-slate-800 font-mono">
                            {s.order?.orderId}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-slate-700 font-medium">
                            {s.order?.customerName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {s.order?.customerPhone}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                            {s.provider?.displayName}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={s.status} />
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-mono font-semibold text-slate-700">
                            {s.codAmount ? taka(s.codAmount) : "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-400">
                          {fmtDate(s.createdAt)}
                        </td>
                        <td
                          className="px-4 py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleSync(s.id)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Sync"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                  <p className="text-xs text-slate-400">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40"
                    >
                      ← Prev
                    </button>
                    <button
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── PROVIDERS TAB ─── */}
        {tab === "providers" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-600 font-medium">
                {providers.length} provider{providers.length !== 1 ? "s" : ""}{" "}
                configured
              </p>
              <button
                onClick={() => setShowProviderModal("new")}
                className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Provider
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {providers.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {p.logo ? (
                        <img
                          src={p.logo}
                          alt={p.displayName}
                          className="w-10 h-10 object-contain rounded-xl border border-slate-100"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                          <Truck className="w-5 h-5 text-slate-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">
                          {p.displayName}
                        </p>
                        <p className="text-[10px] font-mono text-slate-400 uppercase">
                          {p.name}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                        p.isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {p.isActive ? "Active" : "Off"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                    <span>Priority: {p.priority}</span>
                    <span>ID: {p.id}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowProviderModal(p)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-slate-200 text-slate-600 text-xs font-medium rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5" /> Configure
                    </button>
                    <button
                      onClick={() => setDeleteId(p.id)}
                      className="px-3 py-2 text-red-500 hover:bg-red-50 border border-red-100 rounded-xl transition-colors text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {providers.length === 0 && (
                <div className="col-span-3 py-16 text-center text-slate-400 text-sm">
                  No providers yet. Add your first courier partner.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {deleteId && (
        <DeleteConfirmationModal
          open={!!deleteId}
          isLoading={isProcessing}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {showBookModal && (
        <BookModal
          providers={providers}
          onClose={() => setShowBookModal(false)}
          onBook={handleBook}
          initialOrderId={searchParams.get("orderId") ?? ""} // ← add this
        />
      )}

      {showProviderModal && (
        <ProviderModal
          existing={showProviderModal === "new" ? null : showProviderModal}
          onClose={() => setShowProviderModal(null)}
          onSave={handleSaveProvider}
        />
      )}

      {drawerShipmentId && (
        <ShipmentDrawer
          id={drawerShipmentId}
          onClose={() => setDrawerShipmentId(null)}
          onSync={handleSync}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

// ── Tiny shared components ────────────────────────────────────────────────────
function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="text-[10px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3">
        {title}
      </p>
      {children}
    </div>
  );
}

function Row({
  label,
  value,
  mono,
  highlight,
}: {
  label: string;
  value?: string | number;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-500">{label}</span>
      <span
        className={`text-xs font-medium ${mono ? "font-mono" : ""} ${highlight ? "text-emerald-700 font-semibold" : "text-slate-800"}`}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}
