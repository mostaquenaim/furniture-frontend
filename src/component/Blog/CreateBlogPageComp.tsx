/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  FormEvent,
} from "react";
import { Save, X, ImageIcon } from "lucide-react";
import { PageHeader } from "../PageHeader/PageHeader";
import { FormSection } from "../admin/Product/FormSection";
import useFetchSeries from "@/hooks/Categories/useFetchSeries";
import useFetchCategoriesBySeriesIds from "@/hooks/Categories/useFetchCategoriesBySeriesIds";
import useFetchSubCategoriesByCategoryIds from "@/hooks/Categories/useFetchSubCategoriesByCategoryIds";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { handleUploadWithCloudinary } from "@/data/handleUploadWithCloudinary";
import { optimizeImage } from "@/utils/imageOptimizer";
import useFetchBlogCategories from "@/hooks/Blog/useFetchBlogCategories";
import { generateSlug } from "@/utils/generateSlug";

interface ImageResponse {
  image: File | null; // Expect a File object
  onImageChange: (file: File | null) => void;
}

type BlogCategoryOption = {
  id: number;
  name: string;
  slug: string;
};

// Image uploader component
const ImageUploader: React.FC<ImageResponse> = ({ image, onImageChange }) => {
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (image instanceof File) {
      const objectUrl = URL.createObjectURL(image);
      setPreview(objectUrl);
      // Clean up memory when component unmounts or image changes
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview("");
    }
  }, [image]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file); // Pass the File object up
    }
  };

  const handleRemove = () => {
    onImageChange(null);
  };

  return (
    <div className="space-y-3">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={() => {
              setPreview("");
              onImageChange(null);
            }}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-sm text-gray-600">Click to upload image</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
  );
};

