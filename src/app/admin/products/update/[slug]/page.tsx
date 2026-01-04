/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Save, X } from "lucide-react";
import { PageHeader } from "@/component/PageHeader/PageHeader";
import { FormSection } from "@/component/admin/Product/FormSection";
import {
  DefaultImageUploader,
  ColorImageUploader,
  ProductImageItem,
} from "@/component/admin/Product/ImageUploader";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useFetchSeries from "@/hooks/useFetchSeries";
import useFetchVariants from "@/hooks/useFetchVariants";
import useFetchColors from "@/hooks/useFetchColors";
import useFetchCategoriesBySeriesIds from "@/hooks/useFetchCategoriesBySeriesIds";
import useFetchSubCategoriesByCategoryIds from "@/hooks/useFetchSubCategoriesByCategoryIds";
import GotoArrows from "@/component/Arrow/GotoArrows";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { handleUploadWithCloudinary } from "@/data/handleUploadWithCloudinary";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import LoadingDots from "@/component/Loading/LoadingDS";

interface ProductFormData {
  title: string;
  slug: string;
  sku?: string;
  basePrice: number;
  description?: string;
  hasColorVariants: boolean;
  showColor: boolean;
  discountType?: "PERCENT" | "FIXED";
  discount: number;
  discountStart: string;
  discountEnd: string;

  selectedSeriesIds: number[];
  selectedCategoryIds: number[];
  selectedSubCategoryIds: number[];

  selectedColors: number[];
  variantId: number | null;

