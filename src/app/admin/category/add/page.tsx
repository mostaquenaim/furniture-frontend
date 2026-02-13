/* eslint-disable @next/next/no-img-element */
"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiUpload, FiX, FiSave } from "react-icons/fi";
import { toast } from "react-hot-toast";
import axios from "axios";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import { handleUploadWithCloudinary } from "@/data/handleUploadWithCloudinary";
import useFetchSeries from "@/hooks/Categories/Series/useFetchSeries";

interface CategoryFormData {
  name: string;
  slug: string;
  image: File | null;
  sortOrder: number;
  isActive: boolean;
  seriesId: number | "";
}

const AddCategory = () => {
  const router = useRouter();
  const axiosSecure = useAxiosSecure();

  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { seriesList } = useFetchSeries({
    isActive: true,
  });

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    slug: "",
    image: null,
    sortOrder: 0,
    isActive: true,
    seriesId: "",
  });

  // -------------------------
  // Utils
  // -------------------------
  const generateSlug = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();

  // -------------------------
  // Handlers
  // -------------------------
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    setFormData((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: null }));
  };

  // -------------------------
  // Submit
  // -------------------------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.seriesId) {
      toast.error("Please select a series");
      return;
    }

    if (!formData.slug) {
      toast.error("Slug is required");
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = "";

      if (formData.image) {
        imageUrl = await handleUploadWithCloudinary(formData.image);
      }

      await axiosSecure.post("/category", {
        name: formData.name,
        slug: formData.slug,
        image: imageUrl,
        sortOrder: formData.sortOrder,
        isActive: formData.isActive,
        seriesId: formData.seriesId,
      });

      toast.success("Category created successfully");
      setTimeout(() => router.push("/admin/categories"), 1200);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(
          (err.response?.data as { message?: string })?.message ||
            "Failed to create category"
        );
      } else {
        toast.error("Failed to create category");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl border shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Add New Category</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Series Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Select Series *
          </label>
          <select
            value={formData.seriesId}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                seriesId: Number(e.target.value),
              }))
            }
            className="w-full px-4 py-2 border rounded-lg"
            required
          >
            <option value="">-- Select Series --</option>
            {seriesList?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Category Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={handleNameChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="e.g. Sofa"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium mb-2">Slug *</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                slug: generateSlug(e.target.value),
              }))
            }
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Category Image
          </label>
          {imagePreview ? (
            <div className="relative w-48 h-36">
              <img
                src={imagePreview}
                className="w-full h-full object-cover rounded-lg border"
                alt="Preview"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
              >
                <FiX />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center w-48 h-36 border-2 border-dashed rounded-lg cursor-pointer">
              <FiUpload className="text-gray-400" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          )}
        </div>

        {/* Settings */}
        <div className="flex gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Sort Order</label>
            <input
              type="number"
              value={formData.sortOrder}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  sortOrder: Number(e.target.value) || 0,
                }))
              }
              className="w-24 px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={formData.isActive ? "1" : "0"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isActive: e.target.value === "1",
                }))
              }
              className="px-4 py-2 border rounded-lg"
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.push("/admin/categories")}
            className="px-5 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            <FiSave />
            {isLoading ? "Creating..." : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
