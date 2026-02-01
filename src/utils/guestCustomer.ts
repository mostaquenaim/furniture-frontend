import axios from "axios";

export interface AuthUser {
  id?: number;
  name?: string;
  email: string;
  phone?: string;
  role: "CUSTOMER" | "ADMIN" | "guest";
}

interface GuestUser {
  email: string;
  password: string;
  role: "guest";
}

export const getCustomerInfo = async (): Promise<AuthUser> => {
  const token = localStorage.getItem("token");

  // Logged-in user
  if (token) {
    try {
      const res = await axios.get<AuthUser>(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      localStorage.setItem("user", JSON.stringify(res.data));
      return res.data;
    } catch {
      // invalid / expired token
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }

  // Guest fallback
  let guestCustomerInfo: GuestUser | null = JSON.parse(
    localStorage.getItem("guestCustomerInfo") || "null",
  );

  if (!guestCustomerInfo) {
    const random = Math.floor(Math.random() * 1000);

    guestCustomerInfo = {
      email: `guest_${Date.now()}_${random}@sakigai.com`,
      password: `guest_${Date.now()}_${random}`,
      role: "guest",
    };

    localStorage.setItem(
      "guestCustomerInfo",
      JSON.stringify(guestCustomerInfo),
    );
  }

  // never store password in user object
  const { password, ...safeGuestInfo } = guestCustomerInfo;

  localStorage.setItem("user", JSON.stringify(safeGuestInfo));
  return safeGuestInfo;
};
