export interface Product {
  id: number;
  title: string;
  sku: string;
  isActive: boolean;
  createdAt: string;
  images: ProductImage[];
  subCategories: SubCategoryRelation[];
  colors: ProductColor[];
}

export interface ProductImage {
  id: number;
  url: string;
  serialNo: number;
}

export interface SubCategoryRelation {
  subCategory: {
    id: number;
    name: string;
  };
}

export interface ProductColor {
  id: number;
  color: {
    id: number;
    name: string;
    hexCode: string;
  };
  images: ProductImage[];
  sizes: ProductSizeRelation[];
}

export interface ProductSizeRelation {
  size: {
    id: number;
    name: string;
  };
}

interface ProductsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductsResponse {
  data: Product[];
  meta: ProductsMeta;
}

export interface FetchProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean | null;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}