export default function CreateBlogPage() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    blogCategories,
    isLoading: isBlogLoading,
    refetch,
  } = useFetchBlogCategories();
  const [selectedBlogCategoryId, setSelectedBlogCategoryId] = useState<
    number | null
  >(null);

  // modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");
  const [newCategoryOrder, setNewCategoryOrder] = useState(0);
  const [newCategoryIsActive, setNewCategoryIsActive] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    image: null as File | null,
    published: false,
    blogCategoryId: null as number | null,
    // Using arrays to satisfy the Many-to-Many schema requirement
    selectedSeriesIds: [] as number[],
    selectedCategoryIds: [] as number[],
    selectedSubCategoryIds: [] as number[],
  });

  const [submitting, setSubmitting] = useState(false);

  // Custom Hooks for fetching data
  const { seriesList } = useFetchSeries();
  const { categoryList } = useFetchCategoriesBySeriesIds(
    formData.selectedSeriesIds,
  );
  const { subCategoryList } = useFetchSubCategoriesByCategoryIds(
    formData.selectedCategoryIds,
  );

  const [loading, setLoading] = useState({
    series: false,
    categories: false,
    subCategories: false,
    submit: false,
  });

  const axiosSecure = useAxiosSecure();

  // Markdown helper functions
  const insertMarkdown = (
    prefix: string,
    suffix: string,
    placeholder: string,
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    const textToInsert = selectedText || placeholder;
    const before = formData.content.substring(0, start);
    const after = formData.content.substring(end);
    setFormData((prev) => ({
      ...prev,
      content: `${before}${prefix}${textToInsert}${suffix}${after}`,
    }));
  };

  // Simple markdown to HTML renderer
  const renderMarkdown = (text: string) => {
    let html = text;

    // Escape HTML
    html = html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Headers
    html = html.replace(
      /^### (.*$)/gim,
      '<h3 class="text-lg font-bold mt-6 mb-3">$1</h3>',
    );
    html = html.replace(
      /^## (.*$)/gim,
      '<h2 class="text-xl font-bold mt-8 mb-4">$1</h2>',
    );
    html = html.replace(
      /^# (.*$)/gim,
      '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>',
    );

    // Bold
    html = html.replace(
      /\*\*(.+?)\*\*/g,
      '<strong class="font-bold">$1</strong>',
    );

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');

    // Inline code
    html = html.replace(
      /`(.+?)`/g,
      '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>',
    );

    // Links
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-blue-600 hover:underline">$1</a>',
    );

    // Blockquotes
    html = html.replace(
      /^&gt; (.*$)/gim,
      '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4">$1</blockquote>',
    );

    // Horizontal rules
    html = html.replace(
      /^---$/gim,
      '<hr class="my-6 border-t border-gray-300" />',
    );

    // Unordered lists
    html = html.replace(/^\- (.+)$/gim, '<li class="ml-6 list-disc">$1</li>');
    html = html.replace(
      /(<li class="ml-6 list-disc">.*<\/li>)/,
      '<ul class="my-3">$1</ul>',
    );

    // Ordered lists
    html = html.replace(
      /^\d+\. (.+)$/gim,
      '<li class="ml-6 list-decimal">$1</li>',
    );
    html = html.replace(
      /(<li class="ml-6 list-decimal">.*<\/li>)/,
      '<ol class="my-3">$1</ol>',
    );

    // Paragraphs
    html = html
      .split("\n\n")
      .map((para) => {
        if (para.trim() && !para.match(/^<(h[1-3]|ul|ol|blockquote|hr)/)) {
          return `<p class="mb-4 leading-relaxed">${para}</p>`;
        }
        return para;
      })
      .join("\n");

    return html;
  };

  // change blog title
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({ ...prev, title, slug: generateSlug(title) }));
  };

  // change blog category name
  const handleChangeCategoryName = (e: ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setNewCategoryName(title);
    setNewCategorySlug(generateSlug(title));
  };

  // handle submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error("Please upload an image");
      return;
    }

    setSubmitting(true);
    try {
      const optimizedFile = await optimizeImage(formData.image);

      const uploadedImageUrl = await handleUploadWithCloudinary(optimizedFile);

      const finalData = {
        ...formData,
        image: uploadedImageUrl, // Replace the File object with the URL string
      };

      const response = await axiosSecure.post("/blogs", finalData);
      toast.success("Blog post created successfully!");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(
          (err.response?.data as { message?: string })?.message ||
            "Failed to add blog",
        );
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to add blog");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Create Blog Post"
          subtitle="Link blogs to subcategories"
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          {" "}
          {/* Basic Information */}
          <FormSection title="Basic Information" description="Blog details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Title *</label>
                <input
                  className="border p-2 rounded text-sm"
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Slug</label>
                <input
                  className="border p-2 rounded text-sm bg-gray-50"
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      slug: generateSlug(e.target.value),
                    }))
                  }
                  required
                />
              </div>
            </div>
          </FormSection>
          {/* subCategory Selection */}
          <FormSection
            title="Product Association"
            description="Select linked subcategories"
          >
            <div className="space-y-6">
              {/* Series Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Series (select multiple)
                </label>
                {seriesList && seriesList.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {seriesList.map((s: any) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          const isSelected =
                            formData.selectedSeriesIds.includes(s.id);
                          if (isSelected) {
                            setFormData((prev) => ({
                              ...prev,
                              selectedSeriesIds: prev.selectedSeriesIds.filter(
                                (id) => id !== s.id,
                              ),
                              selectedCategoryIds: [],
                              selectedSubCategoryIds: [],
                            }));
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              selectedSeriesIds: [
                                ...prev.selectedSeriesIds,
                                s.id,
                              ],
                              selectedCategoryIds: [],
                              selectedSubCategoryIds: [],
                            }));
                          }
                        }}
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
                ) : (
                  <div className="text-muted-foreground text-sm">
                    No series available
                  </div>
                )}
              </div>

              {/* Categories Selection */}
              {formData.selectedSeriesIds.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categories (select multiple)
                  </label>
                  {categoryList && categoryList.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {categoryList.map((c: any) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            const isSelected =
                              formData.selectedCategoryIds.includes(c.id);
                            if (isSelected) {
                              setFormData((prev) => ({
                                ...prev,
                                selectedCategoryIds:
                                  prev.selectedCategoryIds.filter(
                                    (id) => id !== c.id,
                                  ),
                                selectedSubCategoryIds:
                                  prev.selectedSubCategoryIds.filter(
                                    (subCatId) => {
                                      const subCat = subCategoryList?.find(
                                        (sc) => sc.id === subCatId,
                                      );
                                      return subCat?.categoryId !== c.id;
                                    },
                                  ),
                              }));
                            } else {
                              setFormData((prev) => ({
                                ...prev,
                                selectedCategoryIds: [
                                  ...prev.selectedCategoryIds,
                                  c.id,
                                ],
                                selectedSubCategoryIds:
                                  prev.selectedSubCategoryIds.filter(
                                    (subCatId) => {
                                      const subCat = subCategoryList?.find(
                                        (sc) => sc.id === subCatId,
                                      );
                                      return (
                                        !subCat || subCat.categoryId === c.id
                                      );
                                    },
                                  ),
                              }));
                            }
                          }}
                          className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                            formData.selectedCategoryIds.includes(c.id)
                              ? "border-blue-200 bg-blue-200 text-blue-200-foreground"
                              : "border-border hover:border-muted-foreground"
                          }`}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm">
                      No categories available for selected series
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
                  {subCategoryList && subCategoryList.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {subCategoryList.map((sc: any) => (
                        <button
                          key={sc.id}
                          type="button"
                          onClick={() => {
                            const isSelected =
                              formData.selectedSubCategoryIds.includes(sc.id);
                            if (isSelected) {
                              setFormData((prev) => ({
                                ...prev,
                                selectedSubCategoryIds:
                                  prev.selectedSubCategoryIds.filter(
                                    (id) => id !== sc.id,
                                  ),
                              }));
                            } else {
                              setFormData((prev) => ({
                                ...prev,
                                selectedSubCategoryIds: [
                                  ...prev.selectedSubCategoryIds,
                                  sc.id,
                                ],
                              }));
                            }
                          }}
                          className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                            formData.selectedSubCategoryIds.includes(sc.id)
                              ? "border-blue-200 bg-blue-200 text-blue-200-foreground"
                              : "border-border hover:border-muted-foreground"
                          }`}
                        >
                          {sc.name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm">
                      No subcategories available for selected categories
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-3">
                    * Required. Click to select/deselect multiple subcategories
                  </p>
                </div>
              )}

              {/* Selected Subcategories Summary */}
              {formData.selectedSubCategoryIds.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Selected subcategories (
                    {formData.selectedSubCategoryIds.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedSubCategoryIds.map((id) => {
                      const sc = subCategoryList?.find((s: any) => s.id === id);
                      const cat = categoryList?.find(
                        (c: any) => c.id === sc?.categoryId,
                      );
                      const series = seriesList?.find(
                        (s: any) => s.id === cat?.seriesId,
                      );

                      return sc ? (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                        >
                          {series?.name} → {cat?.name} → {sc.name}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                selectedSubCategoryIds:
                                  prev.selectedSubCategoryIds.filter(
                                    (subId) => subId !== id,
                                  ),
                              }));
                            }}
                            className="hover:bg-blue-200 rounded-full p-0.5 transition"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>

                  {formData.selectedSubCategoryIds.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-blue-200">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            selectedSubCategoryIds: [],
                          }));
                        }}
                        className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        Clear all selected subcategories
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Selection Status Indicator */}
              <div className="text-sm text-gray-600">
                {formData.selectedSubCategoryIds.length > 0 ? (
                  <p className="text-green-600 font-medium">
                    ✓ {formData.selectedSubCategoryIds.length} subcategory(s)
                    selected
                  </p>
                ) : formData.selectedCategoryIds.length > 0 ? (
                  <p className="text-amber-600">
                    Select subcategories from the available options above
                  </p>
                ) : formData.selectedSeriesIds.length > 0 ? (
                  <p className="text-amber-600">
                    Select categories to see available subcategories
                  </p>
                ) : (
                  <p className="text-gray-500">
                    Start by selecting series above
                  </p>
                )}
              </div>
            </div>
          </FormSection>
          {/* Featured Image */}
          <FormSection title="Featured Image" description="Blog cover">
            <ImageUploader
              image={formData.image}
              onImageChange={(img) =>
                setFormData((p) => ({ ...p, image: img }))
              }
            />
          </FormSection>
          {/* blog categories */}
          <FormSection
            title="Blog Category"
            description="Select or create a blog category"
          >
            <div className="flex flex-col gap-3">
              <select
                className="w-full border p-2 rounded text-sm"
                value={formData.blogCategoryId ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    blogCategoryId: Number(e.target.value),
                  }))
                }
                required
              >
                <option value="" disabled>
                  Select a blog category
                </option>

                {blogCategories &&
                  blogCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>

              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(true)}
                className="self-start text-sm text-blue-600 hover:underline"
              >
                + Add new category
              </button>
            </div>
          </FormSection>
          {/* Content */}
          <FormSection
            title="Content"
            description="Write your blog post content with rich formatting"
          >
            <div className="space-y-4">
              {/* Toolbar */}
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => insertMarkdown("**", "**", "bold text")}
                  className="px-3 py-1.5 text-sm font-bold border border-gray-300 rounded hover:bg-white transition"
                  title="Bold"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("*", "*", "italic text")}
                  className="px-3 py-1.5 text-sm italic border border-gray-300 rounded hover:bg-white transition"
                  title="Italic"
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("# ", "", "Heading 1")}
                  className="px-3 py-1.5 text-sm font-semibold border border-gray-300 rounded hover:bg-white transition"
                  title="Heading 1"
                >
                  H1
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("## ", "", "Heading 2")}
                  className="px-3 py-1.5 text-sm font-semibold border border-gray-300 rounded hover:bg-white transition"
                  title="Heading 2"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("### ", "", "Heading 3")}
                  className="px-3 py-1.5 text-sm font-semibold border border-gray-300 rounded hover:bg-white transition"
                  title="Heading 3"
                >
                  H3
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <button
                  type="button"
                  onClick={() => insertMarkdown("- ", "", "List item")}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-white transition"
                  title="Bullet List"
                >
                  • List
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("1. ", "", "Numbered item")}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-white transition"
                  title="Numbered List"
                >
                  1. List
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("[", "](url)", "link text")}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-white transition"
                  title="Link"
                >
                  🔗 Link
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("`", "`", "code")}
                  className="px-3 py-1.5 text-sm font-mono border border-gray-300 rounded hover:bg-white transition"
                  title="Inline Code"
                >
                  {"</>"}
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("> ", "", "Quote text")}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-white transition"
                  title="Quote"
                >
                  " Quote
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <button
                  type="button"
                  onClick={() => insertMarkdown("---\n", "", "")}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-white transition"
                  title="Horizontal Rule"
                >
                  ―
                </button>
              </div>

              {/* Editor */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Markdown Editor *
                  </label>
                  <textarea
                    ref={textareaRef}
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    placeholder="Write your blog post using Markdown...

# Main Heading

Write your introduction here.

## Subheading

- Bullet point 1
- Bullet point 2

**Bold text** and *italic text*

> Blockquote for emphasis

[Link text](https://example.com)"
                    rows={20}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {formData.content.length} characters • Supports Markdown
                    formatting
                  </p>
                </div>

                {/* Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <div className="w-full h-[520px] rounded-md border border-gray-300 px-4 py-3 overflow-y-auto bg-white">
                    {formData.content ? (
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdown(formData.content),
                        }}
                      />
                    ) : (
                      <p className="text-gray-400 text-sm">
                        Preview will appear here...
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Guide */}
              <details className="text-sm">
                <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                  Markdown Quick Guide
                </summary>
                <div className="mt-3 p-4 bg-gray-50 rounded-lg grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="font-semibold mb-2">Text Formatting:</p>
                    <code className="block mb-1">**bold text**</code>
                    <code className="block mb-1">*italic text*</code>
                    <code className="block mb-1">`inline code`</code>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Headings:</p>
                    <code className="block mb-1"># Heading 1</code>
                    <code className="block mb-1">## Heading 2</code>
                    <code className="block mb-1">### Heading 3</code>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Lists:</p>
                    <code className="block mb-1">- Bullet item</code>
                    <code className="block mb-1">1. Numbered item</code>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Other:</p>
                    <code className="block mb-1">[Link](url)</code>
                    <code className="block mb-1"> Quote</code>
                    <code className="block mb-1">--- (divider)</code>
                  </div>
                </div>
              </details>
            </div>
          </FormSection>
          {/* Publish Status */}
          <FormSection title="Publishing">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    published: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded
                  focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="published"
                className="text-sm font-medium text-gray-700"
              >
                Publish immediately
              </label>
              <span className="text-xs text-gray-500">
                (Uncheck to save as draft)
              </span>
            </div>
          </FormSection>
          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md
                border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading.submit}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-md
                bg-blue-600 text-white hover:bg-blue-700 transition
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {loading.submit
                ? "Creating..."
                : formData.published
                  ? "Publish Post"
                  : "Save Draft"}
            </button>
          </div>
        </form>
      </div>
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm space-y-4">
            <h3 className="text-lg font-semibold">Add Blog Category</h3>

            {/* Name */}
            <input
              type="text"
              placeholder="Category name"
              value={newCategoryName}
              onChange={handleChangeCategoryName}
              className="w-full border p-2 rounded text-sm"
            />

            {/* Slug */}
            <input
              type="text"
              placeholder="Slug"
              value={newCategorySlug}
              onChange={(e) => setNewCategorySlug(e.target.value)}
              className="w-full border p-2 rounded text-sm"
            />

            {/* Order */}
            <input
              type="number"
              placeholder="Order (default 0)"
              value={newCategoryOrder}
              onChange={(e) => setNewCategoryOrder(Number(e.target.value))}
              className="w-full border p-2 rounded text-sm"
              min={0}
            />

            {/* IsActive */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newCategoryIsActive}
                onChange={(e) => setNewCategoryIsActive(e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-sm">Active</label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-3 py-1.5 border rounded text-sm"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={async () => {
                  try {
                    await axiosSecure.post("/blog-categories", {
                      name: newCategoryName,
                      slug: newCategorySlug || undefined,
                      order: newCategoryOrder ?? 0,
                      isActive: newCategoryIsActive,
                    });

                    await refetch();
                    setNewCategoryName("");
                    setNewCategorySlug("");
                    setNewCategoryOrder(0);
                    setNewCategoryIsActive(true);
                    setIsCategoryModalOpen(false);
                    toast.success("Category added");
                  } catch (err: unknown) {
                    if (axios.isAxiosError(err)) {
                      toast.error(
                        err?.response?.data?.message ||
                          "Failed to add category",
                      );
                    } else {
                      toast.error("Failed to add category");
                    }
                  }
                }}
                className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
