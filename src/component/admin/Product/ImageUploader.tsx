/* eslint-disable @next/next/no-img-element */
import React, { useState, useCallback } from "react";
import {
  Upload,
  X,
  GripVertical,
  Plus,
  Copy,
  Image as ImageIcon,
} from "lucide-react";
import { Color } from "@/hooks/useFetchColors";
import { optimizeImage, formatFileSize } from "@/utils/imageOptimizer";
import toast from "react-hot-toast";

export interface ProductImageItem {
  id: string;
  file: File | null;
  preview: string;
  colorId: number | null; // null for default images
  serialNo: number;
  originalSize?: number;
  optimizedSize?: number;
}

interface DefaultImageUploaderProps {
  images: ProductImageItem[];
  onImagesChange: (images: ProductImageItem[]) => void;
}

export const DefaultImageUploader: React.FC<DefaultImageUploaderProps> = ({
  images,
  onImagesChange,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsOptimizing(true);

    try {
      const newImages: ProductImageItem[] = await Promise.all(
        Array.from(files).map(async (file, index) => {
          const originalSize = file.size;
          const optimizedFile = await optimizeImage(file);
          const optimizedSize = optimizedFile.size;

          return {
            id: `default-${Date.now()}-${index}`,
            file: optimizedFile,
            preview: URL.createObjectURL(optimizedFile),
            colorId: null,
            serialNo: images.length + index + 1,
            originalSize,
            optimizedSize,
          };
        })
      );

      onImagesChange([...images, ...newImages]);
      toast.success(`${newImages.length} image(s) optimized and added`);
    } catch (error) {
      toast.error("Failed to optimize images");
    } finally {
      setIsOptimizing(false);
      e.target.value = "";
    }
  };

  const removeImage = (imageId: string) => {
    const updated = images
      .filter((img) => img.id !== imageId)
      .map((img, idx) => ({ ...img, serialNo: idx + 1 }));
    onImagesChange(updated);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);

    const reordered = newImages.map((img, idx) => ({
      ...img,
      serialNo: idx + 1,
    }));
    onImagesChange(reordered);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="border border-border rounded-lg p-4 bg-muted/30">
      <div className="flex items-center gap-3 mb-4">
        <ImageIcon className="w-5 h-5 text-primary" />
        <span className="font-medium text-foreground">
          Default Product Images
        </span>
        <span className="text-sm text-muted-foreground">
          ({images.length} {images.length === 1 ? "image" : "images"})
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {images.map((image, index) => (
          <div
            key={image.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`group relative aspect-square rounded-lg overflow-hidden border-2 border-border bg-background cursor-move ${
              draggedIndex === index ? "opacity-50" : ""
            }`}
          >
            <img
              src={image.preview}
              alt={`Product ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm rounded p-1">
              <GripVertical className="w-4 h-4 text-foreground" />
            </div>
            <button
              type="button"
              onClick={() => removeImage(image.id)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm rounded px-2 py-0.5 text-xs font-medium">
              #{image.serialNo}
            </div>
            {image.originalSize && image.optimizedSize && (
              <div className="absolute bottom-2 right-2 bg-green-500/90 backdrop-blur-sm rounded px-1.5 py-0.5 text-xs text-white">
                {Math.round(
                  (1 - image.optimizedSize / image.originalSize) * 100
                )}
                % smaller
              </div>
            )}
          </div>
        ))}

        <label
          className={`aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-accent/50 transition-all ${
            isOptimizing ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          {isOptimizing ? (
            <div className="text-xs text-muted-foreground">Optimizing...</div>
          ) : (
            <>
              <Plus className="w-6 h-6 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground">Add Images</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            disabled={isOptimizing}
          />
        </label>
      </div>
    </div>
  );
};

interface ColorImageUploaderProps {
  colorId: number;
  color: Color;
  images: ProductImageItem[];
  defaultImages: ProductImageItem[];
  useDefault: boolean;
  onImagesChange: (colorId: number, images: ProductImageItem[]) => void;
  onUseDefaultChange: (colorId: number, useDefault: boolean) => void;
}

export const ColorImageUploader: React.FC<ColorImageUploaderProps> = ({
  colorId,
  color,
  images,
  defaultImages,
  useDefault,
  onImagesChange,
  onUseDefaultChange,
}) => {
  // console.log(images,'colorimages');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const displayImages = useDefault ? defaultImages : images;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsOptimizing(true);

    try {
      const newImages: ProductImageItem[] = await Promise.all(
        Array.from(files).map(async (file, index) => {
          const originalSize = file.size;
          const optimizedFile = await optimizeImage(file);
          const optimizedSize = optimizedFile.size;

          // console.log(colorId);

          return {
            id: `${colorId}-${Date.now()}-${index}`,
            file: optimizedFile,
            preview: URL.createObjectURL(optimizedFile),
            colorId,
            serialNo: images.length + index + 1,
            originalSize,
            optimizedSize,
          };
        })
      );

      onImagesChange(colorId, [...images, ...newImages]);
      toast.success(`${newImages.length} image(s) optimized and added`);
    } catch (error) {
      toast.error("Failed to optimize images");
    } finally {
      setIsOptimizing(false);
      e.target.value = "";
    }
  };

  const removeImage = (imageId: string) => {
    const updated = images
      .filter((img) => img.id !== imageId)
      .map((img, idx) => ({ ...img, serialNo: idx + 1 }));
    onImagesChange(colorId, updated);
  };

  const handleDragStart = (index: number) => {
    if (useDefault) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (useDefault) return;
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);

    const reordered = newImages.map((img, idx) => ({
      ...img,
      serialNo: idx + 1,
    }));
    onImagesChange(colorId, reordered);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const copyFromDefault = () => {
    const copiedImages = defaultImages.map((img, index) => ({
      ...img,
      id: `${colorId}-copy-${Date.now()}-${index}`,
      colorId,
      serialNo: index + 1,
    }));
    onImagesChange(colorId, copiedImages);
    onUseDefaultChange(colorId, false);
    toast.success("Copied images from default");
  };

  return (
    <div className="border border-border rounded-lg p-4 bg-muted/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-6 h-6 rounded-full border-2 border-border shadow-sm"
            style={{ backgroundColor: color.hexCode }}
          />
          <span className="font-medium text-foreground">{color.name}</span>
          <span className="text-sm text-muted-foreground">
            ({displayImages.length}{" "}
            {displayImages.length === 1 ? "image" : "images"})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!useDefault && defaultImages.length > 0 && (
            <button
              type="button"
              onClick={copyFromDefault}
              className="text-xs px-2 py-1 bg-muted hover:bg-muted/80 rounded flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              Copy Default
            </button>
          )}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={useDefault}
              onChange={(e) => onUseDefaultChange(colorId, e.target.checked)}
              className="w-4 h-4 rounded border-border"
            />
            <span className="text-muted-foreground">Use default images</span>
          </label>
        </div>
      </div>

      {useDefault ? (
        <div className="text-sm text-muted-foreground italic p-4 border border-dashed border-border rounded-lg text-center">
          Using {defaultImages.length} default image(s). Uncheck to upload
          color-specific images.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {images.map((image, index) => (
            <div
              key={image.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`group relative aspect-square rounded-lg overflow-hidden border-2 border-border bg-background cursor-move ${
                draggedIndex === index ? "opacity-50" : ""
              }`}
            >
              <img
                src={image.preview}
                alt={`${color.name} ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm rounded p-1">
                <GripVertical className="w-4 h-4 text-foreground" />
              </div>
              <button
                type="button"
                onClick={() => removeImage(image.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm rounded px-2 py-0.5 text-xs font-medium">
                #{image.serialNo}
              </div>
            </div>
          ))}

          <label
            className={`aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-accent/50 transition-all ${
              isOptimizing ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {isOptimizing ? (
              <div className="text-xs text-muted-foreground">Optimizing...</div>
            ) : (
              <>
                <Plus className="w-6 h-6 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Add</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              disabled={isOptimizing}
            />
          </label>
        </div>
      )}
    </div>
  );
};
