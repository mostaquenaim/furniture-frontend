/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import BarcodeTable from "./BarcodeTable";
import CreateBarcodeModal from "./CreateBarcodeModal";

export default function BarcodesPage() {
  const [barcodes, setBarcodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    // const data = await getBarcodes();
    // setBarcodes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          Barcode Inventory
        </h1>

        <button
          onClick={() => setOpenModal(true)}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          Add Barcode
        </button>
      </div>

      <BarcodeTable
        data={barcodes}
        loading={loading}
        refresh={fetchData}
      />

      <CreateBarcodeModal
        open={openModal}
        setOpen={setOpenModal}
        refresh={fetchData}
      />

    </div>
  );
}