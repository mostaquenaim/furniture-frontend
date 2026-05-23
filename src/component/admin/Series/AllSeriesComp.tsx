"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import useFetchSeries from "@/hooks/Categories/Series/useFetchSeries";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import { GenericReorderTable } from "../GenericReorderTable";
import LoadingDots from "@/component/Loading/LoadingDS";
import { FullScreenCenter } from "@/component/Screen/FullScreenCenter";
import { Series } from "@/types/menu";

const PinnedRow = ({
  series,
  position,
}: {
  series: Series;
  position: "first" | "last";
}) => (
  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-dashed border-gray-300 rounded-lg opacity-70">
    <span className="text-gray-400 text-xs font-mono select-none">⚲</span>
    <span className="text-sm font-medium text-gray-600">{series.name}</span>
    <span className="ml-auto text-xs text-gray-400 italic">
      Always {position} — cannot reorder
    </span>
  </div>
);

const AllSeriesComp = () => {
  const router = useRouter();
  const axiosSecure = useAxiosSecure();
  const { seriesList, isLoading } = useFetchSeries({ isActive: null });
  const [isSaving, setIsSaving] = useState(false);

  // Separate pinned series from normal ones
  const pinnedFirst = (seriesList || []).filter((s) => s.seriesType === "NEW");
  const pinnedLast = (seriesList || []).filter((s) => s.seriesType === "SALE");
  const normalSeries = (seriesList || []).filter(
    (s) => s.seriesType !== "NEW" && s.seriesType !== "SALE",
  );

  const handleSave = async (payload: { id: number | string; sortOrder: number }[]) => {
    setIsSaving(true);
    try {
      await axiosSecure.patch("/series/reorder", { orders: payload });
      toast.success("Series order updated");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading)
    return (
      <FullScreenCenter>
        <LoadingDots />
      </FullScreenCenter>
    );

  return (
    <div className="space-y-3">
      {pinnedFirst.map((s) => (
        <PinnedRow key={s.id} series={s} position="first" />
      ))}

      <GenericReorderTable
        title="Product Series"
        description="Manage the appearance order of your furniture collections."
        initialData={normalSeries}
        isSaving={isSaving}
        onSave={handleSave}
        onEdit={(slug) => router.push(`/admin/series/update/${slug}`)}
      />

      {pinnedLast.map((s) => (
        <PinnedRow key={s.id} series={s} position="last" />
      ))}
    </div>
  );
};

export default AllSeriesComp;
