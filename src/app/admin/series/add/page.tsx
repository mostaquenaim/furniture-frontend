/* eslint-disable @next/next/no-img-element */
// app/admin/series/add/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiUpload, FiX, FiEye, FiSave } from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import axios from "axios";

interface SeriesFormData {
  name: string;
  slug: string;
  image: string;
  notice: string;
  isActive: boolean;
  sortOrder: number;
}

const AddSeries = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<SeriesFormData>({
    name: "",
    slug: "",
    image: "",
    notice: "",
    isActive: true,
    sortOrder: 0,
  });

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = generateSlug(e.target.value);
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setFormData((prev) => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const axiosSecure = useAxiosSecure();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form
      if (!formData.name.trim()) {
        toast.error("Series name is required");
        setIsLoading(false);
        return;
      }

      if (!formData.slug.trim()) {
        toast.error("Slug is required");
        setIsLoading(false);
        return;
      }

      // Submit form data
      const response = await axiosSecure.post("/series", formData);

      const result = response.data;
      console.log(result);

      toast.success("Series created successfully!");

      // Redirect after success
      setTimeout(() => {
        router.push("/admin/series");
      }, 1500);
    } catch (error: unknown) {
      console.error("Error creating series:", error);

      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Failed to create series");
        toast.error(error.response?.data?.message || "Failed to create series");
      } else {
        setError("Failed to create series");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      slug: "",
      image: "",
      notice: "",
      isActive: true,
      sortOrder: 0,
    });
    setImagePreview(null);
    toast.success("Form reset");
  };

  return (
    <div>
      <Toaster position="top-right" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Add New Series
              </h1>
              <p className="text-gray-600 mt-1">
                Create a new furniture series for your catalog
              </p>
            </div>
            <button
              onClick={() => router.push("/admin/series")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Series
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-200">
                Basic Information
              </h2>

              {/* Series Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Series Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="e.g., Living Room Collection"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  The name of your furniture series as it will appear on the
                  website
                </p>
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">sakigai.com/series/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={handleSlugChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="living-room-collection"
                    required
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  URL-friendly version of the name. Auto-generated from series
                  name
                </p>
              </div>

              {/* Notice/Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notice / Description
                </label>
                <input
                  type="text"
                  value={formData.notice}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notice: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="e.g., Top-selling series, Modern collection"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Short description or tagline for this series
                </p>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-200">
                Series Image
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Series Thumbnail *
                </label>

                {imagePreview ? (
                  <div className="relative">
                    <div className="w-64 h-48 rounded-lg overflow-hidden border border-gray-300">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <FiX className="text-sm" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-64 h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="text-center">
                      <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Upload Image</p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 2MB
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-3">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        image: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Or enter image URL directly"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Upload an image or provide a direct URL to the series
                    thumbnail
                  </p>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-200">
                Settings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.isActive}
                        onChange={() =>
                          setFormData((prev) => ({ ...prev, isActive: true }))
                        }
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">Active</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!formData.isActive}
                        onChange={() =>
                          setFormData((prev) => ({ ...prev, isActive: false }))
                        }
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">Inactive</span>
                    </label>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Active series will be visible on the website
                  </p>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sortOrder: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Lower numbers appear first in listings
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Card */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Preview
              </h3>
              <div className="bg-white rounded-lg border border-gray-300 overflow-hidden max-w-md">
                {formData.image && (
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={formData.image}
                      alt="Series preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/api/placeholder/400/300";
                      }}
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {formData.name || "Series Name"}
                      </h4>
                      {formData.notice && (
                        <p className="text-sm text-gray-600 mt-1">
                          {formData.notice}
                        </p>
                      )}
                    </div>
                    {formData.isActive ? (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="mt-4 text-xs text-gray-500">
                    <p>Slug: {formData.slug || "series-slug"}</p>
                    <p>Order: {formData.sortOrder}</p>
                  </div>
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Reset
              </button>

              <button
                type="button"
                onClick={() => router.push("/admin/series")}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <FiSave className="text-base" />
                    <span>Create Series</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            💡 Tips for creating a series:
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Use descriptive names that customers will understand</li>
            <li>• Upload high-quality images that showcase the series style</li>
            <li>• The notice/tagline should highlight key selling points</li>
            <li>• Set appropriate sort order based on importance/popularity</li>
            <li>• You can add categories to this series after creation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddSeries;
