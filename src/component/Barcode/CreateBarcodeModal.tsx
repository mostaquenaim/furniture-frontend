"use client";

import { useState } from "react";

interface CreateBarcodeModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  refresh: () => void;
}

interface BarcodeForm {
  productId: string;
  warehouse: string;
  rack: string;
  bin: string;
  quantity: number;
}

const DEFAULT_FORM: BarcodeForm = {
  productId: "",
  warehouse: "",
  rack: "",
  bin: "",
  quantity: 0,
};

export default function CreateBarcodeModal({ open, setOpen, refresh }: CreateBarcodeModalProps) {
  const [form, setForm] = useState<BarcodeForm>(DEFAULT_FORM);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // await createBarcode({
    //   productId: Number(form.productId),
    //   warehouse: form.warehouse,
    //   rack: form.rack,
    //   bin: form.bin,
    //   quantity: Number(form.quantity),
    // });

    setOpen(false);
    refresh();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl w-125 p-6 space-y-4">
        <h2 className="text-xl font-semibold">Create Barcode</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Product ID"
            className="w-full border p-2 rounded"
            value={form.productId}
            onChange={(e) => setForm({ ...form, productId: e.target.value })}
          />

          <div className="grid grid-cols-3 gap-3">
            <input
              placeholder="Warehouse"
              className="border p-2 rounded"
              value={form.warehouse}
              onChange={(e) => setForm({ ...form, warehouse: e.target.value })}
            />

            <input
              placeholder="Rack"
              className="border p-2 rounded"
              value={form.rack}
              onChange={(e) => setForm({ ...form, rack: e.target.value })}
            />

            <input
              placeholder="Bin"
              className="border p-2 rounded"
              value={form.bin}
              onChange={(e) => setForm({ ...form, bin: e.target.value })}
            />
          </div>

          <input
            type="number"
            placeholder="Quantity"
            className="w-full border p-2 rounded"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button type="submit" className="px-4 py-2 bg-black text-white rounded">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
