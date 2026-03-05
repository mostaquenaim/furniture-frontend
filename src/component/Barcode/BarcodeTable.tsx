/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import BarcodeRow from "./BarcodeRow";


export default function BarcodeTable({ data, loading, refresh }: any) {
  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Barcode</th>
            <th className="p-3 text-left">Product</th>
            <th className="p-3 text-left">Location</th>
            <th className="p-3 text-left">Quantity</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item: any) => (
            <BarcodeRow
              key={item.id}
              item={item}
              refresh={refresh}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}