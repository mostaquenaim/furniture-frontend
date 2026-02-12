/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Save, X } from "lucide-react";
import { PageHeader } from "@/component/PageHeader/PageHeader";
import { FormSection } from "./FormSection";
import {
  DefaultImageUploader,
  ColorImageUploader,
  ProductImageItem,
} from "@/component/admin/Product/ImageUploader";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useFetchSeries from "@/hooks/Categories/useFetchSeries";
import useFetchVariants from "@/hooks/useFetchVariants";
import useFetchColors from "@/hooks/useFetchColors";
import useFetchCategoriesBySeriesIds from "@/hooks/Admin/Categories/useFetchCategoriesBySeriesIds";
import useFetchSubCategoriesByCategoryIds from "@/hooks/Categories/useFetchSubCategoriesByCategoryIds";
import GotoArrows from "@/component/Arrow/GotoArrows";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import { handleUploadWithCloudinary } from "@/data/handleUploadWithCloudinary";
import useFetchMaterials from "@/hooks/useFetchMaterials";
import useFetchTags from "@/hooks/Tags/useFetchTags";
import { Tag } from "@/types/product.types";

type DiscountType = "PERCENT" | "FIXED";

interface ProductFormData {
  title: string;
  slug: string;
  sku?: string;
  basePrice: number;
  description?: string;
  brand?: string;
  hasColorVariants: boolean;
  showColor: boolean;
  discountType?: "PERCENT" | "fixed";
  discount: number;
  discountStart: string;
  discountEnd: string;

  selectedSeriesIds: number[];
  selectedCategoryIds: number[];
  selectedSubCategoryIds: number[];

  selectedColors: number[];
  variantId: number | null;
  materialId?: number | null;

  note: string;
  deliveryEstimate: string;
  productDetails: string;
  dimension: string;
  shippingReturn: string;
  isActive: boolean;
  isFeatured: boolean;
}

interface SizeDetail {
  sizeId: number;
  sku?: string;
  price?: number;
  quantity: number;
}

interface ColorVariantDetail {
  colorId: number;
  sizes: SizeDetail[];
  customImages: ProductImageItem[];
  useDefaultImages: boolean;
}

type UploadedImage =
  | {
      url: string;
      serialNo: number;
      colorId?: never;
    }
  | {
      url: string;
      colorId: number;
      serialNo?: never;
    };

type ColorImageMap = Record<number, string[]>;

type ProductColorCreateInput = {
  colorId: number;
  sizes?: {
    sizeId: number;
    sku?: string;
    price?: number;
    quantity: number;
  }[];
  useDefaultImages?: boolean;
  images?: string[];
};

const defaultShippingReturn = `Shipping:
• Standard shipping: 5-7 business days
• Express shipping: 2-3 business days
• Free shipping on orders over ৳50

Returns:
• 30-day return policy
• Items must be unworn with original tags
• Free returns for store credit`;

