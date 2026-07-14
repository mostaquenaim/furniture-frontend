"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, Printer, PackageCheck } from "lucide-react";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import { useBarcodeScanInput } from "@/hooks/Barcode/useBarcodeScanInput";
import { printLabelSheet } from "@/component/admin/PrintLabels/printLabels";
import { TrackedItem } from "@/hooks/Track/useTrack";
import {
  AvailablePiece,
  PickSlip,
  ShipmentGroupStatus,
} from "@/types/reservation.types";

interface Props {
  orderId: string;
  items: TrackedItem[];
  onClose: () => void;
}

export default function OrderFulfillmentModal({
  orderId,
  items,
  onClose,
}: Props) {
  const axiosSecure = useAxiosSecure();
  const [pickSlip, setPickSlip] = useState<PickSlip | null>(null);
  const [groupStatus, setGroupStatus] = useState<ShipmentGroupStatus | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const [openReserveFor, setOpenReserveFor] = useState<number | null>(null);
  const [availablePieces, setAvailablePieces] = useState<AvailablePiece[]>([]);
  const [loadingAvailable, setLoadingAvailable] = useState(false);

  const [pickInput, setPickInput] = useState("");
  const [pickBusy, setPickBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [slipRes, statusRes] = await Promise.all([
        axiosSecure.get<PickSlip>(`/reservations/orders/${orderId}/pick-slip`),
        axiosSecure.get<ShipmentGroupStatus>(
          `/reservations/orders/${orderId}/shipment-group`,
        ),
      ]);
      setPickSlip(slipRes.data);
      setGroupStatus(statusRes.data);
    } catch {
      toast.error("Failed to load fulfillment data");
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, orderId]);

  useEffect(() => {
    load();
  }, [load]);

  const piecesTrackedItems = items.filter(
    (i) => i.productSizeId !== undefined && i.productSizeId !== null,
  );

  const reservedCountFor = (orderItemId: number) =>
    pickSlip?.lines.filter((l) => l.orderItemId === orderItemId).length ?? 0;

  const openReserve = async (item: TrackedItem) => {
    if (!item.productSizeId) return;
    setOpenReserveFor(item.id);
    setLoadingAvailable(true);
    try {
      const { data } = await axiosSecure.get<AvailablePiece[]>(
        "/reservations/available-pieces",
        { params: { productSizeId: item.productSizeId } },
      );
      setAvailablePieces(data);
    } catch {
      toast.error("Failed to load available pieces");
    } finally {
      setLoadingAvailable(false);
    }
  };

  const reservePiece = async (item: TrackedItem, pieceId: number) => {
    try {
      await axiosSecure.post(`/reservations/orders/${orderId}/reserve`, {
        orderItemId: item.id,
        pieceId,
      });
      toast.success("Piece reserved");
      setOpenReserveFor(null);
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to reserve piece");
    }
  };

  const releaseReservation = async (reservationId: number) => {
    try {
      await axiosSecure.delete(`/reservations/${reservationId}`);
      toast.success("Reservation released");
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to release");
    }
  };

  const confirmPick = useCallback(
    async (barcodeValue: string) => {
      if (!pickSlip?.shipmentGroupId) {
        toast.error("No shipment group yet — reserve at least one piece first");
        return;
      }
      setPickBusy(true);
      try {
        await axiosSecure.post("/reservations/pick-confirm", {
          barcodeValue,
          shipmentGroupId: pickSlip.shipmentGroupId,
        });
        toast.success(`${barcodeValue} picked`);
        setPickInput("");
        load();
      } catch (err: any) {
        toast.error(err?.response?.data?.message ?? "Failed to confirm pick");
      } finally {
        setPickBusy(false);
      }
    },
    [axiosSecure, pickSlip, load],
  );

  const { simulateManualEntry } = useBarcodeScanInput({
    enabled: true,
    onScan: (value) => confirmPick(value),
  });

  const printPickSlip = () => {
    setTimeout(() => printLabelSheet(80, 120, 0), 100);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Order Fulfillment — {orderId}
            </h2>
            {groupStatus && groupStatus.requiredCount > 0 && (
              <p className="text-xs text-slate-500 mt-0.5">
                {groupStatus.pickedCount}/{groupStatus.requiredCount} piece(s)
                picked
                {groupStatus.isFullyPicked && (
                  <span className="ml-2 inline-flex items-center gap-1 text-emerald-600 font-medium">
                    <PackageCheck className="w-3.5 h-3.5" /> Ready to ship
                  </span>
                )}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            Loading…
          </div>
        ) : (
          <div className="p-5 space-y-6">
            {/* ── Reserve per order line ── */}
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-2">
                Reserve pieces
              </p>
              {piecesTrackedItems.length === 0 ? (
                <p className="text-xs text-gray-400">
                  This order has no piece-tracked line items.
                </p>
              ) : (
                <div className="space-y-2">
                  {piecesTrackedItems.map((item) => {
                    const reserved = reservedCountFor(item.id);
                    const full = reserved >= item.quantity;
                    return (
                      <div
                        key={item.id}
                        className="border border-gray-100 rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {[item.color, item.size].filter(Boolean).join(" / ")}
                              {" — "}
                              {reserved}/{item.quantity} reserved
                            </p>
                          </div>
                          {!full && (
                            <button
                              onClick={() => openReserve(item)}
                              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700"
                            >
                              Reserve
                            </button>
                          )}
                        </div>

                        {openReserveFor === item.id && (
                          <div className="mt-2 border-t border-gray-50 pt-2 space-y-1 max-h-40 overflow-y-auto">
                            {loadingAvailable ? (
                              <p className="text-xs text-gray-400">Loading…</p>
                            ) : availablePieces.length === 0 ? (
                              <p className="text-xs text-gray-400">
                                No in-stock pieces available for this variant.
                              </p>
                            ) : (
                              availablePieces.map((p) => (
                                <button
                                  key={p.id}
                                  onClick={() => reservePiece(item, p.id)}
                                  className="w-full flex items-center justify-between text-xs px-2 py-1.5 rounded hover:bg-slate-50 text-left"
                                >
                                  <span className="font-mono">
                                    {p.barcodeValue}
                                  </span>
                                  <span className="text-gray-400">
                                    {p.location?.code ?? "no shelf yet"}
                                  </span>
                                </button>
                              ))
                            )}
                          </div>
                        )}

                        {pickSlip?.lines
                          .filter((l) => l.orderItemId === item.id)
                          .map((l) => (
                            <div
                              key={l.reservationId}
                              className="flex items-center justify-between text-xs mt-1.5 px-2 py-1 bg-slate-50 rounded"
                            >
                              <span className="font-mono">{l.barcodeValue}</span>
                              <span
                                className={
                                  l.pickedAt
                                    ? "text-emerald-600 font-medium"
                                    : "text-amber-600"
                                }
                              >
                                {l.pickedAt ? "Picked" : "Reserved"}
                              </span>
                              {!l.pickedAt && (
                                <button
                                  onClick={() =>
                                    releaseReservation(l.reservationId)
                                  }
                                  className="text-red-500 hover:text-red-700"
                                >
                                  Release
                                </button>
                              )}
                            </div>
                          ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Pick slip + print ── */}
            {pickSlip && pickSlip.lines.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-800">
                    Pick Slip
                  </p>
                  <button
                    onClick={printPickSlip}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print
                  </button>
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-[10px] uppercase text-gray-400 border-b border-gray-100">
                      <th className="py-1.5">Barcode</th>
                      <th className="py-1.5">Product</th>
                      <th className="py-1.5">Shelf</th>
                      <th className="py-1.5">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pickSlip.lines.map((l) => (
                      <tr key={l.reservationId} className="border-b border-gray-50">
                        <td className="py-1.5 font-mono">{l.barcodeValue}</td>
                        <td className="py-1.5">
                          {l.productTitle} ({l.color}/{l.size})
                        </td>
                        <td className="py-1.5">{l.locationCode ?? "—"}</td>
                        <td className="py-1.5">
                          {l.pickedAt ? "Picked" : "Reserved"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Pick confirm ── */}
            {pickSlip && pickSlip.shipmentGroupId && (
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  Scan to confirm pick
                </p>
                <div className="flex gap-2">
                  <input
                    value={pickInput}
                    onChange={(e) => setPickInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") simulateManualEntry(pickInput);
                    }}
                    placeholder="PC-00000001"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono"
                  />
                  <button
                    onClick={() => simulateManualEntry(pickInput)}
                    disabled={pickBusy}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Hidden print sheet ── */}
        <div className="print-label-sheet fixed -left-2500 -top-2500">
          <div className="label bg-white text-black p-4" style={{ width: "80mm" }}>
            <h3 className="font-bold text-sm mb-2">Pick Slip — {orderId}</h3>
            <table className="w-full text-[10px]">
              <thead>
                <tr>
                  <th className="text-left">Barcode</th>
                  <th className="text-left">Product</th>
                  <th className="text-left">Shelf</th>
                </tr>
              </thead>
              <tbody>
                {pickSlip?.lines.map((l) => (
                  <tr key={l.reservationId}>
                    <td>{l.barcodeValue}</td>
                    <td>
                      {l.productTitle} ({l.color}/{l.size})
                    </td>
                    <td>{l.locationCode ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