  note: string;
  deliveryEstimate: string;
  productDetails: string;
  dimension: string;
  shippingReturn: string;
  isActive: boolean;
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
• Free shipping on orders over $50

Returns:
• 30-day return policy
• Items must be unworn with original tags
• Free returns for store credit`;

const UpdateProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const productId = slug;

  //   console.log(productId,'productId');

  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    slug: "",
    sku: "",
    basePrice: 0,
    description: "",
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

    note: "",
    deliveryEstimate: "3-5 business days",
    productDetails: "",
    dimension: "",
    shippingReturn: defaultShippingReturn,
    isActive: true,
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const isHydrating = React.useRef(true);

  // fetch product
  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      try {
        const { data } = await axiosPublic.get(`/product/${productId}`);
        console.log(data, "hydration");
        hydrateForm(data);
        // Wait a tick for state to settle before allowing the "reset" effects to run
        isHydrating.current = false;
      } catch (err) {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // Hooks
  const { colors, isLoading: colorsLoading } = useFetchColors();
  const { variants, isLoading: variantsLoading } = useFetchVariants();
  const { seriesList, isLoading: seriesLoading } = useFetchSeries();

  const { categoryList, isLoading: categoriesLoading } =
    useFetchCategoriesBySeriesIds(formData.selectedSeriesIds);

  const { subCategoryList, isLoading: subCategoriesLoading } =
    useFetchSubCategoriesByCategoryIds(formData.selectedCategoryIds);

  // Get sizes for selected variant
  const selectedVariant = variants.find((v) => v.id === formData.variantId);
  const availableSizes = selectedVariant?.sizes || [];

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

  //   form hydration / initial values
  const hydrateForm = (product: any) => {
    const seriesSet = new Set<number>();
    const categorySet = new Set<number>();
    const subCategoryIds: number[] = [];

    product.subCategories.forEach((psc: any) => {
      const sub = psc.subCategory;
      subCategoryIds.push(sub.id);

      if (sub.category) {
        categorySet.add(sub.category.id);

        if (sub.category.series) {
          seriesSet.add(sub.category.series.id);
        }
      }
    });

    // Get variant from first color's first size
    const variantId = product?.colors[0]?.sizes[0]?.size?.variantId || null;

    // BASIC DATA
    setFormData({
      title: product.title,
      slug: product.slug,
      sku: product.sku || "",
      basePrice: product.basePrice,
      description: product.description || "",
      hasColorVariants: product.hasColorVariants,
      showColor: product.showColor,
      discountType: product.discountType,
      discount: product.discount || 0,
      discountStart: product.discountStart?.split("T")[0] || "",
      discountEnd: product.discountEnd?.split("T")[0] || "",

      selectedSeriesIds: Array.from(seriesSet),
      selectedCategoryIds: Array.from(categorySet),
      selectedSubCategoryIds: subCategoryIds,

      selectedColors: product.colors?.map((c: any) => c.colorId) || [],
      variantId: variantId, // This was already set above
      note: product.note || "",
      deliveryEstimate: product.deliveryEstimate || "",
      productDetails: product.productDetails || "",
      dimension: product.dimension || "",
      shippingReturn: product.shippingReturn || "",
      isActive: product.isActive,
    });

    // DEFAULT IMAGES
    setDefaultImages(
      product.images.map((img: any) => ({
        id: img.id,
        preview: img.image,
        serialNo: img.serialNo,
        file: null,
      }))
    );

    // COLOR IMAGES + SIZES
    const colorImgs: Record<number, any[]> = {};
    const colorSizes: Record<number, any[]> = {};
    const useDefault: Record<number, boolean> = {};

    product.colors.forEach((c: any) => {
      // Use the value from DB, default to true only if undefined
      useDefault[c.colorId] = c.useDefaultImages ?? true;

      colorImgs[c.colorId] =
        c.images?.map((img: any) => ({
          id: img.id,
          preview: img.image,
          file: null,
        })) || [];

      // price initialization:
      colorSizes[c.colorId] =
        c.sizes?.map((s: any) => ({
          sizeId: s.sizeId,
          sku: s.sku || "",
          price: s.price || product.basePrice,
          quantity: s.quantity || 0,
        })) || [];
    });

    setColorUseDefault(useDefault);
    setColorImages(colorImgs);
    setSizeSelections(colorSizes); // This sets the actual size data
  };

  // colorwise size fetch
  useEffect(() => {
    // Skip during hydration
    if (loading || isHydrating.current) return;

    if (selectedVariant && formData.selectedColors.length > 0) {
      setSizeSelections((prev) => {
        const newSizeSelections = { ...prev };
        let hasChanges = false;

        formData.selectedColors.forEach((colorId) => {
          const existingSizes = newSizeSelections[colorId] || [];
          const existingSizeIds = existingSizes.map((s) => s.sizeId);

          //  if variant has new sizes that aren't in existing data
          const newSizesNeeded = availableSizes.filter(
            (size) => !existingSizeIds.includes(size.id)
          );

          if (!newSizeSelections[colorId]) {
            // First time - initialize all sizes
            newSizeSelections[colorId] = availableSizes.map((size) => ({
              sizeId: size.id,
              sku: "",
              price: formData.basePrice || undefined,
              quantity: 0,
            }));
            hasChanges = true;
          } else if (newSizesNeeded.length > 0) {
            // Variant changed - add only NEW sizes, keep existing ones
            newSizeSelections[colorId] = [
              ...existingSizes,
              ...newSizesNeeded.map((size) => ({
                sizeId: size.id,
                sku: "",
                price: formData.basePrice || undefined,
                quantity: 0,
              })),
            ];
            hasChanges = true;
          }
        });

        return hasChanges ? newSizeSelections : prev;
      });
    }
  }, [formData.selectedColors, selectedVariant, formData.variantId, loading]);

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

  // handle category toggle
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

  // handleColorToggle function
  const handleColorToggle = (colorId: number) => {
    const isCurrentlySelected = formData.selectedColors.includes(colorId);

    if (isCurrentlySelected) {
      // Remove color - but DON'T delete size data
      setFormData((prev) => ({
        ...prev,
        selectedColors: prev.selectedColors.filter((id) => id !== colorId),
      }));
    } else {
      // Add color - only initialize sizes if they don't exist
      setFormData((prev) => ({
        ...prev,
        selectedColors: [...prev.selectedColors, colorId],
      }));

      // Initialize sizes if this color has no size data yet
      if (!sizeSelections[colorId] && selectedVariant?.sizes) {
        setSizeSelections((prev) => ({
          ...prev,
          [colorId]: (selectedVariant.sizes || []).map((size) => ({
            sizeId: size.id,
            sku: "",
            price: formData.basePrice || undefined,
            quantity: 0,
          })),
        }));
      }

      // Initialize images if needed
      if (!colorImages[colorId]) {
        setColorImages((prev) => ({ ...prev, [colorId]: [] }));
        setColorUseDefault((prev) => ({ ...prev, [colorId]: true }));
      }
    }
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

  // Size handlers
  const handleSizeFieldChange = (
    colorId: number,
    sizeId: number,
    field: keyof SizeDetail,
    value: string | number
  ) => {
    setSizeSelections((prev) => {
      const newSelections = { ...prev };
      if (newSelections[colorId]) {
        const sizeIndex = newSelections[colorId].findIndex(
          (s) => s.sizeId === sizeId
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

  // Get category/subcategory info for display
  const getSeriesName = (id: number) =>
    seriesList.find((s) => s.id === id)?.name || "";
  const getCategoryName = (id: number) =>
    categoryList.find((c) => c.id === id)?.name || "";
  const getSubCategoryName = (id: number) =>
    subCategoryList.find((sc) => sc.id === id)?.name || "";

  const uploadIfNew = async (img: any) => {
    if (!img.file) return img.preview;
    return await handleUploadWithCloudinary(img.file);
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

  const discountedPrice = useMemo(() => {
    if (formData.discount <= 0) return formData.basePrice;

    if (formData.discountType === "PERCENT") {
      return formData.basePrice * (1 - formData.discount / 100);
    } else {
      return Math.max(0, formData.basePrice - formData.discount);
    }
  }, [formData.basePrice, formData.discount, formData.discountType]);

  // update handling
  // Update the handleUpdate function:
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setIsLoading(true);

      // Upload default images
      const defaultImageUrls = await Promise.all(
        defaultImages.map(async (img) => ({
          image: await uploadIfNew(img),
          serialNo: img.serialNo,
        }))
      );

      console.log(sizeSelections, "sizeSelections");

      // Prepare colors with proper size data
      const colorVariants = await Promise.all(
        formData.selectedColors.map(async (colorId) => {
          const images = colorUseDefault[colorId]
            ? []
            : await Promise.all((colorImages[colorId] || []).map(uploadIfNew));

          // Get sizes for this color, ensuring all required fields are present
          const sizes = (sizeSelections[colorId] || [])
            .filter((s) => s.sku != "")
            .map((size) => ({
              sizeId: size.sizeId,
              sku: size.sku || "",
              price: size.price || formData.basePrice,
              quantity: size.quantity,
            }));

          return {
            colorId,
            useDefaultImages: colorUseDefault[colorId],
            images,
            sizes,
          };
        })
      );

      const payload = {
        ...formData,
        discountStart: formData.discountStart
          ? new Date(formData.discountStart)
          : null,
        discountEnd: formData.discountEnd
          ? new Date(formData.discountEnd)
          : null,
        images: defaultImageUrls,
        colors: colorVariants,
        subCategories: formData.selectedSubCategoryIds,
      };

      console.log("Update payload:", payload);

      await axiosSecure.patch(`/product/${productId}`, payload);

      toast.success("Product updated successfully");
      // router.push("/admin/products");
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            <LoadingDots></LoadingDots>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Update Product"
          subtitle="Edit existing product details"
          backLink="/admin/products"
        />

        <form onSubmit={handleUpdate} className="space-y-6">
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
              {/* Discount Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Type
                </label>
                <select
                  value={formData.discountType}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      discountType: e.target.value as "PERCENT" | "FIXED",
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PERCENT">Percentage (%)</option>
                  <option value="FIXED">Fixed Amount</option>
                </select>
              </div>

              {/* Discount Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.discountType === "PERCENT"
                    ? "Discount (%)"
                    : "Discount Amount"}
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
                  placeholder={
                    formData.discountType === "PERCENT" ? "0 - 100" : "0.00"
                  }
                  min="0"
                  max={formData.discountType === "PERCENT" ? 100 : undefined}
                  step="0.01"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Final Price Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Final Price
                </label>
                <input
                  type="text"
                  value={`$${discountedPrice.toFixed(2)}`}
                  disabled
                  className="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-700"
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

          {/* variant and sizes  */}
          <FormSection
            title="Variant & Sizes"
            description="Select variant type and manage sizes for each color"
          >
            <div className="space-y-5">
              {/* variant  */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Variant Type *
                </label>
                {/* In the variant dropdown onChange handler: */}
                <select
                  value={formData.variantId || ""}
                  onChange={(e) => {
                    const newVariantId = e.target.value
                      ? Number(e.target.value)
                      : null;
                    const newVariant = variants.find(
                      (v) => v.id === newVariantId
                    );

                    setFormData((prev) => ({
                      ...prev,
                      variantId: newVariantId,
                    }));

                    // Update sizes for all selected colors to include new sizes from variant
                    if (newVariant?.sizes) {
                      setSizeSelections((prev) => {
                        const updated = { ...prev };
                        let hasChanges = false;

                        formData.selectedColors.forEach((colorId) => {
                          const existingSizes = updated[colorId] || [];
                          const existingSizeIds = new Set(
                            existingSizes.map((s) => s.sizeId)
                          );

                          // Add new sizes that don't exist yet
                          const newSizes = newVariant.sizes.filter(
                            (size) => !existingSizeIds.has(size.id)
                          );

                          if (newSizes.length > 0) {
                            updated[colorId] = [
                              ...existingSizes,
                              ...newSizes.map((size) => ({
                                sizeId: size.id,
                                sku: "",
                                price: formData.basePrice || undefined,
                                quantity: 0,
                              })),
                            ];
                            hasChanges = true;
                          }
                        });

                        return hasChanges ? updated : prev;
                      });
                    }
                  }}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
     focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={variantsLoading}
                  required={formData.hasColorVariants}
                >
                  <option value="">-- Select Variant --</option>
                  {variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Variant & Sizes section JSX */}
              {formData.variantId && formData.selectedColors.length > 0 && (
                <div className="space-y-6">
                  <h4 className="text-sm font-medium text-gray-700">
                    Size Management per Color
                  </h4>
                  {formData.selectedColors.map((colorId) => {
                    const color = colors.find((c) => c.id === colorId);
                    const colorSizes = sizeSelections[colorId] || [];

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
                            {colorSizes.map((sizeDetail, index) => {
                              const size = availableSizes.find(
                                (s) => s.id === sizeDetail.sizeId
                              );

                              return (
                                <div
                                  key={sizeDetail.sizeId}
                                  className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center"
                                >
                                  <div className="col-span-1">
                                    <span className="text-sm font-medium">
                                      {size?.name ||
                                        `Size ${sizeDetail.sizeId}`}
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
                                          e.target.value
                                        )
                                      }
                                      className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm"
                                    />
                                  </div>

                                  <div className="col-span-1">
                                    <input
                                      type="number"
                                      placeholder="Price"
                                      value={
                                        sizeDetail.price || formData.basePrice
                                      }
                                      onChange={(e) =>
                                        handleSizeFieldChange(
                                          colorId,
                                          sizeDetail.sizeId,
                                          "price",
                                          e.target.value
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
                                      value={sizeDetail.quantity || 0}
                                      onChange={(e) =>
                                        handleSizeFieldChange(
                                          colorId,
                                          sizeDetail.sizeId,
                                          "quantity",
                                          e.target.value
                                        )
                                      }
                                      min="0"
                                      className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm"
                                    />
                                  </div>

                                  <div className="col-span-1 text-sm text-gray-500">
                                    {sizeDetail.price
                                      ? `$${Number(sizeDetail.price).toFixed(
                                          2
                                        )}`
                                      : `$${formData.basePrice.toFixed(2)}`}
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
            {/* submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-md
   bg-blue-600 text-white hover:bg-blue-700 transition
   disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isLoading ? "Updating..." : "Update Product"}{" "}
              {/* Changed here */}
            </button>
          </div>
        </form>
        <GotoArrows></GotoArrows>
      </div>
    </div>
  );
};

export default UpdateProductPage;
