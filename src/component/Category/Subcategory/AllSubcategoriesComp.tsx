/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import toast from "react-hot-toast";
import { GenericReorderTable } from "../../admin/GenericReorderTable";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import { useRouter } from "next/navigation";
import LoadingDots from "@/component/Loading/LoadingDS";
import useFetchSubcategories from "@/hooks/Categories/Subcategories/useFetchSubcategories";

const AllSubcategoriesComp = () => {
  const router = useRouter();
  const axiosSecure = useAxiosSecure();
  const { subcategoryList, isLoading } = useFetchSubcategories({ isActive: null });

  const handleSave = async (payload: any) => {
    await axiosSecure.patch("/subcategories/reorder", { orders: payload });
    toast.success("Category order updated");
  };

  if (isLoading)
    return (
      <div>
        <LoadingDots />
      </div>
    );

  return (
    <GenericReorderTable
      title="Product Types"
      description="Drag categories to reorder them."
      nowFetching="subcategories"
      initialData={subcategoryList || []}
      isSaving={false}
      onSave={handleSave}
      onEdit={(slug) => router.push(`/admin/subcategory/update/${slug}`)}
    />
  );
};

export default AllSubcategoriesComp