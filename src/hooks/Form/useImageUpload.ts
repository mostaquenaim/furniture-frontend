import { IMAGE_SPECS } from "@/utils/imageDimensions";
import { useState } from "react";
import { handleUploadWithCloudinary } from "@/data/handleUploadWithCloudinary";
import { ProductImageItem } from "@/component/admin/Product/ImageUploader";

export const useImageUpload = () => {
  const [defaultImages, setDefaultImages] = useState<ProductImageItem[]>([]);

  const uploadIfNew = async (img: ProductImageItem): Promise<string> => {
    if (!img.file) return img.preview as string;
    return await handleUploadWithCloudinary(img.file, IMAGE_SPECS.product);
  };

  const uploadMultipleImages = async (images: ProductImageItem[]) => {
    return await Promise.all(images.map(uploadIfNew));
  };

  return {
    defaultImages,
    setDefaultImages,
    uploadIfNew,
    uploadMultipleImages,
  };
};