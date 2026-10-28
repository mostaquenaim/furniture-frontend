import axios from "axios";

export interface AuthUser {
  id: number;
  name?: string;
  email: string;
  phone?: string;
  role: "CUSTOMER" | "ADMIN";
}

export const getCustomerInfo = async (): Promise<AuthUser | null> => {
  const token = localStorage.getItem("token");

  if (!token) return null;

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
  } catch (err) {
    // Only a rejected token signs the user out, never a network or server error
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return null;
  }
};

const decodeTokenPayload = (
  token: string,
): { role?: string; iat?: number } | null => {
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(part));
  } catch {
    return null;
  }
};

// Customers stay signed in until they log out: once a day, while they keep
// visiting, swap their token for a fresh one. Returns the new token, if any.
export const refreshSession = async (): Promise<string | null> => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const payload = decodeTokenPayload(token);
  if (payload?.role !== "CUSTOMER" || !payload.iat) return null;
  if (Date.now() / 1000 - payload.iat < 24 * 60 * 60) return null;

  try {
    const res = await axios.post<{ token: string }>(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );
    // Skip if the user logged out or switched accounts meanwhile
    if (localStorage.getItem("token") !== token) return null;
    localStorage.setItem("token", res.data.token);
    return res.data.token;
  } catch {
    // A rejected token is cleared by getCustomerInfo; anything else: retry next visit
    return null;
  }
};