const ProductAddLBL = () => {
  const router = useRouter();
  const axiosSecure = useAxiosSecure();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    slug: "",
    sku: "",
    basePrice: 0,
    description: "",
    brand: "",
    hasColorVariants: true,
    showColor: true,
    discountType: "PERCENT",
    discount: 0,
    discountStart: new Date().toISOString().split("T")[0],
    discountEnd: new Date().toISOString().split("T")[0],

    selectedSeriesIds: [],
    selectedCategoryIds: [],
    selectedSubCategoryIds: [],

    selectedColors: [],
    variantId: null,
    materialId: null,

    note: "",
    deliveryEstimate: "3-5 business days",
    productDetails: "",
    dimension: "",
    shippingReturn: defaultShippingReturn,
    isActive: true,
    isFeatured: false,
  });

  // Hooks
  const { colors, isLoading: colorsLoading } = useFetchColors();
  const { variants, isLoading: variantsLoading } = useFetchVariants();
  const { seriesList, isLoading: seriesLoading } = useFetchSeries();

  const { materials, isLoading: isMaterialLoading } = useFetchMaterials();
  const { categoryList, isLoading: categoriesLoading } =
    useFetchCategoriesBySeriesIds(formData.selectedSeriesIds);

  const { subCategoryList, isLoading: subCategoriesLoading } =
    useFetchSubCategoriesByCategoryIds(formData.selectedCategoryIds);

  const { tags, refetch } = useFetchTags();

  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Get sizes for selected variant
  const selectedVariant = variants.find((v) => v.id === formData.variantId);
  // const availableSizes = selectedVariant?.sizes || [];

  // Sizes state
  const [sizeSelections, setSizeSelections] = useState<{
    [colorId: number]: SizeDetail[];
  }>({});

  // Images state
  const [defaultImages, setDefaultImages] = useState<ProductImageItem[]>([]);
  const [colorImages, setColorImages] = useState<
    Record<number, ProductImageItem[]>
  >({});
  const [colorUseDefault, setColorUseDefault] = useState<
    Record<number, boolean>
  >({});

  const tagExists = tags.some(
    (tag: any) => tag.name.toLowerCase() === searchTerm.toLowerCase(),
  );

  const filteredTags = tags.filter((tag: any) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Reset size selections when variant changes
  useEffect(() => {
    if (!formData.variantId) return;

    const selectedVariant = variants.find((v) => v.id === formData.variantId);
    if (!selectedVariant) return;

    const newSizeSelections: { [colorId: number]: SizeDetail[] } = {};

    formData.selectedColors.forEach((colorId) => {
      if (selectedVariant.sizes) {
        newSizeSelections[colorId] = selectedVariant.sizes.map((size) => ({
          sizeId: size.id,
          sku: "",
          price: formData.basePrice || undefined,
          quantity: 0,
        }));
      }
    });

    setSizeSelections(newSizeSelections);
  }, [
    formData.variantId,
    formData.selectedColors,
    formData.basePrice,
    variants,
  ]);

  // Slug generation
  const generateSlug = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();

  // name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  // Multi-select handlers
  const handleSeriesToggle = (seriesId: number) => {
    setFormData((prev) => {
      const isSelected = prev.selectedSeriesIds.includes(seriesId);
      const newSeriesIds = isSelected
        ? prev.selectedSeriesIds.filter((id) => id !== seriesId)
        : [...prev.selectedSeriesIds, seriesId];

      // Clear categories that don't belong to selected series
      const validCategoryIds = categoryList
        .filter((c) => newSeriesIds.includes(c.seriesId))
        ?.map((c) => c.id);
      const newCategoryIds = prev.selectedCategoryIds.filter((id) =>
        validCategoryIds.includes(id),
      );

      return {
        ...prev,
        selectedSeriesIds: newSeriesIds,
        selectedCategoryIds: newCategoryIds,
      };
    });
  };

  // category toggle
  const handleCategoryToggle = (categoryId: number) => {
    setFormData((prev) => {
      const isSelected = prev.selectedCategoryIds.includes(categoryId);
      const newCategoryIds = isSelected
        ? prev.selectedCategoryIds.filter((id) => id !== categoryId)
        : [...prev.selectedCategoryIds, categoryId];

      // Clear subcategories that don't belong to selected categories
      const validSubCategoryIds = subCategoryList
        .filter((sc) => newCategoryIds.includes(sc.categoryId))
        ?.map((sc) => sc.id);
      const newSubCategoryIds = prev.selectedSubCategoryIds.filter((id) =>
        validSubCategoryIds.includes(id),
      );

      return {
        ...prev,
        selectedCategoryIds: newCategoryIds,
        selectedSubCategoryIds: newSubCategoryIds,
      };
    });
  };

  // subcategory toggle
  const handleSubCategoryToggle = (subCategoryId: number) => {
    setFormData((prev) => {
      const isSelected = prev.selectedSubCategoryIds.includes(subCategoryId);
      const newSubCategoryIds = isSelected
        ? prev.selectedSubCategoryIds.filter((id) => id !== subCategoryId)
        : [...prev.selectedSubCategoryIds, subCategoryId];
      return { ...prev, selectedSubCategoryIds: newSubCategoryIds };
    });
  };

  // color toggle
  const handleColorToggle = (colorId: number) => {
    setFormData((prev) => {
      const isSelected = prev.selectedColors.includes(colorId);
      const newColors = isSelected
        ? prev.selectedColors.filter((id) => id !== colorId)
        : [...prev.selectedColors, colorId];

      // Clean up size selections when color is removed
      if (isSelected) {
        const newSizeSelections = { ...sizeSelections };
        delete newSizeSelections[colorId];
        setSizeSelections(newSizeSelections);
      }

      return { ...prev, selectedColors: newColors };
    });

    // Initialize with default images when adding a color
    if (!colorImages[colorId]) {
      setColorImages((prev) => ({ ...prev, [colorId]: [] }));
      setColorUseDefault((prev) => ({ ...prev, [colorId]: true }));
    }
  };

  // color image change
  const handleColorImagesChange = (
    colorId: number,
    images: ProductImageItem[],
  ) => {
    setColorImages((prev) => ({ ...prev, [colorId]: images }));
  };

  // color use default change
  const handleColorUseDefaultChange = (
    colorId: number,
    useDefault: boolean,
  ) => {
    setColorUseDefault((prev) => ({ ...prev, [colorId]: useDefault }));
  };

  // Size handlers
  const handleSizeFieldChange = (
    colorId: number,
    sizeId: number,
    field: keyof SizeDetail,
    value: string | number,
  ) => {
    setSizeSelections((prev) => {
      const newSelections = { ...prev };
      if (newSelections[colorId]) {
        const sizeIndex = newSelections[colorId].findIndex(
          (s) => s.sizeId === sizeId,
        );
        if (sizeIndex !== -1) {
          newSelections[colorId][sizeIndex] = {
            ...newSelections[colorId][sizeIndex],
            [field]: field === "quantity" ? Number(value) : value,
          };
        }
      }
      return newSelections;
    });
  };

  // tags / add tag / remove tag / delete tag
  const addTag = (tag: Tag) => {
    if (selectedTags.length >= 10) return;

    if (!selectedTags.find((t) => t.id === tag.id)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  const removeTag = (id: number) => {
    setSelectedTags((prev) => prev.filter((t) => t.id !== id));
  };

  const handleCreateTag = async () => {
    if (!searchTerm.trim()) return;
    if (selectedTags.length >= 10) return;

    const res = await axiosSecure.post("tags", {
      name: searchTerm.trim().toLowerCase(),
    });

    const newTag = res.data;

    refetch();
    setSelectedTags((prev) => [...prev, newTag]);
    setSearchTerm("");
  };

  // Get category/subcategory info for display
  const getSeriesName = (id: number) =>
    seriesList.find((s) => s.id === id)?.name || "";
  const getCategoryName = (id: number) =>
    categoryList.find((c) => c.id === id)?.name || "";
  const getSubCategoryName = (id: number) =>
    subCategoryList.find((sc) => sc.id === id)?.name || "";

  // Image upload function
  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    try {
      const response = await handleUploadWithCloudinary(file);
      return response;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error("Failed to upload image");
    }
  };

  // Form validation
  const validateForm = (): string | null => {
    if (!formData.title.trim()) {
      return "Product title is required";
    }

    if (formData.basePrice <= 0) {
      return "Price must be greater than 0";
    }

    if (formData.selectedSubCategoryIds.length === 0) {
      return "Please select at least one subcategory";
    }

    const hasImages =
      defaultImages.length > 0 ||
      Object.values(colorImages).some((imgs) => imgs.length > 0);

    if (!hasImages) {
      return "Please upload at least one product image";
    }

    // Validate that variant is selected if sizes are needed
    if (formData.hasColorVariants && !formData.variantId) {
      return "Please select a variant type";
    }

    // Validate that each color has at least one size with quantity > 0
    if (formData.hasColorVariants) {
      for (const colorId of formData.selectedColors) {
        const colorSizes = sizeSelections[colorId] || [];
        const hasValidSize = colorSizes.some((size) => size.quantity > 0);
        if (!hasValidSize) {
          const color = colors.find((c) => c.id === colorId);
          return `Color "${color?.name}" must have at least one size with quantity > 0`;
        }
      }
    }

    // Validate discount dates
    if (formData.discount > 0) {
      const startDate = new Date(formData.discountStart);
      const endDate = new Date(formData.discountEnd);

      if (startDate > endDate) {
        return "Discount end date must be after start date";
      }
    }

    return null;
  };

  ///////////////////////////////////////////////
  // FORM SUBMIT //
  ///////////////////////////////////////////////
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsLoading(true);

    try {
      // Upload images first and get URLs
      const uploadPromises = [
        // Upload default images
        ...defaultImages?.map(async (img) => {
          if (img.file) {
            const url = await uploadImageToCloudinary(img.file);
            return { url, serialNo: img.serialNo };
          }
          return null;
        }),
        // Upload color-specific images
        ...formData.selectedColors.flatMap((colorId) =>
          !colorUseDefault[colorId]
            ? (colorImages[colorId] || [])?.map(async (img) => {
                if (img.file) {
                  const url = await uploadImageToCloudinary(img.file);
                  return { url, colorId };
                }
                return null;
              })
            : [],
        ),
      ];

      const uploadedImages = (await Promise.all(uploadPromises)).filter(
        Boolean,
      ) as UploadedImage[];

      // Separate default and color images
      const defaultImageUrls = uploadedImages
        .filter(
          (img): img is Extract<UploadedImage, { serialNo: number }> =>
            "serialNo" in img,
        )
        ?.map((img) => ({
          image: img.url,
          serialNo: img.serialNo,
        }));

      const colorImageMap = uploadedImages
        .filter(
          (img): img is Extract<UploadedImage, { colorId: number }> =>
            "colorId" in img,
        )
        .reduce<ColorImageMap>((acc, img) => {
          if (!acc[img.colorId]) acc[img.colorId] = [];
          acc[img.colorId].push(img.url);
          return acc;
        }, {});

      // Prepare color variants with sizes
      const colorVariants: ProductColorCreateInput[] =
        formData.selectedColors?.map((colorId) => {
          const colorData: ProductColorCreateInput = {
            colorId,
          };

          // Add images
          if (!colorUseDefault[colorId] && colorImageMap[colorId]) {
            colorData.images = [...colorImageMap[colorId]];
            colorData.useDefaultImages = false;
          } else if (colorUseDefault[colorId]) {
            colorData.useDefaultImages = true;
          }

          // Add sizes
          const colorSizes = sizeSelections[colorId] || [];
          if (colorSizes.length > 0) {
            // Filter out sizes with 0 quantity
            const validSizes = colorSizes.filter((size) => size.quantity > 0);
            if (validSizes.length > 0) {
              colorData.sizes = validSizes;
            }
          }

          return colorData;
        });

      const finalTags = selectedTags.map((t) => t.id);
      console.log(finalTags, "finalTags");
      // Prepare submit data
      const submitData = {
        title: formData.title,
        slug: formData.slug,
        sku: formData.sku || undefined,
        basePrice: formData.basePrice,
        description: formData.description || undefined,
        hasColorVariants: formData.hasColorVariants,
        showColor: formData.showColor,
        discountType:
          formData.discountType === "PERCENT"
            ? "PERCENT"
            : formData.discountType === "fixed"
              ? "fixed"
              : undefined,
        discount: formData.discount,
        discountStart: formData.discountStart
          ? new Date(formData.discountStart)
          : undefined,
        discountEnd: formData.discountEnd
          ? new Date(formData.discountEnd)
          : undefined,
        note: formData.note || undefined,
        deliveryEstimate: formData.deliveryEstimate || undefined,
        productDetails: formData.productDetails || undefined,
        dimension: formData.dimension || undefined,
        shippingReturn: formData.shippingReturn || undefined,
        isActive: formData.isActive,
        materialId: formData.materialId || undefined,
        isFeatured: formData.isFeatured,
        tags: finalTags,

        // Subcategories connection
        subCategories: [...formData.selectedSubCategoryIds],

        // Colors with sizes
        colors: colorVariants,

        // Default product images
        images: [...defaultImageUrls],
      };

      console.log(colorVariants, "Submit Data:", submitData);

      // Make API call
      const response = await axiosSecure.post("/products", submitData);
      console.log(response.data);

      toast.success("Product created successfully!");
      // router.push("/admin/products");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Failed to create product");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate discounted price for display
  const discountedPrice = useMemo(() => {
    if (formData.discount <= 0) return formData.basePrice;

    if (formData.discountType === "PERCENT") {
      return formData.basePrice * (1 - formData.discount / 100);
    } else {
      return Math.max(0, formData.basePrice - formData.discount);
    }
  }, [formData.basePrice, formData.discount, formData.discountType]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* page header */}
        <PageHeader
          title="Add New Product"
          subtitle="Create a new product with all details"
          backLink="/admin"
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <FormSection
            title="Basic Information"
            description="Product name, pricing, and stock"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* product name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleNameChange}
                  placeholder="Enter product name"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              {/* slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      slug: generateSlug(e.target.value),
                    }))
                  }
                  placeholder="product-slug"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {/* price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  value={formData.basePrice || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      basePrice: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </FormSection>

          {/* Discount */}
          <FormSection title="Discount" description="Set up product discount">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Discount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount (%)
                </label>
                <input
                  type="number"
                  value={formData.discount || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      discount: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="0"
                  min="0"
                  max="100"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* start date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
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
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* end date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
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
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </FormSection>

          {/* Series, Categories, SubCategories - Multi-select */}
          <FormSection
            title="Categories"
            description="Select multiple series, categories, and subcategories"
          >
            <div className="space-y-6">
              {/* Series Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Series (select multiple)
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {seriesList?.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSeriesToggle(s.id)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all 
                        ${
                          formData.selectedSeriesIds.includes(s.id)
                            ? "border-blue-200 bg-blue-200 text-blue-200-foreground"
                            : "border-border hover:border-muted-foreground"
                        }
                      `}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories Selection */}
              {formData.selectedSeriesIds.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categories (select multiple)
                  </label>
                  {categoriesLoading ? (
                    <div className="text-muted-foreground text-sm">
                      Loading categories...
                    </div>
                  ) : categoryList.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {categoryList?.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleCategoryToggle(c.id)}
                          className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                            formData.selectedCategoryIds.includes(c.id)
                              ? "border-blue-200 bg-blue-200 text-blue-200-foreground"
                              : "border-border hover:border-muted-foreground"
                          }`}
                        >
                          <span className="text-xs opacity-60 mr-1">
                            {getSeriesName(c.seriesId)}:
                          </span>
                          {c.name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm">
                      No categories available
                    </div>
                  )}
                </div>
              )}

              {/* SubCategories Selection */}
              {formData.selectedCategoryIds.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subcategories (select multiple) *
                  </label>
                  {subCategoriesLoading ? (
                    <div className="text-muted-foreground text-sm">
                      Loading subcategories...
                    </div>
                  ) : subCategoryList.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {subCategoryList?.map((sc) => (
                        <button
                          key={sc.id}
                          type="button"
                          onClick={() => handleSubCategoryToggle(sc.id)}
                          className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                            formData.selectedSubCategoryIds.includes(sc.id)
                              ? "border-blue-200 bg-blue-200 text-blue-200-foreground"
                              : "border-border hover:border-muted-foreground"
                          }`}
                        >
                          <span className="text-xs opacity-60 mr-1">
                            {getCategoryName(sc.categoryId)}:
                          </span>
                          {sc.name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm">
                      No subcategories available
                    </div>
                  )}
                </div>
              )}

              {/* Selected summary */}
              {formData.selectedSubCategoryIds.length > 0 && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Selected subcategories:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedSubCategoryIds?.map((id) => {
                      const sc = subCategoryList.find((s) => s.id === id);
                      const cat = categoryList.find(
                        (c) => c.id === sc?.categoryId,
                      );
                      return sc ? (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                        >
                          {cat?.name} → {sc.name}
                          <button
                            type="button"
                            onClick={() => handleSubCategoryToggle(id)}
                            className="hover:bg-primary/20 rounded-full p-0.5"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </FormSection>

          {/* Colors */}
          <FormSection
            title="Colors"
            description="Select available colors for this product"
          >
            {colorsLoading ? (
              <div className="text-muted-foreground">Loading colors...</div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {colors?.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => handleColorToggle(color.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                      formData.selectedColors.includes(color.id)
                        ? "border-blue-200 bg-blue-200"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full border border-border shadow-sm"
                      style={{ backgroundColor: color.hexCode }}
                    />
                    <span className="text-sm font-medium">{color.name}</span>
                  </button>
                ))}
              </div>
            )}
          </FormSection>

          {/* Product Images */}
          <FormSection
            title="Product Images"
            description="Upload default images and optionally add color-specific images"
          >
            <div className="space-y-6">
              {/* Default Images */}
              <DefaultImageUploader
                images={defaultImages}
                onImagesChange={setDefaultImages}
              />

              {/* Color-specific Images */}
              {formData.selectedColors.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-foreground">
                    Color-specific Images
                  </h4>
                  {formData.selectedColors?.map((colorId) => {
                    const color = colors.find((c) => c.id === colorId);
                    if (!color) return null;
                    return (
                      <ColorImageUploader
                        key={colorId}
                        colorId={colorId}
                        color={color}
                        images={colorImages[colorId] || []}
                        defaultImages={defaultImages}
                        useDefault={colorUseDefault[colorId] ?? true}
                        onImagesChange={handleColorImagesChange}
                        onUseDefaultChange={handleColorUseDefaultChange}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </FormSection>

          {/* variant and sizes  */}
          <FormSection
            title="Variant & Sizes"
            description="Select variant type and manage sizes for each color"
          >
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Variant Type *
                </label>
                <select
                  value={formData.variantId || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      variantId: e.target.value ? Number(e.target.value) : null,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
             focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={variantsLoading}
                  required={formData.hasColorVariants}
                >
                  <option value="">-- Select Variant --</option>
                  {variants?.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              {formData.variantId && formData.selectedColors.length > 0 && (
                <div className="space-y-6">
                  <h4 className="text-sm font-medium text-gray-700">
                    Size Management per Color
                  </h4>
                  {formData.selectedColors?.map((colorId) => {
                    const color = colors.find((c) => c.id === colorId);
                    const colorSizes = sizeSelections[colorId] || [];

                    // console.log(colorSizes, "colorSizes");

                    return (
                      <div
                        key={colorId}
                        className="border rounded-lg p-4 bg-gray-50"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <div
                            className="w-4 h-4 rounded-full border border-border shadow-sm"
                            style={{ backgroundColor: color?.hexCode }}
                          />
                          <h5 className="font-medium">{color?.name} Sizes</h5>
                        </div>

                        {colorSizes.length > 0 ? (
                          <div className="space-y-3">
                            {colorSizes?.map((sizeDetail, index) => {
                              const size = selectedVariant?.sizes?.find(
                                (s) => s.id === sizeDetail.sizeId,
                              );

                              return (
                                <div
                                  key={sizeDetail.sizeId}
                                  className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center"
                                >
                                  <div className="col-span-1">
                                    <span className="text-sm font-medium">
                                      {size?.name}
                                    </span>
                                  </div>

                                  <div className="col-span-1">
                                    <input
                                      type="text"
                                      placeholder="SKU"
                                      value={sizeDetail.sku || ""}
                                      onChange={(e) =>
                                        handleSizeFieldChange(
                                          colorId,
                                          sizeDetail.sizeId,
                                          "sku",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm"
                                    />
                                  </div>

                                  <div className="col-span-1">
                                    <input
                                      type="number"
                                      placeholder="Price"
                                      value={sizeDetail.price || ""}
                                      onChange={(e) =>
                                        handleSizeFieldChange(
                                          colorId,
                                          sizeDetail.sizeId,
                                          "price",
                                          e.target.value,
                                        )
                                      }
                                      min="0"
                                      step="0.01"
                                      className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm"
                                    />
                                  </div>

                                  <div className="col-span-1">
                                    <input
                                      type="number"
                                      placeholder="Quantity"
                                      value={sizeDetail.quantity || ""}
                                      onChange={(e) =>
                                        handleSizeFieldChange(
                                          colorId,
                                          sizeDetail.sizeId,
                                          "quantity",
                                          e.target.value,
                                        )
                                      }
                                      min="0"
                                      className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm"
                                      // required
                                    />
                                  </div>

                                  <div className="col-span-1 text-sm text-gray-500">
                                    {sizeDetail.price
                                      ? `৳${sizeDetail.price}`
                                      : `৳${formData.basePrice.toFixed(2)}`}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 italic">
                            No sizes available for this variant
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </FormSection>

          {/* Additional Details */}
          <FormSection
            title="Additional Details"
            description="Optional product information"
          >
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Material */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Material
                  </label>
                  <select
                    value={formData.materialId || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        materialId: e.target.value
                          ? Number(e.target.value)
                          : null,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- Select Material --</option>
                    {materials?.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div
                // onBlur={() => setShowDropdown(false)}
                className="relative"
              >
                <div
                  className="border rounded-md p-2 flex flex-wrap gap-2 cursor-text"
                  onClick={() => setShowDropdown(true)}
                >
                  {selectedTags.map((tag) => (
                    <span
                      key={tag.id}
                      className="bg-gray-200 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {tag.name}
                      <button onClick={() => removeTag(tag.id)}>×</button>
                    </span>
                  ))}

                  <input
                    type="text"
                    className="flex-1 outline-none text-sm"
                    placeholder="Add tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                  />
                </div>

                {showDropdown && (
                  <div className=" z-10 mt-1 w-full bg-white border rounded-md max-h-60 overflow-y-auto shadow">
                    {filteredTags.map((tag: any) => (
                      <div
                        key={tag.id}
                        onClick={() => addTag(tag)}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      >
                        {tag.name}
                      </div>
                    ))}

                    {/* Create Option */}
                    {searchTerm && !tagExists && (
                      <div
                        onClick={handleCreateTag}
                        className="px-3 py-2 text-sm text-blue-600 hover:bg-gray-100 cursor-pointer"
                      >
                        + Create "{searchTerm}"
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note (Internal)
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, note: e.target.value }))
                  }
                  placeholder="Internal notes about this product..."
                  rows={2}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Delivery
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
                    placeholder="3-5 business days"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dimensions (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.dimension}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        dimension: e.target.value,
                      }))
                    }
                    placeholder="e.g., 10x20x5 cm"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  placeholder="Detailed product description, materials, care instructions..."
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  rows={6}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
                />
              </div>
            </div>
          </FormSection>

          {/* Status */}
          <FormSection title="Status">
            <div className="flex items-center gap-2 col-span-1 md:col-span-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
                id="isFeatured"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isFeatured" className="text-sm text-gray-700">
                Active (visible to customers)
              </label>
            </div>

            {/* Featured toggle */}
            <div className="flex items-center gap-2 col-span-1 md:col-span-2">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isFeatured: e.target.checked,
                  }))
                }
                id="isFeatured"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isFeatured" className="text-sm text-gray-700">
                Featured Product (show in featured product)
              </label>
            </div>
          </FormSection>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md
               border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-md
               bg-blue-600 text-white hover:bg-blue-700 transition
               disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isLoading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
        <GotoArrows></GotoArrows>
      </div>
    </div>
  );
};

export default ProductAddLBL;
