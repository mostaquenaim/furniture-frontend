"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthCallback() {
  const router = useRouter();
  const login = useAuth();

//   useEffect(() => {
//     fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
//       credentials: "include",
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         login(data);
//         router.push("/");
//       });
//   }, []);

  return <p>Signing you in...</p>;
}
