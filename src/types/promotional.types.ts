export type CouponDiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_DELIVERY';

export interface Coupon {
  id: number;
  code: string;
  discountType: CouponDiscountType;
  discountValue?: number | null;
  minOrderValue?: number | null;
  maxDiscount?: number | null;
  expiryDate: string;
  startDate: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}