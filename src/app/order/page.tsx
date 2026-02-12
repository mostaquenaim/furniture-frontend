import OrderDetails from "@/component/Order/OrderDetails";
import { Suspense } from "react";

const OrderByIdPage = () => {
  return (
    <div>
      <Suspense>
        <OrderDetails />
      </Suspense>
    </div>
  );
};

export default OrderByIdPage;
