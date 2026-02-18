/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useCallback, useMemo } from "react";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import { Edit3, Save, Trash2, X, Plus, Ruler, Search, Tag } from "lucide-react";
import toast from "react-hot-toast";
import LoadingDots from "@/component/Loading/LoadingDS";
import useFetchSizes from "@/hooks/Attributes/useFetchSizes";
import { ProductSizeRelation } from "@/types/product.types";
import useFetchVariants from "@/hooks/Attributes/useFetchVariants";

interface SizeFormData {
  name: string;
  sortOrder: number;
  isActive: boolean;
  variantId: number | null;
}

const DEFAULT_FORM: SizeFormData = {
  name: "",
  sortOrder: 0,
  isActive: true,
  variantId: null,
};

const AllSizesComp: React.FC = () => {
  const axiosSecure = useAxiosSecure();
  const { sizes, isLoading, refetch } = useFetchSizes({ isActive: null });
  const { variants, isLoading: isVariantLoading } = useFetchVariants({
    needSize: false,
  });

  // UI States
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Form State
  const [formData, setFormData] = useState<SizeFormData>(DEFAULT_FORM);

  const filteredSizes = useMemo(() => {
    if (!sizes) return [];
    return sizes.filter(
      (s: ProductSizeRelation) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.variant?.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [sizes, searchTerm]);

  const resetForm = useCallback(() => {
    setFormData(DEFAULT_FORM);
    setEditingId(null);
    setIsAdding(false);
  }, []);

  const handleEditInit = (size: ProductSizeRelation) => {
    setIsAdding(false);
    setEditingId(size.id);
    setFormData({
      name: size.name,
      sortOrder: size.sortOrder || 0,
      isActive: size.isActive ?? true,
      variantId: size.variantId,
    });
  };

  // save (edit/update/create)
  const handleSave = async (id?: number) => {
    if (!formData.name.trim()) return toast.error("Size name is required");
    if (!formData.variantId) return toast.error("Please select a variant");

    setIsProcessing(true);
    try {
      if (id) {
        // Changed from /materials to /sizes
        await axiosSecure.patch(`/sizes/${id}`, formData);
        toast.success("Size updated");
      } else {
        await axiosSecure.post("/sizes", formData);
        toast.success("Size created");
      }
      refetch();
      resetForm();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Operation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsProcessing(true);
    try {
      await axiosSecure.delete(`/sizes/${deleteId}`);
      toast.success("Size removed");
      refetch();
      setDeleteId(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Delete failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading)
    return (
      <div className="p-20 text-center">
        <LoadingDots />
      </div>
    );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Ruler size={22} className="text-indigo-600" /> Size Library
            </h2>
            <p className="text-sm text-slate-500">
              Manage dimension labels and sorting
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search sizes or variants..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {!isAdding && (
              <button
                disabled={editingId !== null}
                onClick={() => {
                  resetForm();
                  setIsAdding(true);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-black text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
              >
                <Plus size={18} /> Add New
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase tracking-wider">
                Size Name
              </th>
              <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase tracking-wider">
                Variant Category
              </th>
              <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right font-bold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {isAdding && (
              <tr className="bg-indigo-50/40 border-l-4 border-indigo-500">
                {/* Size Name */}
                <td className="px-6 py-4">
                  <input
                    autoFocus
                    type="text"
                    placeholder="e.g. XL, 42, 10-inch"
                    className="w-full border-slate-200 rounded-lg border p-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </td>
                {/* variant category */}
                <td className="px-6 py-4">
                  <select
                    className="w-full border-slate-200 rounded-lg border p-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.variantId ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        variantId: Number(e.target.value),
                      })
                    }
                  >
                    <option value="">Select Variant</option>
                    {variants?.map((variant: any) => (
                      <option key={variant.id} value={variant.id}>
                        {variant.name}
                      </option>
                    ))}
                  </select>
                </td>
                {/* sort order */}
                <td className="px-6 py-4">
                  <input
                    type="number"
                    className="w-20 border-slate-200 rounded-lg border p-2 outline-none"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sortOrder: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </td>
                {/* status toggle */}
                <td className="px-6 py-4">
                  <StatusToggle
                    active={formData.isActive}
                    onToggle={(v) => setFormData({ ...formData, isActive: v })}
                  />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleSave()}
                      disabled={isProcessing}
                      className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      <Save size={18} />
                    </button>
                    <button
                      onClick={resetForm}
                      className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {filteredSizes.map((item: ProductSizeRelation) => {
              const isEditing = editingId === item.id;
              return (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50 transition-colors ${isEditing ? "bg-amber-50/30" : ""}`}
                >
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        type="text"
                        className="w-full font-semibold border-slate-200 rounded px-2 py-1 border outline-none focus:ring-2 focus:ring-indigo-500"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    ) : (
                      <span className="font-bold text-slate-800">
                        {item.name}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <select
                        className="w-full border-slate-200 rounded px-2 py-1 border outline-none focus:ring-2 focus:ring-indigo-500"
                        value={formData.variantId ?? ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            variantId: Number(e.target.value),
                          })
                        }
                      >
                        <option value="">Select Variant</option>
                        {variants?.map((variant: any) => (
                          <option key={variant.id} value={variant.id}>
                            {variant.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Tag size={14} className="text-slate-400" />
                        {item.variant?.name || "Uncategorized"}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        type="number"
                        className="w-20 border-slate-200 rounded px-2 py-1 border outline-none"
                        value={formData.sortOrder}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sortOrder: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    ) : (
                      <span className="text-slate-500">{item.sortOrder}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <StatusToggle
                      active={
                        isEditing ? formData.isActive : (item.isActive ?? true)
                      }
                      onToggle={(v) =>
                        isEditing
                          ? setFormData({ ...formData, isActive: v })
                          : null
                      }
                      disabled={!isEditing}
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSave(item.id)}
                            disabled={isProcessing}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          >
                            {isProcessing ? "..." : <Save size={18} />}
                          </button>
                          <button
                            onClick={resetForm}
                            className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditInit(item)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteId(item.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="bg-red-50 text-red-600 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center">
              Permanently delete?
            </h3>
            <p className="text-sm text-slate-500 text-center mt-2">
              Removing this size might affect products that currently use it.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusToggle = ({
  active,
  onToggle,
  disabled = false,
}: {
  active: boolean;
  onToggle: (v: boolean) => void;
  disabled?: boolean;
}) => (
  <button
    disabled={disabled}
    onClick={() => onToggle(!active)}
    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors outline-none ${disabled ? "opacity-80 cursor-default" : "cursor-pointer"} ${active ? "bg-emerald-500" : "bg-slate-300"}`}
  >
    <span
      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${active ? "translate-x-6" : "translate-x-1"}`}
    />
  </button>
);

export default AllSizesComp;
