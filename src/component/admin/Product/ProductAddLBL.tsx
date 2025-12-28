"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Save, X, Plus } from "lucide-react";
import { PageHeader } from "@/component/PageHeader/PageHeader";
import { FormSection } from "./FormSection";
import {
  DefaultImageUploader,
  ColorImageUploader,
  ProductImageItem,
} from "@/component/admin/Product/ImageUploader";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useFetchSeries from "@/hooks/useFetchSeries";
import useFetchVariants from "@/hooks/useFetchVariants";
import useFetchColors from "@/hooks/useFetchColors";
import useFetchCategoriesBySeriesIds from "@/hooks/useFetchCategoriesBySeriesIds";
import useFetchSubCategoriesByCategoryIds from "@/hooks/useFetchSubCategoriesByCategoryIds";
import GotoArrows from "@/component/Arrow/GotoArrows";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { handleUploadWithCloudinary } from "@/data/handleUploadWithCloudinary";

interface ProductFormData {
  title: string;
  slug: string;
  sku?: string;
  basePrice: number;
  description?: string;
  hasColorVariants: boolean;
  showColor: boolean;
  discountType?: "percentage" | "fixed";
  discount: number;
  discountStart: string;
  discountEnd: string;

  selectedSeriesIds: number[];
  selectedCategoryIds: number[];
  selectedSubCategoryIds: number[];

  selectedColors: number[];
  variantId: number | null;
  selectedSizes: number[];

  note: string;
  deliveryEstimate: string;
  productDetails: string;
  dimension: string;
  shippingReturn: string;
  isActive: boolean;
}

interface ColorVariantDetail {
  colorId: number;
  sizes: {
    sizeId: number;
    sku?: string;
    price?: number;
    stock: number;
  }[];
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
  // sizes: {
  //   create: {
  //     size: { connect: { id: number } };
  //     sku?: string;
  //     price?: number;
  //     stock: {
  //       create: { quantity: number };
  //     };
  //   }[];
  // };
  useDefaultImages?: boolean;
  images?: string[];
  // };
};

const defaultShippingReturn = `Shipping:
• Standard shipping: 5-7 business days
• Express shipping: 2-3 business days
• Free shipping on orders over $50

Returns:
• 30-day return policy
• Items must be unworn with original tags
• Free returns for store credit`;

