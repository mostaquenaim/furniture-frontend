/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @next/next/no-img-element */
"use client";

import { InfoIcon } from "lucide-react";
import Title from "../Headers/Title";
import TakaIcon from "../TakaIcon";
import ShowProductsFlex from "../ProductDisplay/ShowProductsFlex";
import useFetchCarts from "@/hooks/Cart/useCarts";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import Link from "next/link";
import OrderSummary from "./OrderSummary";
import useCartCount from "@/hooks/Cart/useCartCount";
import { useEffect, useMemo, useState } from "react";
import { RelatedProduct } from "@/hooks/Products/RelatedProducts/useFetchRelatedProducts";
import useAxiosPublic from "@/hooks/Axios/useAxiosPublic";

const CartPageComponent = () => {
  const { cart, isLoading, isFetching, refetch } = useFetchCarts();
  const { refetch: refetchCount } = useCartCount();
  const axiosPublic = useAxiosPublic();

  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);

  const [isRelatedLoading, setIsRelatedLoading] = useState(true);

  // devLog(cart, "cartslocal");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const cartItems = useMemo(() => {
    return cart?.items ?? [];
  }, [cart?.items]);

  const cartItemIds = useMemo(() => {
    return Array.from(
      new Set(
        cartItems
          .map((item) => item.productSize?.color?.product.id)
          .filter((id): id is number => typeof id === "number"),
      ),
    );
  }, [cartItems]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      const response = await axiosPublic.get(
        `/product/you-may-also-like/${cartItems[0].productSize?.color?.product.slug}`,
        {
          params: {
            productIds: cartItemIds.join(","),
          },
        },
      );

      setRelatedProducts(response.data);
      setIsRelatedLoading(false);
    };

    if (cartItems) {
      if (cartItems.length > 0) {
        fetchRelatedProducts();
      }
    }
  }, [axiosPublic, cartItemIds, cartItems]);

  if (isLoading || isFetching) {
    return (
      <div className="max-w-[1500px] mx-auto p-4 lg:p-8">Loading cart...</div>
    );
  }

  // console.log(cartItems,'cartitems');
  const subtotal = Number(cart?.subtotalAtAdd ?? 0);

  const handlingSurcharge = 0;
  const total = subtotal + handlingSurcharge;

  return (
    <div className="max-w-[1500px] mx-auto p-4 lg:p-8 font-sans overflow-x-hidden">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* LEFT: Items List */}
        <div className="flex-1 min-w-0">
          <div className="border mb-4 bg-gray-100">
            <div className="px-4 py-4">
              <p className="text-sm text-gray-600 flex gap-2 items-center">
                <InfoIcon size={16} /> The items in your bags may be on sale
                soon. Check it often and start shopping!
              </p>
            </div>
          </div>

          <Title title="Basket" />

          <header className="hidden md:flex border-b border-gray-200 py-2 text-xs uppercase tracking-wider text-gray-500">
            <div className="flex-2">Item</div>
            <div className="flex-1 text-center">Item Price</div>
            <div className="flex-1 text-center">Quantity</div>
            <div className="flex-1 text-right">Total Price</div>
          </header>

          {/* Map actual cart items */}
          {cartItems.length > 0 ? (
            cartItems.map((item: any) => (
              <CartItemComponent
                key={item.id}
                item={item}
                refetch={refetch}
                refetchCount={refetchCount}
              />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              Your cart is empty
            </div>
          )}

          {/* Favorites Section */}
          {cartItems && cartItems.length > 0 && (
            <div className="mt-16 max-w-full overflow-hidden">
              <Title title="You may also like" />
              <div className="w-full">
                <ShowProductsFlex
                  isLoading={isRelatedLoading}
                  products={relatedProducts}
                  maxWidth="100%"
                />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Order Summary */}
        <aside className="w-full lg:w-96 shrink-0">
          <OrderSummary
            cartId={cart?.id ?? null}
            subtotal={subtotal}
            total={total}
            surcharge={handlingSurcharge}
            refetch={refetch}
            coupon={cart?.coupon?.code}
          />
        </aside>
      </div>
    </div>
  );
};

type CartItemComponentProps = {
  item: any;
  refetch: () => void;
  refetchCount: () => void;
};

const CartItemComponent = ({
  item,
  refetch,
  refetchCount,
}: CartItemComponentProps) => {
  // console.log(item, "caritem");
  const itemTotal = Number(item.subtotalAtAdd);

  const maxQuantity = Math.max(
    1,
    Math.min(10, item.productSize?.quantity ?? 10),
  );

  const axiosSecure = useAxiosSecure();

  const updateQuantity = async (quantity: number) => {
    await axiosSecure.patch(`/cart/items/${item.id}`, {
      quantity,
    });
    refetch();
  };

  const handleRemoveItem = async () => {
    await axiosSecure.delete(`/cart/items/${item.id}`);
    refetch();
    refetchCount();
  };

  return (
    <div className="flex flex-col md:flex-row py-6 border-b border-gray-200 gap-4 items-start md:items-center">
      {/* Product Image & Info */}
      <div className="flex flex-2 gap-4 w-full">
        <Link
          href={`products/${item?.productSize?.color?.product?.slug}`}
          className="w-24 h-32 bg-gray-100 shrink-0 overflow-hidden
             transition-all duration-300
             hover:shadow-md hover:-translate-y-0.5"
        >
          <img
            src={item?.productSize?.color?.product?.images?.[0]?.image || ""}
            alt={item?.productSize?.color?.product?.title || "Product"}
            className="object-cover w-full h-full
               transition-transform duration-300
               hover:scale-110"
            onError={(e) =>
              (e.currentTarget.src = "/images/categories/fallback.jpg")
            }
          />
        </Link>
        <div className="text-sm space-y-1 flex-1">
          <Link
            href={`products/${item?.productSize?.color?.product?.slug}`}
            className="font-medium transition-colors duration-200
               hover:text-primary hover:underline"
          >
            {item?.productSize?.color?.product?.title}
          </Link>
          <p className="text-gray-600">Color: {item.color}</p>
          <p className="text-gray-600">Size: {item.size}</p>
          <div className="flex gap-4 mt-4 text-xs underline cursor-pointer">
            <span onClick={handleRemoveItem}>Remove</span>
            {/* <span>Save for Later</span> */}
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="flex flex-1 w-full justify-between md:justify-center items-center text-sm">
        <span className="md:hidden font-semibold">Price:</span>
        <span className="flex items-center">
          <TakaIcon /> {Number(item.priceAtAdd).toLocaleString()}
        </span>
      </div>

      {/* Quantity */}
      <div className="flex flex-1 w-full justify-between md:justify-center items-center">
        <span className="md:hidden text-sm">Qty:</span>
        <select
          className="border border-gray-300 p-1 text-sm w-16 bg-transparent"
          value={item.quantity}
          onChange={(e) => updateQuantity(Number(e.target.value))}
        >
          {Array.from({ length: maxQuantity }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* Total */}
      <div className="flex flex-1 w-full justify-between md:justify-end items-center font-medium">
        <span className="md:hidden text-sm">Total:</span>
        <span className="flex items-center">
          <TakaIcon /> {Number(itemTotal).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default CartPageComponent;
