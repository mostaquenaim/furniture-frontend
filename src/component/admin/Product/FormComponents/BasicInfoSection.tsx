import React, { Dispatch, SetStateAction } from "react";
import { FormSection } from "../FormSection";
import { ProductFormData } from "../ProductForm";

const BasicInfoSection = (
    {
        formData,
        setFormData,
        generateSlug,
        handleNameChange
    }:{
        formData: ProductFormData;
        setFormData: Dispatch<SetStateAction<ProductFormData>>;
        generateSlug: (title: string) => string;
        handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }
) => {
  return (
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>
    </FormSection>
  );
};

export default BasicInfoSection;
