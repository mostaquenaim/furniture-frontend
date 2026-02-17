/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useCallback, useMemo } from "react";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import { Edit3, Save, Trash2, X, Plus, Palette, Upload } from "lucide-react";
import toast from "react-hot-toast";
import LoadingDots from "@/component/Loading/LoadingDS";
import useFetchColors from "@/hooks/Attributes/useFetchColors";
import { handleUploadWithCloudinary } from "@/data/handleUploadWithCloudinary";

// TypeScript interfaces
interface Color {
  id: number;
  name: string;
  hexCode: string;
  sortOrder: number;
  isActive: boolean;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface ColorFormData {
  name: string;
  hexCode: string;
  sortOrder: number;
  isActive: boolean;
  image?: File | string | null;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const DEFAULT_FORM_DATA: ColorFormData = {
  name: "",
  hexCode: "#000000",
  sortOrder: 0,
  isActive: true,
  image: null,
};

const AllColorsComp: React.FC = () => {
  const axiosSecure = useAxiosSecure();
  const { colors, isLoading, refetch } = useFetchColors({});

  // State management
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ColorFormData>(DEFAULT_FORM_DATA);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Memoized values
  const isFormValid = useMemo(() => {
    return (
      formData.name.trim().length > 0 &&
      formData.hexCode.match(/^#[0-9A-F]{6}$/i)
    );
  }, [formData.name, formData.hexCode]);

  // Reset form to default state
  const resetForm = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA);
    setImagePreview(null);
    setValidationErrors({});
  }, []);

