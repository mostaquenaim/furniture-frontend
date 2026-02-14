/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import useFetchSeries from "@/hooks/Categories/Series/useFetchSeries";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import { GenericReorderTable } from "../GenericReorderTable";
import LoadingDots from "@/component/Loading/LoadingDS";

const AllSeriesComp = () => {
  const router = useRouter();
  const axiosSecure = useAxiosSecure();
  const { seriesList, isLoading } = useFetchSeries({ isActive: null });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (payload: any) => {
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
      <div>
        <LoadingDots />
      </div>
    );

  return (
    <GenericReorderTable
      title="Product Series"
      description="Manage the appearance order of your furniture collections."
      initialData={seriesList || []}
      isSaving={isSaving}
      onSave={handleSave}
      onEdit={(slug) => router.push(`/admin/series/update/${slug}`)}
    />
  );
};

export default AllSeriesComp;