const ProductAddLBL = () => {
  //   const navigate = useNavigate();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  // Form state

  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    slug: "",
    sku: "",
    basePrice: 0,
    description: "",
    hasColorVariants: true,
    showColor: true,
    discountType: "percentage",
    discount: 0,
    discountStart: new Date().toISOString().split("T")[0],
    discountEnd: new Date().toISOString().split("T")[0],

    selectedSeriesIds: [],
    selectedCategoryIds: [],
    selectedSubCategoryIds: [],

    selectedColors: [],
    variantId: null,
    selectedSizes: [],

    note: "",
    deliveryEstimate: "3-5 business days",
    productDetails: "",
    dimension: "",
    shippingReturn: defaultShippingReturn,
    isActive: true,
  });

  // Hooks
  const { colors, isLoading: colorsLoading } = useFetchColors();
  const { variants, isLoading: variantsLoading } = useFetchVariants();
  const { seriesList, isLoading: seriesLoading } = useFetchSeries();

  const { categoryList, isLoading: categoriesLoading } =
    useFetchCategoriesBySeriesIds(formData.selectedSeriesIds);

  useEffect(() => {
    console.log(formData.selectedSeriesIds, "seriesids");
  }, [formData.selectedSeriesIds]);

  const { subCategoryList, isLoading: subCategoriesLoading } =
    useFetchSubCategoriesByCategoryIds(formData.selectedCategoryIds);
  // Get sizes for selected variant
  const selectedVariant = variants.find((v) => v.id === formData.variantId);
  const availableSizes = selectedVariant?.sizes || [];
  const [colorVariants, setColorVariants] = useState<ColorVariantDetail[]>([]);

  // Images state
  const [defaultImages, setDefaultImages] = useState<ProductImageItem[]>([]);
  const [colorImages, setColorImages] = useState<
    Record<number, ProductImageItem[]>
  >({});
  const [colorUseDefault, setColorUseDefault] = useState<
    Record<number, boolean>
  >({});

  // Slug generation
  const generateSlug = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();

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
    console.log(seriesId);
    setFormData((prev) => {
      const isSelected = prev.selectedSeriesIds.includes(seriesId);
      const newSeriesIds = isSelected
        ? prev.selectedSeriesIds.filter((id) => id !== seriesId)
        : [...prev.selectedSeriesIds, seriesId];

      // Clear categories that don't belong to selected series
      const validCategoryIds = categoryList
        .filter((c) => newSeriesIds.includes(c.seriesId))
        .map((c) => c.id);
      const newCategoryIds = prev.selectedCategoryIds.filter((id) =>
        validCategoryIds.includes(id)
      );

      return {
        ...prev,
        selectedSeriesIds: newSeriesIds,
        selectedCategoryIds: newCategoryIds,
      };
    });
  };

  const handleCategoryToggle = (categoryId: number) => {
    setFormData((prev) => {
      const isSelected = prev.selectedCategoryIds.includes(categoryId);
      const newCategoryIds = isSelected
        ? prev.selectedCategoryIds.filter((id) => id !== categoryId)
        : [...prev.selectedCategoryIds, categoryId];

      // Clear subcategories that don't belong to selected categories
      const validSubCategoryIds = subCategoryList
        .filter((sc) => newCategoryIds.includes(sc.categoryId))
        .map((sc) => sc.id);
      const newSubCategoryIds = prev.selectedSubCategoryIds.filter((id) =>
        validSubCategoryIds.includes(id)
      );

      return {
        ...prev,
        selectedCategoryIds: newCategoryIds,
        selectedSubCategoryIds: newSubCategoryIds,
      };
    });
  };

  const handleSubCategoryToggle = (subCategoryId: number) => {
    setFormData((prev) => {
      const isSelected = prev.selectedSubCategoryIds.includes(subCategoryId);
      const newSubCategoryIds = isSelected
        ? prev.selectedSubCategoryIds.filter((id) => id !== subCategoryId)
        : [...prev.selectedSubCategoryIds, subCategoryId];
      return { ...prev, selectedSubCategoryIds: newSubCategoryIds };
    });
  };

  const handleColorToggle = (colorId: number) => {
    setFormData((prev) => {
      const isSelected = prev.selectedColors.includes(colorId);
      const newColors = isSelected
        ? prev.selectedColors.filter((id) => id !== colorId)
        : [...prev.selectedColors, colorId];
      return { ...prev, selectedColors: newColors };
    });

    // Initialize with default images when adding a color
    if (!colorImages[colorId]) {
      setColorImages((prev) => ({ ...prev, [colorId]: [] }));
      setColorUseDefault((prev) => ({ ...prev, [colorId]: true }));
    }
  };

  const handleSizeToggle = (sizeId: number) => {
    setFormData((prev) => {
      const isSelected = prev.selectedSizes.includes(sizeId);
      const newSizes = isSelected
        ? prev.selectedSizes.filter((id) => id !== sizeId)
        : [...prev.selectedSizes, sizeId];
      return { ...prev, selectedSizes: newSizes };
    });
  };

  const handleColorImagesChange = (
    colorId: number,
    images: ProductImageItem[]
  ) => {
    setColorImages((prev) => ({ ...prev, [colorId]: images }));
  };

  const handleColorUseDefaultChange = (
    colorId: number,
    useDefault: boolean
  ) => {
    setColorUseDefault((prev) => ({ ...prev, [colorId]: useDefault }));
  };

  // Get category/subcategory info for display
  const getSeriesName = (id: number) =>
    seriesList.find((s) => s.id === id)?.name || "";
  const getCategoryName = (id: number) =>
    categoryList.find((c) => c.id === id)?.name || "";
  const getSubCategoryName = (id: number) =>
    subCategoryList.find((sc) => sc.id === id)?.name || "";

  const axiosSecure = useAxiosSecure();

  ///////////////////////////////////////////////
  // FORM SUBMIT //
  ///////////////////////////////////////////////
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Product title is required");
      return;
    }

    if (formData.basePrice <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    if (formData.selectedSubCategoryIds.length === 0) {
      toast.error("Please select at least one subcategory");
      return;
    }

    // Check if at least default images or color-specific images exist
    const hasImages =
      defaultImages.length > 0 ||
      Object.values(colorImages).some((imgs) => imgs.length > 0);

    console.log(defaultImages);

    if (!hasImages) {
      toast.error("Please upload at least one product image");
      return;
    }

    setIsLoading(true);

    console.log(
      formData.selectedColors,
      "formData.selectedColors",
      colorImages
    );

    try {
      // Upload images first and get URLs
      const uploadPromises = [
        // Upload default images
        ...defaultImages.map(async (img) => {
          if (img.file) {
            const url = await uploadImage(img.file);
            return { url, serialNo: img.serialNo };
          }
          return null;
        }),
        // Upload color-specific images
        ...formData.selectedColors.flatMap((colorId) =>
          !colorUseDefault[colorId]
            ? (colorImages[colorId] || []).map(async (img) => {
                if (img.file) {
                  const url = await uploadImage(img.file);
                  return { url, colorId };
                }
                return null;
              })
            : []
        ),
      ];

      const uploadedImages = (await Promise.all(uploadPromises)).filter(
        Boolean
      ) as UploadedImage[];

      // Separate default and color images
      const defaultImageUrls = uploadedImages
        .filter(
          (img): img is Extract<UploadedImage, { serialNo: number }> =>
            "serialNo" in img
        )
        .map((img) => ({
          image: img.url,
          serialNo: img.serialNo,
        }));

      const colorImageMap = uploadedImages
        .filter(
          (img): img is Extract<UploadedImage, { colorId: number }> =>
            "colorId" in img
        )
        .reduce<ColorImageMap>((acc, img) => {
          if (!acc[img.colorId]) acc[img.colorId] = [];
          acc[img.colorId].push(img.url);
          return acc;
        }, {});

      console.log(
        // defaultImageUrls,
        // "defaultImageUrls",
        colorImageMap,
        "colorImageMap",
        uploadedImages,
        "uploadedImages"
        // uploadPromises,
        // "uploadPromises"
      );

      console.log(formData.selectedColors, "formData.selectedColors");
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
          formData.discountType === "percentage"
            ? "percentage"
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

        // Subcategories connection
        subCategories: [...formData.selectedSubCategoryIds],

        // Colors with nested sizes and images
        colors:
          // {
          // create:
          formData.selectedColors.map((colorId) => {
            const colorData: ProductColorCreateInput = {
              // color: { connect: { id:
              colorId,
              // } }
            };

            // colorData.images = !colorUseDefault[colorId]
            //   ? [...colorImageMap[colorId]]
            //   : [];

            if (!colorUseDefault[colorId] && colorImageMap[colorId]) {
              colorData.images = [...colorImageMap[colorId]];
            } else if (colorUseDefault[colorId]) {
              colorData.useDefaultImages = true;
            }

            return colorData;
          }),
        // },

        // Default product images
        images: [...defaultImageUrls],
      };

      console.log("Submit Data:", submitData);

      // Make API call
      const response = await axiosSecure.post("/products", submitData);
      console.log(response.data);

      toast.success("Product created successfully!");
      // setTimeout(() => router.push("/admin/products"), 1000);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create product");
    } finally {
      setIsLoading(false);
    }
  };

  // Add this image upload function
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await handleUploadWithCloudinary(file);

    console.log(response, "image response");

    return response;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Add New Product"
          subtitle="Create a new product with all details"
          backLink="/"
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <FormSection
            title="Basic Information"
            description="Product name, pricing, and stock"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                  {seriesList.map((s) => (
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
                      {categoryList.map((c) => (
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
                      {subCategoryList.map((sc) => (
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
                    {formData.selectedSubCategoryIds.map((id) => {
                      const sc = subCategoryList.find((s) => s.id === id);
                      const cat = categoryList.find(
                        (c) => c.id === sc?.categoryId
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
                {colors.map((color) => (
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
                  {formData.selectedColors.map((colorId) => {
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

          {/* Variants & Sizes */}
          {/* <FormSection
            title="Variant & Sizes"
            description="Select variant type and available sizes"
          >
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Variant Type
                </label>
                <select
                  value={formData.variantId || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      variantId: e.target.value ? Number(e.target.value) : null,
                      selectedSizes: [],
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
             focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={variantsLoading}
                >
                  <option value="">-- Select Variant --</option>
                  {variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              {formData.variantId && availableSizes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available Sizes
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size.id}
                        type="button"
                        onClick={() => handleSizeToggle(size.id)}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                          formData.selectedSizes.includes(size.id)
                            ? "border-blue-200 bg-blue-200 text-blue-200-foreground"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {formData.variantId && availableSizes.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  No sizes available for this variant type
                </p>
              )}
            </div>
          </FormSection> */}

          {/* Additional Details */}
          <FormSection
            title="Additional Details"
            description="Optional product information"
          >
            <div className="space-y-5">
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
            <div className="flex items-center gap-3">
              <label className="block text-sm font-medium text-gray-700 mb-1 mb-0">
                Product Status
              </label>
              <select
                value={formData.isActive ? "1" : "0"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: e.target.value === "1",
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
             focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          </FormSection>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={() => router.push("/")}
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