  // Handle image selection
  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));

      // Clean up preview URL on component unmount
      return () => URL.revokeObjectURL(imagePreview || "");
    },
    [imagePreview],
  );

  // Remove selected image
  const removeImage = useCallback(() => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  }, []);

  // Validate form fields
  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Color name is required";
    }

    if (!formData.hexCode.match(/^#[0-9A-F]{6}$/i)) {
      errors.hexCode = "Invalid hex code format (e.g., #FF0000)";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData.name, formData.hexCode]);

  // Handle edit mode
  const handleEdit = useCallback((color: Color) => {
    setEditingId(color.id);
    setIsAdding(false);
    setFormData({
      name: color.name,
      hexCode: color.hexCode,
      sortOrder: color.sortOrder || 0,
      isActive: color.isActive,
      image: color.image || null,
    });
    setImagePreview(color.image || null);
    setValidationErrors({});
  }, []);

  // Cancel editing/adding
  const handleCancel = useCallback(() => {
    setEditingId(null);
    setIsAdding(false);
    resetForm();
  }, [resetForm]);

  // Handle form field changes
  const handleInputChange = useCallback(
    (field: keyof ColorFormData, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear validation error for this field
      setValidationErrors((prev) => ({ ...prev, [field]: "" }));
    },
    [],
  );

  // Save color (create or update)
  const saveColor = useCallback(
    async (id?: number) => {
      if (!validateForm()) {
        toast.error("Please fix validation errors");
        return;
      }

      setIsUploading(true);

      try {
        let imageUrl = formData.image;

        // Upload image if it's a new file
        if (formData.image instanceof File) {
          imageUrl = await handleUploadWithCloudinary(formData.image);
        }

        const payload = {
          ...formData,
          image: imageUrl || null,
        };

        if (id) {
          // Update existing color
          await axiosSecure.patch(`/colors/${id}`, payload);
          toast.success("Color updated successfully");
          setEditingId(null);
        } else {
          // Create new color
          await axiosSecure.post("/colors", payload);
          toast.success("Color added successfully");
          setIsAdding(false);
        }

        resetForm();
        await refetch();
      } catch (error: any) {
        const apiError = error as ApiError;
        toast.error(apiError?.response?.data?.message || "Operation failed");
      } finally {
        setIsUploading(false);
      }
    },
    [axiosSecure, formData, refetch, resetForm, validateForm],
  );

  // Delete color
  const confirmDelete = useCallback(async () => {
    if (!deleteId) return;

    setIsDeleting(true);

    try {
      await axiosSecure.delete(`/colors/${deleteId}`);
      toast.success("Color deleted successfully");
      setDeleteId(null);
      await refetch();
    } catch (error: any) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  }, [axiosSecure, deleteId, refetch]);

  // Start adding new color
  const handleAddNew = useCallback(() => {
    setIsAdding(true);
    setEditingId(null);
    resetForm();
  }, [resetForm]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingDots />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-gray-200 bg-gray-50/50">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Palette size={20} className="text-indigo-600" />
            Color Library
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage product color swatches and codes
          </p>
        </div>

        {!isAdding && (
          <button
            disabled={editingId !== null}
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Add new color"
          >
            <Plus size={16} />
            Add Color
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Visual
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Color Info
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {/* Add new row */}
            {isAdding && (
              <tr className="bg-indigo-50/50">
                <td className="px-6 py-4">
                  <ColorVisual
                    hexCode={formData.hexCode}
                    imagePreview={imagePreview}
                    isEditing={true}
                    onHexCodeChange={(value) =>
                      handleInputChange("hexCode", value)
                    }
                    onImageChange={handleImageChange}
                    onImageRemove={removeImage}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Color name (e.g., Ocean Blue)"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className={`block w-full text-sm border rounded-lg px-3 py-2 ${
                        validationErrors.name
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      aria-invalid={!!validationErrors.name}
                    />
                    {validationErrors.name && (
                      <p className="text-xs text-red-600">
                        {validationErrors.name}
                      </p>
                    )}

                    <input
                      type="text"
                      placeholder="#000000"
                      value={formData.hexCode}
                      onChange={(e) =>
                        handleInputChange("hexCode", e.target.value)
                      }
                      className={`block w-full text-xs font-mono border rounded-lg px-3 py-2 ${
                        validationErrors.hexCode
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      aria-invalid={!!validationErrors.hexCode}
                    />
                    {validationErrors.hexCode && (
                      <p className="text-xs text-red-600">
                        {validationErrors.hexCode}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        handleInputChange("isActive", e.target.checked)
                      }
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-600">Active</span>
                  </label>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => saveColor()}
                      disabled={!isFormValid || isUploading}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {/* Existing colors */}
            {colors?.map((color: Color) => {
              const isEditing = editingId === color.id;
              return (
                <tr
                  key={color.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <ColorVisual
                        hexCode={formData.hexCode}
                        imagePreview={imagePreview}
                        isEditing={true}
                        onHexCodeChange={(value) =>
                          handleInputChange("hexCode", value)
                        }
                        onImageChange={handleImageChange}
                        onImageRemove={removeImage}
                      />
                    ) : (
                      <ColorSwatch color={color} />
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="text-sm font-medium border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    ) : (
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {color.name}
                        </div>
                        <div className="text-xs font-mono text-gray-500 uppercase">
                          {color.hexCode}
                        </div>
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge isActive={color.isActive} />
                  </td>

                  <td className="px-6 py-4">
                    {isEditing ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => saveColor(color.id)}
                          disabled={!isFormValid || isUploading}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Save"
                        >
                          <Save size={18} />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Cancel"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleEdit(color)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit color"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteId(color.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete color"
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
      </div>

      {/* Empty state */}
      {colors?.length === 0 && !isAdding && (
        <div className="text-center py-12">
          <Palette size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No colors yet
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Get started by adding your first color
          </p>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus size={16} />
            Add Color
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <DeleteConfirmationModal
          isDeleting={isDeleting}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
};

// Sub-components for better organization

interface ColorSwatchProps {
  color: Color;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ color }) => (
  <div className="relative group">
    <div
      className="w-10 h-10 rounded-full border border-gray-200 shadow-inner flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: color.hexCode }}
    >
      {color.image && (
        <img
          src={color.image}
          alt={color.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}
    </div>
  </div>
);

interface ColorVisualProps {
  hexCode: string;
  imagePreview: string | null;
  isEditing: boolean;
  onHexCodeChange: (value: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
}

const ColorVisual: React.FC<ColorVisualProps> = ({
  hexCode,
  imagePreview,
  isEditing,
  onHexCodeChange,
  onImageChange,
  onImageRemove,
}) => (
  <div className="flex flex-col gap-2">
    <input
      type="color"
      value={hexCode}
      onChange={(e) => onHexCodeChange(e.target.value)}
      className="w-10 h-10 rounded-full cursor-pointer border-2 border-white shadow-md"
      title="Select color"
    />

    {imagePreview ? (
      <div className="relative w-20 h-20 border rounded-md overflow-hidden group">
        <img
          src={imagePreview}
          alt="Preview"
          className="w-full h-full object-cover"
        />
        <button
          type="button"
          onClick={onImageRemove}
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
          title="Remove image"
        >
          <X size={12} />
        </button>
      </div>
    ) : (
      <label className="relative w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors group">
        <input
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload
          size={20}
          className="text-gray-400 group-hover:text-indigo-500"
        />
      </label>
    )}
  </div>
);

interface StatusBadgeProps {
  isActive: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ isActive }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
    }`}
  >
    {isActive ? "Active" : "Inactive"}
  </span>
);

interface DeleteConfirmationModalProps {
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isDeleting,
  onConfirm,
  onCancel,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
      <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
        <Trash2 size={24} />
      </div>

      <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
        Delete Color?
      </h3>

      <p className="text-sm text-gray-500 text-center mb-6">
        This action cannot be undone. The color will be permanently removed from
        your library. Products using this color may be affected.
      </p>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </div>
);

export default AllColorsComp;
