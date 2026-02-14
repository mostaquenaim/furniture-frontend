/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import toast from "react-hot-toast";
import { GenericReorderTable } from "../GenericReorderTable";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import { useRouter } from "next/navigation";
import useFetchCategories from "@/hooks/Categories/Categories/useFetchCategories";
import LoadingDots from "@/component/Loading/LoadingDS";

const AllCategoriesComp = () => {
  const router = useRouter();
  const axiosSecure = useAxiosSecure();
  const { categoryList, isLoading } = useFetchCategories({ isActive: null });

  const handleSave = async (payload: any) => {
    await axiosSecure.patch("/categories/reorder", { orders: payload });
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
      title="Product Categories"
      description="Drag categories to reorder them within their series."
      initialData={categoryList || []}
      isSaving={false}
      onSave={handleSave}
      onEdit={(slug) => router.push(`/admin/category/update/${slug}`)}
    />
  );
};

export default AllCategoriesComp