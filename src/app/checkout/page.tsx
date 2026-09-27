import { redirect } from "next/navigation";

// The checkout form lives at /checkout/shipping-address; /checkout itself has
// no UI, so send anything that lands here to the real first step.
const page = () => {
  redirect("/checkout/shipping-address");
};

export default page;
