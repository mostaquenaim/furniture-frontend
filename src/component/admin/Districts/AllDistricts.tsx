/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import useFetchDistricts from "@/hooks/Districts/useFetchDistricts";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import { Edit3, Save, X } from "lucide-react";
import toast from "react-hot-toast";

const AllDistrictsComp = () => {
  const { districts, isLoading, refetch } = useFetchDistricts();
  const axiosSecure = useAxiosSecure();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    deliveryFee: 0,
    isCODAvailable: true,
  });

  const handleEdit = (district: any) => {
    setEditingId(district.id);
    setFormData({
      name: district.name,
      deliveryFee: district.deliveryFee,
      isCODAvailable: district.isCODAvailable,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSave = async (id: number) => {
    try {
      await axiosSecure.patch(`/districts/${id}`, formData);
      toast.success("District updated");
      setEditingId(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Update failed");
    }
  };

  if (isLoading) {
    return <div className="p-6 text-sm text-slate-500">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">
              District
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">
              Delivery Fee
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">
              COD
            </th>
            <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200">
          {districts?.map((district) => {
            const isEditing = editingId === district.id;

            return (
              <tr key={district.id} className="hover:bg-slate-50">
                {/* Name */}
                <td className="px-6 py-4">
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="border px-3 py-2 rounded-md w-full"
                    />
                  ) : (
                    <span className="font-semibold text-slate-800">
                      {district.name}
                    </span>
                  )}
                </td>

                {/* Delivery Fee */}
                <td className="px-6 py-4">
                  {isEditing ? (
                    <input
                      type="number"
                      value={formData.deliveryFee}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          deliveryFee: Number(e.target.value),
                        }))
                      }
                      className="border px-3 py-2 rounded-md w-28"
                    />
                  ) : (
                    <span>৳ {district.deliveryFee}</span>
                  )}
                </td>

                {/* COD */}
                <td className="px-6 py-4">
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={formData.isCODAvailable}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isCODAvailable: e.target.checked,
                        }))
                      }
                    />
                  ) : (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        district.isCODAvailable
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {district.isCODAvailable ? "Available" : "Disabled"}
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right space-x-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => handleSave(district.id)}
                        className="p-2 text-green-600 hover:text-green-800"
                      >
                        <Save size={18} />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEdit(district)}
                      className="p-2 text-slate-400 hover:text-indigo-600"
                    >
                      <Edit3 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AllDistrictsComp;
