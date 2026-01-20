/* eslint-disable @next/next/no-img-element */
"use client";

import React, { ChangeEvent, FormEvent, use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiUpload, FiX, FiSave, FiPlus, FiTrash2 } from "react-icons/fi";
import { toast } from "react-hot-toast";
import axios from "axios";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import useAxiosPublic from "@/hooks/Axios/useAxiosPublic";
import { handleUploadWithCloudinary } from "@/data/handleUploadWithCloudinary";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import useFetchSeries from "@/hooks/Categories/useFetchSeries";
import useFetchCategoriesBySeries from "@/hooks/Admin/Categories/useFetchCategoriesBySeries";
import useFetchSubCategoriesByCategory from "@/hooks/Categories/useFetchSubCategoriesByCategory";
import useFetchColors from "@/hooks/useFetchColors";
import useFetchVariants from "@/hooks/useFetchVariants";
import { generateSlug } from "@/utils/generateSlug";

// Types

interface Variant {
  id: number;
  name: string;
  sizes: Size[];
}

interface Size {
  id: number;
  name: string;
  variantId: number;
}

interface ProductImage {
  id?: number;
  image: File | null;
  preview: string;
  colorId: number;
  serialNo: number;
}

interface ProductVariantOption {
  variantId: number;
  sizeId?: number;
  price?: number;
  stock?: number;
}

interface FormData {
  title: string;
  slug: string;
  description: string;
  basePrice: number;
  stock?: number;
  discount: number;
  discountStart: string;
  discountEnd: string;
  note: string;
  deliveryEstimate: string;
  productDetails: string;
  dimension: string;
  shippingReturn: string;
  isActive: boolean;
  seriesId: number | null;
  categoryId: number | null;
  subCategoryIds: number[];
  productImages: ProductImage[];
  variantOptions: ProductVariantOption[];
}

