/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useCallback } from "react";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import toast from "react-hot-toast";
import { Edit3, Save, Trash2, Plus, Tag } from "lucide-react";
import LoadingDots from "@/component/Loading/LoadingDS";
import useFetchVariants from "@/hooks/Attributes/useFetchVariants";
import StatusToggle from "./Status/StatusToggle";

interface VariantFormData {
  name: string;
  sortOrder: number;
  isActive: boolean;
}

const DEFAULT_FORM: VariantFormData = {
  name: "",
  sortOrder: 0,
  isActive: true,
};

const AllVariantsComp: React.FC = () => {
  const axiosSecure = useAxiosSecure();
  const { variants, isLoading, refetch } = useFetchVariants({ isActive: null });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState<VariantFormData>(DEFAULT_FORM);

  const resetForm = useCallback(() => {
    setFormData(DEFAULT_FORM);
    setEditingId(null);
    setIsAdding(false);
  }, []);

  const handleEditInit = (variant: any) => {
    setIsAdding(false);
    setEditingId(variant.id);
    setFormData({
      name: variant.name,
      sortOrder: variant.sortOrder || 0,
      isActive: variant.isActive ?? true,
    });
  };

  const handleSave = async (id?: number) => {
    if (!formData.name.trim()) return toast.error("Variant name is required");

    setIsProcessing(true);
    try {
      if (id) {
        await axiosSecure.patch(`/variants/${id}`, formData);
        toast.success("Variant updated");
      } else {
        await axiosSecure.post("/variants", formData);
        toast.success("Variant created");
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
      await axiosSecure.delete(`/variants/${deleteId}`);
      toast.success("Variant removed");
      refetch();
      setDeleteId(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Delete failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredVariants = useMemo(() => {
    if (!variants) return [];
    return variants.filter((v: any) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [variants, searchTerm]);

  if (isLoading)
    return (
      <div className="p-20 text-center">
        <LoadingDots />
      </div>
    );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Tag size={22} className="text-indigo-600" /> Variant Library
          </h2>
          <p className="text-sm text-slate-500">
            Manage product variant categories
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search variants..."
              className="w-full pl-3 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase tracking-wider">
                Variant Name
              </th>
              <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase tracking-wider">
                Sizes Count
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
                <td className="px-6 py-4">
                  <input
                    autoFocus
                    type="text"
                    placeholder="e.g. Color, Size, Material"
                    className="w-full border-slate-200 rounded-lg border p-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-400">—</span>
                </td>
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
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {filteredVariants.map((item: any) => {
              const isEditing = editingId === item.id;
              return (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50 transition-colors ${
                    isEditing ? "bg-amber-50/30" : ""
                  }`}
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
                  <td className="px-6 py-4">{item.sizes?.length || 0}</td>
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
                      active={isEditing ? formData.isActive : item.isActive}
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
                            <Trash2 size={18} />
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
              Removing this variant will also affect associated sizes.
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

export default AllVariantsComp;
