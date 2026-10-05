import { isAuthenticated } from "./auth";

export const getVisitorId = async () => {
  // console.log("we are in getVisitorId");

  let visitorId = localStorage.getItem("visitorId");

  if (!visitorId && !isAuthenticated()) {
    const random = Math.floor(Math.random() * 1000);

    visitorId = `${Date.now()}_${random}`;
    localStorage.setItem("visitorId", visitorId);

    // notify backend
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/guest/init`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId }),
    });
  }

  return visitorId;
};

// Query params that identify the cart owner on the shared /cart/* routes.
// Logged-in requests are identified by their token; guests must send their
// visitorId, or the backend rejects the request.
export const cartOwnerParams = async (): Promise<{ visitorId?: string }> => {
  if (isAuthenticated()) return {};
  const visitorId = await getVisitorId();
  return visitorId ? { visitorId } : {};
};
