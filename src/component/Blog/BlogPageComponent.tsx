/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { Clock, Tag, ChevronLeft } from "lucide-react";
import Link from "next/link";
import ShowProductsFlex from "../ProductDisplay/ShowProductsFlex";
import LoadingDots from "../Loading/LoadingDS";
import { BlogPost } from "@/types/blog";
import Title from "../Headers/Title";

// Mock Data Fallback
const MOCK_POST = {
  title: "Gifts for Health and Wellness Lovers",
  content:
    "# Self Care Essentials\n\nFeel your best - inside & out - with these tips.\n\n## Why Wellness Matters\nInvesting in yourself isn't selfish; it's essential for longevity and happiness.",
  image: "https://images.urbndata.com/is/image/Anthropologie/86403562_000_b",
  createdAt: new Date().toISOString(),
  category: { name: "Beauty & Wellness" },
  subCategories: [
    { subCategory: { name: "Skincare" } },
    { subCategory: { name: "Gift Guides" } },
  ],
};

// Markdown Parser (Refined for Anthropologie styling)
const parseMarkdown = (text: string) => {
  let html = text;
  html = html.replace(
    /^# (.*$)/gim,
    '<h1 class="text-3xl font-light mb-6">$1</h1>',
  );
  html = html.replace(
    /^## (.*$)/gim,
    '<h2 class="text-2xl font-light mt-10 mb-4">$1</h2>',
  );
  html = html.replace(
    /\*\*(.+?)\*\*/g,
    '<strong class="font-bold text-gray-900">$1</strong>',
  );
  return html
    .split("\n\n")
    ?.map(
      (p) =>
        `<p class="mb-6 font-serif leading-relaxed text-gray-700 text-lg">${p}</p>`,
    )
    .join("");
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  console.log(slug);

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    async function getPostData() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/details/${slug}`,
          { next: { revalidate: 60 } },
        );
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setPost(data);
        setLoading(false);
      } catch (error) {
        console.error("Using mock data due to error:", error);
        console.log(MOCK_POST, "MOCK_POST");
        setPost(MOCK_POST);
        setLoading(false);
      }
    }
    getPostData();
  }, [slug]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen w-full">
        <LoadingDots />
      </div>
    );

  if (!post) return notFound();

  return (
    <div>
      <article className="min-h-screen bg-[#f9f7f2] selection:bg-teal-50">
        {/* Navigation */}
        <nav className="max-w-4xl mx-auto px-6 pt-10">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-gray-800 transition"
          >
            <ChevronLeft className="w-3 h-3" /> Back to Stories
          </Link>
        </nav>

        {/* Header Section */}
        <header className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="flex items-center justify-center gap-2 text-[#b2965d] uppercase tracking-[0.3em] text-[10px] mb-8">
            <span className="border-b border-[#b2965d] w-4"></span>
            <span>
              stories:{" "}
              <span className="italic lowercase font-normal">
                {post.category.name}
              </span>
            </span>
            <span className="border-b border-[#b2965d] w-4"></span>
          </div>

          <h1 className="text-4xl md:text-6xl font-light text-gray-900 leading-[1.1] mb-8 tracking-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-center gap-8 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-sans">
            <span className="flex items-center gap-2">
              <Clock className="w-3 h-3" />{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-2">
              <Tag className="w-3 h-3" /> {post.category.name}
            </span>
          </div>
        </header>

        {/* Hero Image */}
        {post.image && (
          <div className="max-w-6xl mx-auto px-4 md:px-10 mb-20">
            <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-6 pb-24">
          <div
            className="prose-custom"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }}
          />

          {/* Dynamic Tags from SubCategoryBlogs Relation */}
          <footer className="mt-20 pt-10 border-t border-gray-200">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-6">
              Explore More
            </h4>
            <div className="flex flex-wrap gap-3">
              {post.subCategories?.map((item: any, idx: number) => (
                <span
                  key={idx}
                  className="text-sm italic text-gray-600 hover:text-teal-700 cursor-pointer"
                >
                  #{item.subCategory.name.replace(/\s+/g, "")}
                </span>
              ))}
            </div>
          </footer>
        </div>

        {/* show flex products  */}
        <div className="max-w-7xl mx-auto px-6">
          <Title title="" />
          <ShowProductsFlex />
        </div>
      </article>
    </div>
  );
}
