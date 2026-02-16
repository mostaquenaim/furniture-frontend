/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import useFetchDistricts from "@/hooks/Districts/useFetchDistricts";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import { Edit3, Save, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import LoadingDots from "@/component/Loading/LoadingDS";

const AllDistrictsComp = () => {
  const { districts, isLoading, refetch } = useFetchDistricts();
  const axiosSecure = useAxiosSecure();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    deliveryFee: 0,
    isCODAvailable: true,
  });
  const [isAdding, setIsAdding] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (district: any) => {
    setEditingId(district.id);
    setIsAdding(false);
    setFormData({
      name: district.name,
      deliveryFee: district.deliveryFee,
      isCODAvailable: district.isCODAvailable,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  // create new district
  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error("District name is required");
      return;
    }

    console.log(formData, "new district");

    try {
      await axiosSecure.post("/create-districts", formData);
      toast.success("District added successfully");
      setIsAdding(false);
      setFormData({
        name: "",
        deliveryFee: 0,
        isCODAvailable: true,
      });
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Creation failed");
    }
  };

  const openDeleteModal = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await axiosSecure.delete(`/districts/${deleteId}`);
      toast.success("District deleted");
      refetch();
      setDeleteId(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  // delete
  const handleDelete = async (id: number) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this district?",
    );
    if (!confirmDelete) return;

    try {
      await axiosSecure.delete(`/districts/${id}`);
      toast.success("District deleted");
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  // save district after edit
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
    return (
      <div className="p-6 text-sm text-slate-500">
        <LoadingDots />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* District management */}
      <div className="flex justify-between items-center p-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800">
          District Management
        </h2>

        {!isAdding && (
          <button
            disabled={editingId !== null}
            onClick={() => {
              setEditingId(null);
              setIsAdding(true);
              setFormData({
                name: "",
                deliveryFee: 0,
                isCODAvailable: true,
              });
            }}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md 
                    hover:bg-indigo-700 transition 
                    disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            + Add District
          </button>
        )}
      </div>

      {/* table data */}
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
          {isAdding && (
            <tr className="bg-indigo-50">
              <td className="px-6 py-4">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="gray-border px-3 py-2 rounded-md w-full"
                  placeholder="District name"
                />
              </td>

              <td className="px-6 py-4">
                <input
                  type="number"
                  value={formData.deliveryFee}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      deliveryFee: Number(e.target.value),
                    }))
                  }
                  className="gray-border px-3 py-2 rounded-md w-28"
                />
              </td>

              <td className="px-6 py-4">
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
              </td>

              <td className="px-6 py-4 text-right space-x-2">
                <button
                  onClick={handleCreate}
                  className="p-2 text-green-600 hover:text-green-800"
                >
                  <Save size={18} />
                </button>

                <button
                  onClick={() => setIsAdding(false)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <X size={18} />
                </button>
              </td>
            </tr>
          )}

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
                      className="gray-border px-3 py-2 rounded-md w-full"
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
                      className="gray-border px-3 py-2 rounded-md w-28"
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
                    <>
                      <button
                        onClick={() => handleEdit(district)}
                        className="p-2 text-slate-400 hover:text-indigo-600"
                      >
                        <Edit3 size={18} />
                      </button>

                      <button
                        onClick={() => openDeleteModal(district.id)}
                        className="p-2 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-96 p-6">
            <h3 className="text-lg font-semibold text-slate-800">
              Delete District
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              This action cannot be undone. Are you sure you want to delete this
              district?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm rounded-md border border-slate-300 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllDistrictsComp;
