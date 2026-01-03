export interface Product {
  id: number;
  title: string;
  slug: string;
  sku: string | null;
  description: string | null;
  basePrice: number;
  hasColorVariants: boolean;
  showColor: boolean;
  discountType: string | null;
  discount: number;
  discountEnd: string | null;
  discountStart: string | null;
  note: string | null;
  deliveryEstimate: string | null;
  productDetails: string | null;
  dimension: string | null;
  shippingReturn: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  colors: ProductColor[];
  reviews: Review[];
}

export interface SubCategoryRelation {
  subCategory: {
    id: number;
    name: string;
  };
}

export interface ProductImage {
  id: number;
  image: string;
  serialNo: number;
  productId: number;
}

export interface ProductColorImage {
  id: number;
  image: string;
  serialNo: number;
  productColorId: number;
}

export interface ProductSize {
  id: number;
  sku?: string;
  price: number;
  quantity?: number;
  sizeId?: number;
  colorId?: number;
}

export interface ProductColor {
  id: number;
  useDefaultImages: boolean;
  colorId: number;
  productId: number;
  color: Color;
  images?: ProductColorImage[];
  sizes?: ProductSize[];
}

export interface Color {
  id: number;
  name: string;
  hexCode?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
}

export interface Review {
  id: number;
  rating: number;
  comment?: string;
  user: User;
  userId: number;
  createdAt: Date;
}

export interface User {
  id: number;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  reviews: Review[];
}

enum UserRole {
  SUPERADMIN,
  PRODUCTMANAGER,
  ORDERMANAGER,
  SUPPORT,
  CUSTOMER,
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