const ProductAdd = () => {
  const router = useRouter();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    slug: "",
    description: "",
    basePrice: 0,
    stock: 0,
    discount: 0,
    discountStart: new Date().toISOString().split("T")[0],
    discountEnd: new Date().toISOString().split("T")[0],
    note: "",
    deliveryEstimate: "7-14 business days",
    productDetails: "",
    dimension: "",
    shippingReturn:
      "30 days return policy. Free shipping on orders above ৳100.",
    isActive: true,
    seriesId: null,
    categoryId: null,
    subCategoryIds: [],
    productImages: [],
    variantOptions: [],
  });

  const { seriesList, isLoading: isSeriesPending } = useFetchSeries();

  const { categoryList, isLoading: isCategoryPending } =
    useFetchCategoriesBySeries(formData.seriesId);

  const { subCategoryList, isLoading: isSubCategoryLoading } =
    useFetchSubCategoriesByCategory(formData.categoryId);

  const { colors, isLoading: isColorPending } = useFetchColors();
  const { variants, isLoading: isVariantsPending } = useFetchVariants();

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleImageUpload = (
    colorId: number,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
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

    const newImage: ProductImage = {
      image: file,
      preview: URL.createObjectURL(file),
      colorId,
      serialNo: formData.productImages.length + 1,
    };

    setFormData((prev) => ({
      ...prev,
      productImages: [...prev.productImages, newImage],
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => {
      const newImages = [...prev.productImages];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);

      // Update serial numbers
      newImages.forEach((img, idx) => {
        img.serialNo = idx + 1;
      });

      return { ...prev, productImages: newImages };
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(formData.productImages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update serial numbers
    items.forEach((item, index) => {
      item.serialNo = index + 1;
    });

    setFormData((prev) => ({ ...prev, productImages: items }));
  };

  const addVariantOption = () => {
    setFormData((prev) => ({
      ...prev,
      variantOptions: [
        ...prev.variantOptions,
        {
          variantId: variants[0]?.id || 0,
          sizeId: undefined,
          price: undefined,
          stock: undefined,
        },
      ],
    }));
  };

  const updateVariantOption = (
    index: number,
    field: string,
    value: unknown,
  ) => {
    setFormData((prev) => {
      const newOptions = [...prev.variantOptions];
      newOptions[index] = { ...newOptions[index], [field]: value };
      return { ...prev, variantOptions: newOptions };
    });
  };

  const removeVariantOption = (index: number) => {
    setFormData((prev) => {
      const newOptions = [...prev.variantOptions];
      newOptions.splice(index, 1);
      return { ...prev, variantOptions: newOptions };
    });
  };

  const handleSubCategoryToggle = (subCategoryId: number) => {
    setFormData((prev) => {
      const exists = prev.subCategoryIds.includes(subCategoryId);
      if (exists) {
        return {
          ...prev,
          subCategoryIds: prev.subCategoryIds.filter(
            (id) => id !== subCategoryId,
          ),
        };
      } else {
        return {
          ...prev,
          subCategoryIds: [...prev.subCategoryIds, subCategoryId],
        };
      }
    });
  };

  // -------------------------
  // Submit Handler
  // -------------------------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.seriesId || !formData.categoryId) {
      toast.error("Please select series and category");
      return;
    }

    if (formData.subCategoryIds.length === 0) {
      toast.error("Please select at least one subcategory");
      return;
    }

    if (formData.basePrice <= 0) {
      toast.error("Base price must be greater than 0");
      return;
    }

    setIsLoading(true);

    try {
      // Upload product images
      const uploadedImages = await Promise.all(
        formData.productImages?.map(async (img) => {
          let imageUrl = "";
          if (img.image) {
            imageUrl = await handleUploadWithCloudinary(img.image);
          }
          return {
            image: imageUrl,
            colorId: img.colorId,
            serialNo: img.serialNo,
          };
        }),
      );

      // Prepare variant options with images
      const variantOptionsWithImages = formData.variantOptions?.map((option) => {
        const variantImages = formData.productImages
          .filter((img) => {
            const color = colors.find((c) => c.id === img.colorId);
            return color && option.variantId === color.id;
          })
          ?.map((img) => (img.image ? URL.createObjectURL(img.image) : ""));

        return {
          ...option,
          images: variantImages,
        };
      });

      // Submit product data
      await axiosSecure.post("/products", {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        basePrice: formData.basePrice,
        stock: formData.stock,
        discount: formData.discount,
        discountStart: new Date(formData.discountStart),
        discountEnd: new Date(formData.discountEnd),
        note: formData.note,
        deliveryEstimate: formData.deliveryEstimate,
        productDetails: formData.productDetails,
        dimension: formData.dimension,
        shippingReturn: formData.shippingReturn,
        isActive: formData.isActive,
        subCategoryIds: formData.subCategoryIds,
        productImages: uploadedImages,
        variantOptions: variantOptionsWithImages,
      });

      toast.success("Product created successfully");
      setTimeout(() => router.push("/admin/products"), 1200);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(
          (err.response?.data as { message?: string })?.message ||
            "Failed to create product",
        );
      } else {
        toast.error("Failed to create product");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl border shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="e.g. Premium Recliner Sofa"
              required
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium mb-2">
              Base Price *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.basePrice}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  basePrice: parseFloat(e.target.value) || 0,
                }))
              }
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          {/* stock  */}
          {/* <div>
            <label className="block text-sm font-medium mb-2">Stock</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  stock: parseInt(e.target.value) || 0,
                }))
              }
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div> */}
        </div>

        {/* Discount Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Discount Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Discount Percentage
              </label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    discount: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full px-4 py-2 border rounded-lg"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Discount Start Date
              </label>
              <input
                type="date"
                value={formData.discountStart}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    discountStart: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Discount End Date
              </label>
              <input
                type="date"
                value={formData.discountEnd}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    discountEnd: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Category Selection</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Series *
              </label>
              <select
                value={formData.seriesId || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    seriesId: Number(e.target.value),
                    categoryId: null,
                  }))
                }
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">-- Select Series --</option>
                {seriesList?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Select Category *
              </label>
              <select
                value={formData.categoryId || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    categoryId: Number(e.target.value),
                    subCategoryIds: [],
                  }))
                }
                className="w-full px-4 py-2 border rounded-lg"
                disabled={!formData.seriesId}
              >
                <option value="">-- Select Category --</option>
                {categoryList &&
                  categoryList?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Select Subcategories *
              </label>
              <div className="max-h-40 overflow-y-auto border rounded-lg p-2">
                {subCategoryList?.map((sc) => (
                  <div key={sc.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`sc-${sc.id}`}
                      checked={formData.subCategoryIds.includes(sc.id)}
                      onChange={() => handleSubCategoryToggle(sc.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`sc-${sc.id}`}>{sc.name}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Color-wise Images with Drag & Drop */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">
            Product Images by Color
          </h3>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Add Images for Colors
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {colors?.map((color) => (
                <div key={color.id} className="border rounded-lg p-4">
                  <div
                    className="w-8 h-8 rounded-full mx-auto mb-2 border"
                    style={{ backgroundColor: color.hexCode }}
                  />
                  <p className="text-center text-sm mb-2">{color.name}</p>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-2 cursor-pointer">
                    <FiUpload className="text-gray-400 mb-1" />
                    <span className="text-xs">Upload</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(color.id, e)}
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Drag & Drop Image List */}
          {formData.productImages.length > 0 && (
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">
                Image Sequence (Drag to reorder)
              </label>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="product-images" direction="horizontal">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="flex flex-wrap gap-4"
                    >
                      {formData.productImages?.map((img, index) => {
                        const color = colors.find((c) => c.id === img.colorId);
                        return (
                          <Draggable
                            key={index}
                            draggableId={`img-${index}`}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="relative w-32 h-32 border rounded-lg"
                              >
                                <img
                                  src={img.preview}
                                  alt={`Product ${index + 1}`}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                  #{img.serialNo}
                                </div>
                                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                  {color?.name}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                                >
                                  <FiX size={16} />
                                </button>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          )}
        </div>

        {/* Variant Options */}
        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Variant Options</h3>
            <button
              type="button"
              onClick={addVariantOption}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              <FiPlus /> Add Variant
            </button>
          </div>

          {formData.variantOptions?.map((option, index) => {
            const selectedVariant = variants.find(
              (v) => v.id === option.variantId,
            );
            return (
              <div key={index} className="border rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Variant Option {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeVariantOption(index)}
                    className="text-red-500"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Color/Variant
                    </label>
                    <select
                      value={option.variantId}
                      onChange={(e) =>
                        updateVariantOption(
                          index,
                          "variantId",
                          Number(e.target.value),
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="">Select Variant</option>
                      {variants?.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Size (Optional)
                    </label>
                    <select
                      value={option.sizeId || ""}
                      onChange={(e) =>
                        updateVariantOption(
                          index,
                          "sizeId",
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                      disabled={!selectedVariant}
                    >
                      <option value="">Select Size</option>
                      {selectedVariant &&
                        selectedVariant?.sizes?.map((size) => (
                          <option key={size.id} value={size.id}>
                            {size.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price (Optional)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={option.price || ""}
                      onChange={(e) =>
                        updateVariantOption(
                          index,
                          "price",
                          e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Override base price"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Stock (Optional)
                    </label>
                    <input
                      type="number"
                      value={option.stock || ""}
                      onChange={(e) =>
                        updateVariantOption(
                          index,
                          "stock",
                          e.target.value ? parseInt(e.target.value) : undefined,
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Variant stock"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Delivery Estimate
              </label>
              <input
                type="text"
                value={formData.deliveryEstimate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    deliveryEstimate: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Note (Optional)
              </label>
              <textarea
                value={formData.note}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, note: e.target.value }))
                }
                className="w-full px-4 py-2 border rounded-lg"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Product Details (Optional)
              </label>
              <textarea
                value={formData.productDetails}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    productDetails: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Dimensions (Optional)
              </label>
              <textarea
                value={formData.dimension}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dimension: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border rounded-lg"
                rows={2}
                // placeholder=""
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Shipping & Return Policy
              </label>
              <textarea
                value={formData.shippingReturn}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    shippingReturn: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
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
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="px-6 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            <FiSave />
            {isLoading ? "Creating Product..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductAdd;
