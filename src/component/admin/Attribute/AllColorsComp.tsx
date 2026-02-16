/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import { Edit3, Save, Trash2, X, Plus, Palette } from "lucide-react";
import toast from "react-hot-toast";
import LoadingDots from "@/component/Loading/LoadingDS";
import useFetchColors from "@/hooks/Attributes/useFetchColors";
import { handleUploadWithCloudinary } from "@/data/handleUploadWithCloudinary";

interface ColorFormData {
  name: string;
  hexCode: string;
  sortOrder: number;
  isActive: boolean;
  image?: File | string | null; // can be a File when uploading or string URL
}

const AllColorsComp = () => {
  const axiosSecure = useAxiosSecure();
  // Ensure your hook returns refetch
  const { colors, isLoading, refetch } = useFetchColors({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [formData, setFormData] = useState<ColorFormData>({
    name: "",
    hexCode: "#000000",
    sortOrder: 0,
    isActive: true,
  });

  // image changing
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setFormData((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  // Remove image
  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  // editing
  const handleEdit = (color: any) => {
    setEditingId(color.id);
    setIsAdding(false);
    setFormData({
      name: color.name,
      hexCode: color.hexCode,
      sortOrder: color.sortOrder || 0,
      isActive: color.isActive,
    });
  };

  // cancel
  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
  };

  // save edit
  const handleSaveEdit = async (id: number) => {
    try {
      let imageUrl = formData.image;

      // Only upload if it's a File (not existing URL)
      if (formData.image instanceof File) {
        imageUrl = await handleUploadWithCloudinary(formData.image);
      }

      await axiosSecure.patch(`/colors/${id}`, {
        ...formData,
        image: imageUrl,
      });
      toast.success("Color updated");
      setEditingId(null);
      setImagePreview(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Update failed");
    }
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) return toast.error("Name is required");
    try {
      let imageUrl: string | undefined = undefined;

      if (formData.image instanceof File) {
        imageUrl = await handleUploadWithCloudinary(formData.image);
      }

      await axiosSecure.post("/colors", { ...formData, image: imageUrl });
      toast.success("Color added successfully");
      setIsAdding(false);
      setFormData({
        name: "",
        hexCode: "#000000",
        sortOrder: 0,
        isActive: true,
        image: null,
      });
      setImagePreview(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Creation failed");
    }
  };

  // delete color
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      await axiosSecure.delete(`/colors/${deleteId}`);
      toast.success("Color removed");
      setDeleteId(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Delete failed");
      setDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading)
    return (
      <div className="p-10 text-center">
        <LoadingDots />
      </div>
    );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50/50">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Palette size={20} className="text-indigo-600" /> Color Library
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage product color swatches and codes
          </p>
        </div>

        {!isAdding && (
          <button
            disabled={editingId !== null}
            onClick={() => {
              setIsAdding(true);
              setEditingId(null);
              setFormData({
                name: "",
                hexCode: "#000000",
                sortOrder: 0,
                isActive: true,
              });
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-black text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
          >
            <Plus size={16} /> Add New Color
          </button>
        )}
      </div>

      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
              Visual
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
              Color Info
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200 bg-white">
          {/* IN-LINE ADDING ROW */}
          {isAdding && (
            <tr className="bg-indigo-50/50">
              <td className="px-6 py-4">
                <input
                  type="color"
                  value={formData.hexCode}
                  onChange={(e) =>
                    setFormData({ ...formData, hexCode: e.target.value })
                  }
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-white shadow-sm overflow-hidden p-0"
                />
              </td>
              <td className="px-6 py-4 space-y-2">
                <input
                  type="text"
                  placeholder="Color Name (e.g. Light Green)"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="block w-full text-sm border-slate-200 rounded-lg focus:ring-indigo-500 border p-2"
                />
                <input
                  type="text"
                  placeholder="#000000"
                  value={formData.hexCode}
                  onChange={(e) =>
                    setFormData({ ...formData, hexCode: e.target.value })
                  }
                  className="block w-full text-xs font-mono border-slate-200 rounded-lg border p-2"
                />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-600">Active</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right space-x-3">
                <button
                  onClick={handleCreate}
                  className="text-emerald-600 hover:text-emerald-700 font-bold text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-sm"
                >
                  Cancel
                </button>
              </td>
            </tr>
          )}

          {colors?.map((color: any) => {
            const isEditing = editingId === color.id;
            return (
              <tr
                key={color.id}
                className="hover:bg-slate-50 transition-colors"
              >
                {/* VISUAL COLUMN */}
                <td className="px-6 py-4 flex items-center gap-2">
                  {isEditing || isAdding ? (
                    <div className="flex flex-col gap-2">
                      {/* Color Picker */}
                      <input
                        type="color"
                        value={formData.hexCode}
                        onChange={(e) =>
                          setFormData({ ...formData, hexCode: e.target.value })
                        }
                        className="w-10 h-10 rounded-full cursor-pointer border-2 border-white shadow-md"
                      />

                      {/* Image Upload */}
                      {imagePreview ? (
                        <div className="relative w-20 h-20 border rounded-md overflow-hidden">
                          <img
                            src={imagePreview}
                            alt="Color preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="relative w-20 h-20 border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer hover:border-indigo-500">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <Plus size={16} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full border border-slate-200 shadow-inner flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: color.hexCode }}
                    >
                      {color.image && (
                        <img
                          src={color.image}
                          alt={color.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  )}
                </td>

                {/* INFO COLUMN */}
                <td className="px-6 py-4">
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="text-sm font-semibold border border-slate-200 rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <div>
                      <div className="text-sm font-bold text-slate-800">
                        {color.name}
                      </div>
                      <div className="text-xs font-mono text-slate-500 uppercase">
                        {color.hexCode}
                      </div>
                    </div>
                  )}
                </td>

                {/* STATUS COLUMN */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      color.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {color.isActive ? "Active" : "Hidden"}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-4 text-right">
                  {isEditing ? (
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleSaveEdit(color.id)}
                        className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"
                      >
                        <Save size={18} />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-100"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => handleEdit(color)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteId(color.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 mx-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Delete Color?</h3>
            <p className="text-sm text-slate-500 mt-2">
              This will remove this color from your library. Products using this
              color might be affected.
            </p>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllColorsComp;
