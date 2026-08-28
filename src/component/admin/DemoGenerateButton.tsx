"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Sparkles } from "lucide-react";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";

const IS_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

type DemoEntity = "product" | "category" | "blog-post" | "coupon";

const ENTITY_LABELS: Record<DemoEntity, string> = {
  product: "Product",
  category: "Category",
  "blog-post": "Blog Post",
  coupon: "Coupon",
};

interface DemoGenerateButtonProps {
  entity: DemoEntity;
  onGenerated?: () => void;
}

// Demo/dev only — lets a recruiter/reviewer populate the admin panel with
// realistic fake data without hand-filling forms. Backend guard
// (DemoModeGuard) independently refuses this outside demo/dev, so hiding the
// button here is a UX nicety, not the actual security boundary.
export default function DemoGenerateButton({
  entity,
  onGenerated,
}: DemoGenerateButtonProps) {
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  if (!IS_DEMO_MODE) return null;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await axiosSecure.post(`/demo/generate/${entity}`);
      toast.success(`Random ${ENTITY_LABELS[entity]} generated`);
      onGenerated?.();
    } catch {
      toast.error(`Failed to generate a random ${ENTITY_LABELS[entity]}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGenerate}
      disabled={loading}
      className="flex items-center gap-2 px-3 py-2 text-sm bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md disabled:opacity-50"
    >
      <Sparkles className={`w-4 h-4 ${loading ? "animate-pulse" : ""}`} />
      {loading ? "Generating..." : `Generate Random ${ENTITY_LABELS[entity]}`}
    </button>
  );
}
