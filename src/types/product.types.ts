import { SubCategory } from "./menu";

export interface Product {
  id: number;
  title: string;
  slug: string;
  sku: string | null;
  description: string | null;
  basePrice: number;
  price: number;
  hasColorVariants: boolean;
  showColor: boolean;
  discountType?: "PERCENT" | "FIXED";
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
  subCategories: ProductSubCategory[];
}

export interface ProductSubCategory {
  productId: number;
  subCategoryId: number;
  product: Product;
  subCategory: SubCategory;
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
  basePrice?: number;
  price: number;
  quantity?: number;
  sizeId?: number;
  size: ProductSizeRelation;
  colorId?: number;
  color?: ProductColor;
}

export interface ProductColor {
  id: number;
  useDefaultImages: boolean;
  colorId: number;
  color: Color;
  productId: number;
  product: Product;
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
  // size: {
  id: number;
  name: string;
  variantId: number;
  // };
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

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface FetchProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean | null;
}

export interface CartItem {
  id: number;
  cartId?: number;
  quantity: number;
  priceAtAdd: number;
  subtotal: number;
  color?: string;
  size?: string;
  cart?: Cart;
  productSizeId: number;
  productSize?: ProductSize;
  subtotalAtAdd?: number;
  baseSubtotalAtAdd?: number;
}

export type CartStatus = "ACTIVE" | "COMPLETED" | "CANCELLED"; // adjust if you have more

export interface Cart {
  id: number;
  userId: number;
  status: CartStatus;
  createdAt: string;
  updatedAt: string;

  // Relations
  items?: CartItem[];
  user?: User;
}
