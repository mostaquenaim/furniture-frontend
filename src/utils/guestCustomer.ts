import axios from "axios";

export const getCustomerInfo = async () => {
  const token = localStorage.getItem("token");

  // 1️⃣ If token exists, verify with backend
  if (token) {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    //   console.log(res.data,'res.data');

      // ✅ Logged-in user
      localStorage.setItem("user", JSON.stringify(res.data));
      return res.data;
    } catch (error) {
      // Token invalid or expired
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }

  // 2️⃣ Guest user fallback
  let guestCustomerInfo = JSON.parse(
    localStorage.getItem("guestCustomerInfo") || "null"
  );

  if (!guestCustomerInfo) {
    const randomNumber = Math.floor(Math.random() * 1000);

    guestCustomerInfo = {
      password: `guest_${Date.now()}_${randomNumber}`,
      email: `guest_${Date.now()}_${randomNumber}@sakigai.com`,
      role: "guest",
    };

    localStorage.setItem(
      "guestCustomerInfo",
      JSON.stringify(guestCustomerInfo)
    );
  }

  localStorage.setItem("user", JSON.stringify(guestCustomerInfo));
  const {password, ...guestInfoWithoutPassword} = guestCustomerInfo;
  console.log(guestInfoWithoutPassword);
  return guestInfoWithoutPassword;
};
