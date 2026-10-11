// hooks/useFetchAdminProducts.ts
import { FetchProductsParams } from "@/types/product.types";
import useAxiosSecure from "../Axios/useAxiosSecure";
import { useProductsQuery, UseFetchProductsReturn } from "./useFetchProducts";

/**
 * Staff product listing — can include inactive and out-of-stock products.
 * Needs a staff token:
 * - "/product/admin/all": PRODUCT_VIEW (admin product list)
 * - "/product/admin/flash-sale-picker": FLASH_SALE_MANAGE (flash-sale picker)
 */
const useFetchAdminProducts = (
  params: FetchProductsParams = {},
  endpoint:
    | "/product/admin/all"
    | "/product/admin/flash-sale-picker" = "/product/admin/all",
): UseFetchProductsReturn => {
  const axiosSecure = useAxiosSecure();
  return useProductsQuery(axiosSecure, endpoint, params, true);
};

export default useFetchAdminProducts;
